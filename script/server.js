require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Slack Bot is Running!");
});

app.get("/slack/oauth/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("No code provided");

    try {
        const response = await axios.post("https://slack.com/api/oauth.v2.access", null, {
            params: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                code,
            },
        });

        if (!response.data.ok) return res.status(400).send("OAuth failed: " + response.data.error);

        res.send("Success! Your Slack app is authorized.");
    } catch (error) {
        res.status(500).send("Error fetching OAuth token.");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
