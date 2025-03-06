require('dotenv').config();
const { App } = require("@slack/bolt");
const axios = require("axios");
const crypto = require("crypto");

const slackApp = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET
});

(async () => {
  await slackApp.start();
  console.log("⚡ Bot is online via Socket Mode!");
})();

// 🚀 Tratamento de eventos do Slack
const handleSlackEvents = async (req, res) => {
  if (req.body.type === "url_verification") {
    return res.status(200).send(req.body.challenge);
  }

  console.log("Slack Event Received:", req.body);
  res.sendStatus(200);
};

// 🚀 Tratamento de comandos do Slack
const handleSlackCommands = async (req, res) => {
  const { command, text, user_id } = req.body;

  res.json({
    response_type: "ephemeral",
    text: "Processing your request... 🔄",
  });

  if (command === "/mergemate") {
    if (text === "connect github") {
      return res.json({
        response_type: "ephemeral",
        text: `🔗 <@${user_id}>, connecting to GitHub! (This feature is not fully implemented yet)`,
      });
    }
  }

  return res.status(400).send("Invalid command.");
};

// 🚀 Tratamento do Webhook do GitHub
const handleGitHubWebhook = async (req, res) => {
  const signature = req.headers["x-hub-signature-256"];
  const payload = JSON.stringify(req.body);
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    console.error("GitHub webhook secret not configured.");
    return res.status(500).send("Internal server error.");
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;

  if (signature !== digest) {
    console.error("GitHub webhook signature verification failed.");
    return res.status(401).send("Unauthorized.");
  }

  if (req.body.pull_request && req.body.action === "opened") {
    const pr = req.body.pull_request;
    const message = buildSlackMessage(pr);

    try {
      await slackApp.client.chat.postMessage({
        channel: process.env.SLACK_CHANNEL,
        blocks: message,
      });
    } catch (error) {
      console.error("Failed to send slack message:", error);
      return res.sendStatus(500);
    }
  }

  res.sendStatus(200);
};

// 🔹 Constrói a mensagem do Slack para PRs
function buildSlackMessage(pr) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*New Pull Request Opened:* <${pr.html_url}|${pr.title}>`,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Author:*\n${pr.user.login}` },
        { type: "mrkdwn", text: `*Reviewers:*\n${pr.requested_reviewers.map(r => r.login).join(", ") || "None"}` },
      ],
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "View Pull Request", emoji: true },
          url: pr.html_url,
          style: "primary",
        },
      ],
    },
  ];
}

// 🚀 Escutando mensagens do Slack
slackApp.event("message", async ({ event, say, client }) => {
  try {
    if (!event.subtype) {
      const text = event.text.toLowerCase();

      if (text.includes("hello")) {
        await say(`Hello <@${event.user}>! How can I help you?`);
      } else if (text.includes("help")) {
        await say({
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `Here are some things I can do:\n- Say hello\n- Help with pull requests\n- ...`,
              },
            },
          ],
        });
      }

      const userProfile = await client.users.info({ user: event.user });
      console.log(`User real name: ${userProfile.user.profile.real_name}`);
    }
  } catch (error) {
    console.error("Error handling message event:", error);
    await say("An unexpected error occurred while processing your message.");
  }
});

// 🚀 OAuth para instalação do app
slackApp.get("/slack/oauth_redirect", async (req, res) => {
  const code = req.query.code;
  try {
    const response = await slackApp.client.oauth.v2.access({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    });

    console.log("OAuth success:", response);
    res.send("Installation successful!");
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).send("Installation failed.");
  }
});

module.exports = {
  handleSlackEvents,
  handleSlackCommands,
  handleGitHubWebhook,
};
