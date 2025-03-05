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

app.post('/slack/events', async (req, res) => {
    try {
        await handleSlackEvents(req, res);
    } catch (error) {
        console.error('Error handling Slack events:', error);
        res.status(500).send('Internal server error.');
    }

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});