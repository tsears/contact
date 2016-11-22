class Mailer {
  constructor(settings, mailer, transport, log) {
    this.settings = settings;
    this.mailer = mailer;
    this.transport = transport;
    this.log = log;
  }

  sendEmail (to, subject, message) {

  	let transport = this.mailer.createTransport(this.transport({
  		host: this.settings.mailSettings.server,
  		port: this.settings.mailSettings.port,
  		secureConnection: this.settings.mailSettings.secure,
  		auth: {
  			user: this.settings.mailSettings.user,
  			pass: this.settings.mailSettings.pass
  		}
  	}));

  	let mail = {
  		from: this.settings.mailSettings.user,
  		to: this.settings.toAddress,
  		subject: subject,
  		html: message
  	};

    let logger = this.log;
    let settings = this.settings;

    logger.write(`Sending mail to ${mail.to} using ${settings.mailSettings.server}`, 'info');

  	return new Promise((resolve, reject) => {
      transport.sendMail(mail, function(err, resp) {
        logger.write(`Mail sent to ${mail.to} using ${settings.mailSettings.server}`, 'info');
    		if (err) {
    			reject(err);
    		} else {
  		    transport.close();
  		    resolve(resp);
        }
    	});
    });
  }
}


module.exports = Mailer;
