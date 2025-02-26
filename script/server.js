const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/slack/events', (req, res) => {
    if (req.body.type === 'url_verification') {
        return res.status(200).send(req.body.challenge); // Responde com o challenge
    }
    console.log('Evento recebido:', req.body);
    res.sendStatus(200);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
