/**
 * Soundbit
 * Have Some Fun
 *
 * Streaming from  SoundCloud and Visualize using Web Audio API
 *
 *
 * Equan Pr.
 * 2018
 */

var CLIENT_ID = '75b58a823bb6eba65437a5d0838b311a';
var audioElementSource = document.getElementById('audioElement');

// Handle MediaElementAudioSource outputs zeroes due to CORS access restrictions
audioElementSource.crossOrigin="anonymous";

SC.initialize({
    client_id: CLIENT_ID,
    redirect_uri: 'http://localhost:3003/callback'
});

// Permalink to a track
//var track_url = 'https://soundcloud.com/roadrunner-usa/killswitch-engage-the-end-of';
var track_url = 'https://soundcloud.com/equan-pr/kidung-kolosebo';
// var track_url = 'https://soundcloud.com/listen-to-aftercoma/03-jelaga';

var TRACK;

const resolvePromise = SC.get('/resolve', { url: track_url }, function (track) {

    console.log(track);

    // damn! some good song is unstreamable      
    if (track.streamable) {
        TRACK = "/tracks/" + track.id;

        SC.stream(TRACK, function (sound) {
            audioElementSource.src = sound.url;
            audioElementSource.autoplay = false;
        });

        SC.whenStreamingReady(function () {
            SC.get(TRACK, function (track) {
                infoFile(track);
            });
        });
    } else {
        alert('Audio not streamable! :(');
    }
});

function infoFile(track) {
    var li0 = document.getElementById('title');
    li0.innerHTML = "<strong>" + track.title + "</strong>";

    var album_cover = document.getElementById('cover');
    
    if(track.artwork_url === null) {
        album_cover.src = track.user.avatar_url;
    } else {
        album_cover.src = track.artwork_url;
    }
  
}

var WIDTH = 330;
var HEIGHT = 110;
var SMOOTHING = 0.2;
var FFT_SIZE = 128;
var context = new AudioContext();
var analyser = context.createAnalyser();
var gain = context.createGain();

audioElementSource.addEventListener("canplay", function () {
    var sourceNode = context.createMediaElementSource(audioElementSource);

    sourceNode.connect(analyser);
    analyser.connect(gain);
    gain.connect(context.destination);
    visualize();

});

audioElementSource.addEventListener("volumechange", function () {
    gain.gain.value = audioElementSource.volume;
});

var canvas = document.querySelector('canvas');
var drawContext = canvas.getContext('2d');
var freqs = new Uint8Array(analyser.frequencyBinCount);

analyser.minDecibels = -140;
analyser.maxDecibels = 0;
analyser.smoothingTimeConstant = SMOOTHING;
analyser.fftSize = FFT_SIZE;

/**
 * Visualize with canvas
 */
function visualize() {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    requestAnimationFrame(visualize, canvas);

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
