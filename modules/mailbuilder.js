class MailMessage {
  constructor(to, subject, content) {
    this._to = to;
    this._subject = subject;
    this._content = content;
  }

  get to () { return this._to; }
  get subject () { return this._subject; }
  get content () { return this._content; }
}

class MailBuilder {
  constructor(settings, fromAddress, data) {
    this._data = data;
    this._fromAddress = fromAddress;
    this._settings = settings;
  }

  getMessage() {
    let subject = `Contact request from ${this._fromAddress}`;
    let message = `<h1>${subject}</h1><table>`;

    for (let f in this._data) {
      if (this._settings.allowedFields.indexOf(f) > -1) {
        message += `<tr><th>${f}</th><td>${this._data[f]}</td></tr>`;
      }
    }

    message += "</table>";

    return new MailMessage(this._settings.toAddress, subject, message);
  }

}

module.exports = MailBuilder;
