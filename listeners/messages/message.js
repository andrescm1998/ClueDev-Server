const helloBack = async ({ message, say }) => {
        // say() sends a message to the channel where the event was triggered
        await say(`Hey there you bastard <@${message.user}>!`);
      };

module.exports = { helloBack };
