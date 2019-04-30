// Streaming for videos
const express = require('express');
const path = require('path');
const fs = require('fs');
const port = 80;
const app = express();
const router = express.Router();
const favicon = require('serve-favicon')

// Root
router.get('/', (req, res) => {
    console.log("receiving request");
    res.sendFile(path.join(__dirname + '/content/index.html'));
});

// Video Tab
router.get('/video', (req, res) => {
    console.log("video page");
    res.sendFile(path.join(__dirname + '/content/video.html'));
});

// Music Tab
router.get('/music', (req, res) => {
    console.log("music page");
    res.sendFile(path.join(__dirname + '/content/music.html'));
});

// Streaming function
router.get('/stream', (req, res) => {
    console.log(req.url);
    let t = req.url;

    // Default Value
    if (t.indexOf('?') === -1) {
        t = '/stream?movie=MeshNet.mov';
    }

    // Retrieve requested media file
    t = t.split("?");
    t.splice(0, 1);
    let video = t[0].split('=')[1];
    const path = __dirname + `/${video}`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ?
            parseInt(parts[1], 10) : //parse the integer of type decimal
            fileSize - 1;
        const chunksize = (end - start) + 1;
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

app.use('/', router);
app.use('/public', express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));