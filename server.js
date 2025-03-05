require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handleSlackEvents, handleSlackCommands, handleGitHubWebhook } = require('./slackHandler');
const app = express();

app.use(bodyParser.json());

// Slack Events (URL verification and events)
app.post('/slack/events', handleSlackEvents);

// Slack Commands
app.post('/slack/command', handleSlackCommands);

// GitHub Webhook
app.post('/github/webhook', handleGitHubWebhook);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});