require('dotenv').config();
const { App } = require('@slack/bolt');

const slackApp = new App({
  token: process.env.BOT_TOKEN,
  appToken: process.env.APP_LEVEL_TOKEN,
  socketMode: true,
});

slackApp.event('message', async ({ event, say }) => {
  console.log(`Mensagem recebida: ${event.text}`);
  await say(`Recebi tua mensagem: "${event.text}"`);
});

module.exports = slackApp;
