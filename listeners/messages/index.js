const { helloBack } = require ('./message');

module.exports.register = (slackApp) => {
    slackApp.message('hello', helloBack);
}
