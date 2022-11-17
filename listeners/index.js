const messages = require('./messages');

module.exports.registerListeners = (slackApp) => {
    messages.register(slackApp);
  };
