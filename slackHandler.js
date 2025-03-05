require('dotenv').config();
const { App } = require('@slack/bolt');
const axios = require('axios');
const crypto = require('crypto');

const slackApp = new App({
    token: process.env.BOT_TOKEN,
    appToken: process.env.APP_LEVEL_TOKEN,
    socketMode: true,
});

(async () => {
    await slackApp.start();
    console.log('⚡ Bot is online via Socket Mode!');
})();

const handleSlackEvents = (req, res) => {
    if (req.body.type === 'url_verification') {
        return res.status(200).send(req.body.challenge);
    }
    console.log('Slack Event Received:', req.body);
    res.sendStatus(200);
};

const handleSlackCommands = async (req, res) => {
    const { command, text, user_id } = req.body;

    if (command === '/mergemate') {
        if (text === 'connect github') {
            return res.json({
                response_type: 'ephemeral',
                text: `🔗 <@${user_id}>, connecting to GitHub! (This feature is not fully implemented yet)`
            });
        }
    }

    return res.status(400).send('Invalid command.');
};

const handleGitHubWebhook = async (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!secret) {
        console.error('GitHub webhook secret not configured.');
        return res.status(500).send('Internal server error.');
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    if (signature !== digest) {
        console.error('GitHub webhook signature verification failed.');
        return res.status(401).send('Unauthorized.');
    }

    if (req.body.pull_request && req.body.action === 'opened') {
        const pr = req.body.pull_request;
        const message = buildSlackMessage(pr);
        try{
            await slackApp.client.chat.postMessage({
                channel: process.env.SLACK_CHANNEL,
                blocks: message
            });
        } catch (error) {
            console.error('Failed to send slack message:', error);
            return res.sendStatus(500);
        }
    }
    res.sendStatus(200);
};

function buildSlackMessage(pr) {
    const prUrl = pr.html_url;
    const prTitle = pr.title;
    const prUser = pr.user.login;
    const reviewers = pr.requested_reviewers.map(r => r.login).join(', ') || 'None';

    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*New Pull Request Opened:* <${prUrl}|${prTitle}>`
            }
        },
        {
            type: 'section',
            fields: [
                {
                    type: 'mrkdwn',
                    text: `*Author:*\n${prUser}`
                },
                {
                    type: 'mrkdwn',
                    text: `*Reviewers:*\n${reviewers}`
                }
            ]
        },
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'View Pull Request',
                        emoji: true
                    },
                    url: prUrl,
                    style: 'primary'
                }
            ]
        }
    ];
}

// Slack app actions and views
slackApp.event('message', async ({ event, say, client }) => {
    // ... (Your existing message event logic)
});

slackApp.action('my_button_click', async ({ ack, body, client }) => {
    // ... (Your existing button click logic)
});

slackApp.shortcut('review_pr', async ({ shortcut, ack, client }) => {
    // ... (Your existing shortcut logic)
});

slackApp.view('review_pr_modal', async ({ ack, view, client, body }) => {
    // ... (Your existing modal logic)
});

module.exports = {
    handleSlackEvents,
    handleSlackCommands,
    handleGitHubWebhook,
};

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        // You can add file transports for persistent logging
    ],
});

// In your catch blocks:
try {
    // ... your code
} catch (error) {
    logger.error('Error occurred:', error);
    // ...
}