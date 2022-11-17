require('dotenv').config();
const { App } = require("@slack/bolt");
const { FileInstallationStore } = require('@slack/oauth');
const { registerListeners } = require('./listeners');

//////////// SLACK APP /////////////////

// const slackApp = new App({
//     token: process.env.SLACK_BOT_TOKEN,
//     signingSecret: process.env.SLACK_SIGNING_SECRET,
//     socketMode: true, // add this
//     appToken: process.env.SLACK_APP_TOKEN,
//     port: process.env.PORT
//     // appToken: 
//   });

const slackApp = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    port: process.env.SLACK_PORT,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    stateSecret: 'cluedev',
    scopes: ['channels:read', 'chat:write', 'incoming-webhook', 'im:history', 'groups:history', 'channels:history'],
    installationStore: new FileInstallationStore()
  });

// const slackApp = new App({
//     signingSecret: process.env.SLACK_SIGNING_SECRET,
//     clientId: process.env.SLACK_CLIENT_ID,
//     clientSecret: process.env.SLACK_CLIENT_SECRET,
//     stateSecret: 'cluedev',
//     scopes: ['channels:read', 'chat:write', 'incoming-webhook', 'im:history', 'groups:history', 'channels:history'],
//     installationStore: new FileInstallationStore(),
//   });


// Find conversation ID using the conversations.list method
// async function findConversation(name) {
//     try {
//       // Call the conversations.list method using the built-in WebClient
//       const result = await slackApp.client.conversations.list({
//         // The token you used to initialize your app
//         token: process.env.SLACK_BOT_TOKEN
//       });
  
//       for (const channel of result.channels) {
//         if (channel.name === name) {
//           let conversationId = channel.id;
//           console.log("Found conversation ID: " + conversationId);
//           break;
//         }
//       }
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }
  
//   // Find conversation with a specified channel `name`
//   findConversation("dream-team");
  
//   // Post a message to a channel your app is in using ID and message text
//   async function publishMessage(id, text) {
//     try {
//       // Call the chat.postMessage method using the built-in WebClient
//       const result = await slackApp.client.chat.postMessage({
//         // The token you used to initialize your app
//         token: process.env.SLACK_BOT_TOKEN,
//         channel: id,
//         text: text
//         // You could also use a blocks[] array to send richer content
//       });
  
//       // Print result, which includes information about the message (like TS)
//       console.log(result);
//     }
//     catch (error) {
//       console.error(error);
//     }
//   }
  
//   publishMessage("C04AYKHU1QE", "Hello world :tada:");

  slackApp.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there you bastard <@${message.user}>!`);
  });

// registerListeners(slackApp);
  
  (async () => {
    // Start your app
    await slackApp.start();
  
    console.log(`⚡️ Bolt app is running on port ${process.env.SLACK_PORT}`);
  })();
