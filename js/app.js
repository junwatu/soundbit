/**
 * SoundWig
 * Have Some Fun
 *
 * Streaming from  SoundCloud and Visualize using Web Audio API
 *
 *
 * NOTE:
 * TESTED on Google Chrome Version 27.0.1453.65 beta!!
 *
 *
 * Equan Pr.
 * www.junwatu.com
 * 2013
 */

// SoundCloud ID
var CLIENT_ID = 'YOUR_SOUNDCLOUD_CLIENT_ID';

// Get Audio Tag Id
var audioElementSource = document.getElementById('audioElement');

// Authorize
SC.initialize({
    client_id: CLIENT_ID
});

// Permalink to a track
var track_url = 'https://soundcloud.com/centurymedia/02-the-science-of-noise',
    TRACK = "";

// Resolve track id from permalink
SC.get('/resolve', { url: track_url }, function (track) {
    TRACK = "/tracks/" + track.id;

    SC.stream(TRACK,function(sound){
        console.log(sound);
        audioElementSource.src = sound.url;
        audioElementSource.autoplay = false;
    });

    SC.whenStreamingReady(function () {
        SC.get(TRACK, function (track) {
            //console.log(track);
            infoFile(track);
        });
    });

});

function infoFile(track) {
    var li0 = document.getElementById('title');
    li0.innerHTML = "<strong>" + track.title + "</strong>";

    var album_cover = document.getElementById('cover');
    album_cover.src = track.artwork_url;

}

/**
 * Web Audio API
 */
var WIDTH = 330;
var HEIGHT = 130;

// Interesting parameters to tweak!
var SMOOTHING = 0.2;
var FFT_SIZE = 128;

var contextClass = (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext);

if(contextClass){
    var context = new webkitAudioContext(),
        analyser = context.createAnalyser();

}else {
    alert("Your browser not supported!");
}

audioElementSource.addEventListener("canplay", function () {
    var sourceNode = context.createMediaElementSource(audioElementSource);
    sourceNode.connect(analyser);
    analyser.connect(context.destination);
    visualize();
});

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})

analyser.minDecibels = -140;
analyser.maxDecibels = 0;

/**
 * Visualize with canvas
 */
function visualize() {
    var canvas = document.querySelector('canvas');
    var drawContext = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    window.webkitRequestAnimationFrame(visualize, canvas);

    var freqs = new Uint8Array(analyser.frequencyBinCount);

    analyser.smoothingTimeConstant = SMOOTHING;
    analyser.fftSize = FFT_SIZE;

    /**
     * Draw the frequency domain chart.
     * Get the frequency data from the currently playing music
     */
    analyser.getByteFrequencyData(freqs);

    for (var i = 0; i < analyser.frequencyBinCount; i++) {
        var value = freqs[i];
        var percent = value / 256;
        var height = HEIGHT * percent;
        var offset = HEIGHT - height - 1;
        var barWidth = WIDTH / analyser.frequencyBinCount;
        var hue = i / analyser.frequencyBinCount * 360;
        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';

        drawContext.fillRect(i * barWidth, offset, barWidth, height);
    }
}