require('dotenv').config();
const { App, SocketModeReceiver } = require("@slack/bolt");

const socketModeReceiver = new SocketModeReceiver({
    appToken: process.env.SLACK_APP_TOKEN,
    // enable the following if you want to use OAuth
    // clientId: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET,
    // stateSecret: 'my-state-secret',
    // scopes: ['channels:read', 'chat:write', 'app_mentions:read', 'channels:manage', 'commands'],
  });

const slackApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.SLACK_PORT,
    receiver: socketModeReceiver
  });

  slackApp.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
  });

  (async() => {
    await slackApp.start();
    console.log("bolt app is running");
  })();
