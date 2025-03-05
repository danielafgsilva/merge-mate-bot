require('dotenv').config();
const { App } = require('@slack/bolt');

const slackApp = new App({
    token: process.env.BOT_TOKEN,
    appToken: process.env.APP_LEVEL_TOKEN,
    socketMode: true,
});

slackApp.event('message', async ({ event, say, client }) => {
    console.log(`Mensagem recebida: ${event.text}`);
    try {
        await client.chat.postMessage({
            channel: event.channel,
            text: `Recebi tua mensagem: "${event.text}"`,
            blocks: [
                {
                    type: 'actions',
                    elements: [
                        {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Click Me!',
                            },
                            action_id: 'my_button_click',
                        },
                    ],
                },
            ],
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

slackApp.action('my_button_click', async ({ ack, body, client }) => {
    await ack();
    try {
        await client.chat.postMessage({
            channel: body.channel.id,
            text: 'Button Clicked!',
        });
    } catch (error) {
        console.error('Error posting message:', error);
    }
});

module.exports = slackApp;