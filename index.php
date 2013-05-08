<!DOCTYPE HTML>
<html>
<head>
    <title>SoundWig</title>

    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
<div id="main">
    <div id="info">
        <img id="cover" class="cover">
        <ul id="fileinfo">
            <li id="user" class="user"></li>
            <li id="title"></li>
        </ul>
    </div>
    <a href="http://soundcloud.com/" target="blank">
        <img src="images/logo_black.png" id="soundcloud-logo"/>
    </a>
    <canvas id="playbutton" width="45" height="45"></canvas>
    <canvas id="canvas"></canvas>
</div>

<footer>
    <!--
    <pre><a href="">Github</a> Copyright &copy; 2013 <a href="http://www.junwatu.com">JunWatu.Com</a></pre>
	-->
</footer>
<script type="text/javascript" src="http://connect.soundcloud.com/sdk.js"></script>
<script type="text/javascript" src="js/app.js"></script>
<script type="text/javascript" src="js/button.js"></script>
</body>
</html>
