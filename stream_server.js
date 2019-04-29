// Streaming for videos
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

router.get('/stream', (req, res) => {
    let t = req.url;

    if (t.indexOf('?') === -1)
        t = '/stream?movie=Avengers.mov';

    t = t.split("?");
    t.splice(0, 1);
    let video = t[0].split('=')[1];
    const path = __dirname + `/videos/${video}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ?
            parseInt(parts[1], 10) : //parse the integer of type decimal
            fileSize - 1;
        const chunksize = (end - start) + 1; // chu
        const file = fs.createReadStream(path, {
            start,
            end
        });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
});

app.get('/content/*', (req, res) => {
    res.sendFile(path.join(__dirname + req.url));
});

app.use('/', router);
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));