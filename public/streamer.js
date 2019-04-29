var video = document.querySelector('video');

// Need to be specific for Blink regarding codecs
var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
    var mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', sourceOpen);
} else {
    console.error('Unsupported MIME type or codec: ', mimeCodec);
}

function sourceOpen(_) {
    console.log(this.readyState); // open
    var mediaSource = this;
    var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    fetchAB('/stream', function (buf) {
        sourceBuffer.addEventListener('updateend', function (_) {
            mediaSource.endOfStream();
            video.play();
            console.log(mediaSource.readyState); // ended
        });
        sourceBuffer.appendBuffer(buf);
    });
}

// Callback to get arraybuffer of video
function fetchAB(url, cb) {
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
        cb(xhr.response);
    };
    xhr.send();
}