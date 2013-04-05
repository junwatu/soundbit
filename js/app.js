SC.initialize({
	client_id: '75b58a823bb6eba65437a5d0838b311a',
	redirect_uri: "http://www.junwatu.com/apps/havesomefun/callback.html"
});

// Embed player
SC.oEmbed("https://soundcloud.com/devicetheband", {color: "ff0000"},  document.getElementById("player"));

/**
SC.stream("/tracks/83992722", {
	autoPlay: true,
	ontimedcomments: function(comments){
		console.log(commentsp[0].body)
	}
});

*/
