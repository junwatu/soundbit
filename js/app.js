/**
 * SoundWig
 * --------------------------------------------------------------
 * Have Some Fun
 *
 * Streaming from  SoundCloud and Visualize using Web Audio API
 *
 *
 *
 * Equan Pr.
 * 2013 (c) www.junwatu.com
 *
 */


"use strict";

//========================== Soundcloud ================================

// set to your soundcloud id
var CLIENT_ID = '75b58a823bb6eba65437a5d0838b311a';

var audio = new Audio();

// Authorize
SC.initialize({
    client_id: CLIENT_ID,
    redirect_uri: "http://www.junwatu.com/apps/havesomefun/callback.html"
});

// permalink to a track
var track_url = 'https://soundcloud.com/centurymedia/02-the-science-of-noise',
    TRACK = "";

SC.get('/resolve', { url: track_url }, function (track) {
    TRACK = "/tracks/" + track.id;

    SC.stream(TRACK, function (sound) {
        audio.src = sound.url;
        audio.autoplay = true;
    });

    SC.whenStreamingReady(function () {
        SC.get(TRACK, function (track) {
            console.log(track);
            infoFile(track);
        });
    });
});

function infoFile(track) {
    var li1 = document.getElementById('user');
    li1.innerHTML = "<strong>" + track.user.username + "</strong>";

    var li0 = document.getElementById('title');
    li0.innerHTML = "<strong>" + track.title + "</strong>";

    var album_cover = document.getElementById('cover');
    album_cover.src = track.artwork_url;
}

/**
 * Web Audio API
 *
 */
// Interesting parameters to tweak!
var SMOOTHING = 0.1;
var FFT_SIZE = 128;

var context = new webkitAudioContext(),
    analyser = context.createAnalyser();


audio.addEventListener("canplay", function () {
    console.log("canplay");
    var sourceNode = context.createMediaElementSource(audio);
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


var canvas = document.querySelector('canvas'),
    drawContext = canvas.getContext('2d'),
    freqs = new Uint8Array(analyser.frequencyBinCount),
    gradientColor = drawContext.createLinearGradient(0, 0, 0, 300);

gradientColor.addColorStop(1, '#000000');
gradientColor.addColorStop(0.75, '#ff0000');
gradientColor.addColorStop(0.25, '#ffff00');
gradientColor.addColorStop(0, '#ffffff');

analyser.minDecibels = -140;
analyser.maxDecibels = 0;
analyser.smoothingTimeConstant = SMOOTHING;
analyser.fftSize = FFT_SIZE;

// Draw the frequency domain chart.
// Get the frequency data from the currently playing music
analyser.getByteFrequencyData(freqs);

//==================================== Visualize Functions ==================================//
function visualize() {

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    window.webkitRequestAnimationFrame(visualize, canvas);

    for (var i = 0; i < analyser.frequencyBinCount; i++) {
        var value = freqs[i];
        var percent = value / 256;
        var height = HEIGHT * percent;
        var offset = HEIGHT - height - 1;
        var barWidth = WIDTH / analyser.frequencyBinCount;
        var hue = i / analyser.frequencyBinCount * 360;

        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';

        //drawContext.fillStyle = gradientColor;
        drawContext.fillRect(i * barWidth, offset, barWidth, height);
    }
}

//=======================================================================================//