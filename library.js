// Sending files (?)
const express = require('express');
const path = require('path');
const fs = require('fs');

const port = 80;
const app = express();
const router = express.Router();

router.get('/', (req, res) => {
    console.log("recieving request");
    res.sendFile(path.join(__dirname + '/content/index.html'));
});

router.get('/', (req, res) => {
    res.sendFile("the file");
});

app.use('/', router);
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));