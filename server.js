require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handleSlackEvents, handleSlackCommands, handleGitHubWebhook } = require('./slackHandler');

const app = express();

app.use(bodyParser.json());

// Slack Commands
app.post('/slack/command', handleSlackCommands);

// GitHub Webhook
app.post('/github/webhook', handleGitHubWebhook);

// Slack Events
app.post('/slack/events', async (req, res) => {
    if (req.body.type === 'url_verification') {
        return res.status(200).send(req.body.challenge);
    }

    try {
        await handleSlackEvents(req, res);
    } catch (error) {
        console.error('Error handling Slack events:', error);
        res.status(500).send('Internal server error.');
    }
});

app.get("/slack/oauth_redirect", async (req, res) => {
    const code = req.query.code;
    try {
        const response = await slackApp.client.oauth.v2.access({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code,
        });

        console.log("OAuth success:", response);
        res.send("Installation successful!");
    } catch (error) {
        console.error("OAuth error:", error);
        res.status(500).send("Installation failed.");
    }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
