class Mailer {
  constructor(settings, mailer, transport, log) {
    this.settings = settings;
    this.mailer = mailer;
    this.transport = transport;
    this.log = log;
  }

  sendEmail (to, subject, message) {

  	let transport = this.mailer.createTransport(this.transport({
  		host: this.settings.mailServer,
  		port: 587,
  		secureConnection: false,
  		auth: {
  			user: this.settings.emailUser,
  			pass: this.settings.emailPass
  		}
  	}));

  	let mail = {
  		from: this.settings.emailUser,
  		to: this.settings.toAddress,
  		subject: subject,
  		html: message
  	};

    let logger = this.log;
    let settings = this.settings;

    logger.write(`Sending mail to ${mail.to} using ${settings.mailServer}`, 'info');
  	return new Promise((resolve, reject) => {
      transport.sendMail(mail, function(err, resp) {
        logger.write(`Mail sent to ${mail.to} using ${settings.mailServer}`, 'info');
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
