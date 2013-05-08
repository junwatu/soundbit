/**
 * SoundWig
 * --------------------------------------------------------------
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

console.log("Have Some Fun with Soundcloud API & Web Audio API");
console.log("http://www.junwatu.com");

//========================== Soundcloud ================================

// set to your soundcloud id
var CLIENT_ID = '75b58a823bb6eba65437a5d0838b311a';

/**
*  TODO: Make this id track dynamic
*/
var TRACK = "/tracks/88015339";

SC.initialize({
	client_id: CLIENT_ID,
	redirect_uri: "http://www.junwatu.com/apps/havesomefun/callback.html"
});

var audio = new Audio(),
    soundURL= "";
    
SC.stream(TRACK, function(sound){
	soundURL = sound.url;
});

SC.whenStreamingReady(function(){
	console.log("Streaming ready!");
	console.log(soundURL);
	audio.src = soundURL;
	audio.autoplay = true;

    SC.get(TRACK, function(track){
        console.log(track);
        infoFile(track);
    });
});

/**
* Web Audio API
*
*/
var WIDTH = 330;
var HEIGHT = 100;

// Interesting parameters to tweak!
var SMOOTHING = 0.1;
var FFT_SIZE =128;

var context = new webkitAudioContext(),
    analyser = context.createAnalyser();
      
   
audio.addEventListener("canplay", function() {
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

analyser.minDecibels = -140;
analyser.maxDecibels = 0;

//==================================== Visualize Functions ==================================//
function visualize() {
    var canvas = document.querySelector('canvas');
    var drawContext = canvas.getContext('2d');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // alternative color style
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

        //drawContext.fillStyle = gradientColor;
        drawContext.fillRect(i * barWidth, offset, barWidth, height);
    }
}

function getFrequencyValue(frequency) {
    var nyquist = context.sampleRate / 2;
    var index = Math.round(frequency / nyquist * freqs.length);
    return freqs[index];
}

function infoFile(track) {
    var li1 = document.getElementById('user');
    li1.innerHTML = "<strong>" + track.user.username + "</strong>";

    var li0 = document.getElementById('title');
    li0.innerHTML = "<strong>" + track.title + "</strong>";
 
    var album_cover = document.getElementById('cover');
    album_cover.src = track.artwork_url;

}

//=================================================================================

