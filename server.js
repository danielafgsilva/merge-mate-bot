const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/slack/events', (req, res) => {
    if (req.body.type === 'url_verification') {
        return res.status(200).send(req.body.challenge);
    }
    console.log('Evento recebido:', req.body);
    res.sendStatus(200);
});

app.post('/slack/command', async (req, res) => {
    const { command, text, user_id } = req.body;

    if (command === '/mergemate') {
        if (text === 'connect github') {
            return res.json({
                response_type: 'ephemeral',
                text: `🔗 <@${user_id}>, estou a conectar ao GitHub!`
            });
        }
    }

    return res.status(400).send('Comando inválido.');
});


const axios = require('axios');

async function connectGitHub(userToken) {
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${userToken}`
            }
        });

        console.log('Connected to GitHub:', response.data);
        return response.data;
    } catch (error) {
        console.error('GitHub connection error:', error.response ? error.response.data : error);
        throw error;
    }
}


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});

const slackApp = require('./socketMode');

(async () => {
  await slackApp.start();
  console.log('⚡ Bot está online via Socket Mode!');
})();
