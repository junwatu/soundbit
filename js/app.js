/**
 * Have Some Fun
 *
 * Playing around with SoundCloud API
 *
 *
 * Equan Pr.
 * www.junwatu.com
 * 2013
 */

console.log("Web Audio API Rock On!");

var CLIENT_ID = '75b58a823bb6eba65437a5d0838b311a';
var WIDTH = 960;
var HEIGHT = 300;

// Interesting parameters to tweak!
var SMOOTHING = 0.2;
var FFT_SIZE = 128;

SC.initialize({
	client_id: CLIENT_ID,
	redirect_uri: "http://localhost:8080/callback.html"
});

var audioElementSource = document.getElementById('audioElement');

SC.stream("/tracks/83992722", function(sound){
	audioElementSource.src = sound.url;
});


var context = new webkitAudioContext(),
    analyser = context.createAnalyser(),
    sourceNode = context.createMediaElementSource(audioElementSource);
    sourceNode.connect(analyser);
    analyser.connect(context.destination);
    visualize();

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})

analyser.minDecibels = -140;
analyser.maxDecibels = 0;

//==================================== Functions ==================================//
function visualize() {
    var canvas = document.querySelector('canvas');
    var drawContext = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    var gradientColor = drawContext.createLinearGradient(0, 0, 0, 300);
    gradientColor.addColorStop(1, '#000000');
    gradientColor.addColorStop(0.75, '#ff0000');
    gradientColor.addColorStop(0.25, '#ffff00');
    gradientColor.addColorStop(0, '#ffffff');

    window.webkitRequestAnimationFrame(visualize, canvas);

    var freqs = new Uint8Array(analyser.frequencyBinCount);
    var times = new Uint8Array(analyser.frequencyBinCount);

    analyser.smoothingTimeConstant = SMOOTHING;
    analyser.fftSize = FFT_SIZE;

    // Draw the frequency domain chart.
    // Get the frequency data from the currently playing music
    analyser.getByteFrequencyData(freqs);

    var width = Math.floor(1 / freqs.length, 10);

    for (var i = 0; i < analyser.frequencyBinCount; i++) {
        var value = freqs[i];
        var percent = value / 256;
        var height = HEIGHT * percent;
        var offset = HEIGHT - height - 1;
        var barWidth = WIDTH / analyser.frequencyBinCount;
        var hue = i / analyser.frequencyBinCount * 360;
        drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';

        //drawContext.fillStyle = gradient;
        drawContext.fillRect(i * barWidth, offset, barWidth, height);
    }
}

function getFrequencyValue(frequency) {
    var nyquist = context.sampleRate / 2;
    var index = Math.round(frequency / nyquist * freqs.length);
    return freqs[index];
}
