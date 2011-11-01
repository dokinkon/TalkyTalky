Ti.include('../talky.js')



Ti.Facebook.appid = "280459581967624";
Ti.Facebook.permissions = ['publish_stream', 'read_stream'];


var currentWindow = Ti.UI.currentWindow;

var fbButton = Ti.Facebook.createLoginButton({
	'style':'wide',
	bottom:10
});

currentWindow.add(fbButton);


// Create Here Button
var hereButton = Ti.UI.createButton({
    top:'10%',
    width:60,
    height:60,
    backgroundImage:'../images/here.png',
    backgroundSelectedImage:'../images/here-pressed.png',
});

currentWindow.add(hereButton);

var optionButton = Ti.UI.createButton({
    top:'30%',
    right:'10%',
    width:60,
    height:60,
    backgroundImage:'../images/option.png',
    backgroundSelectedImage:'../images/option-pressed.png',

});
currentWindow.add(optionButton);

var aboutMeButton = Ti.UI.createButton({
    top:'50%',
    right:'10%',
    width:60,
    height:60,
    backgroundImage:'../images/about-me.png',
    backgroundSelectedImage:'../images/about-me-pressed.png',
});
currentWindow.add(aboutMeButton);

var beautyMapButton = Ti.UI.createButton({
    top:'30%',
    left:'10%',
    width:60,
    height:60,
    backgroundImage:'../images/beauty-map.png',
    backgroundSelectedImage:'../images/beauty-map-pressed.png',
});
currentWindow.add(beautyMapButton);

var favoriteButton = Ti.UI.createButton({
    top:'50%',
    left:'10%',
    width:60,
    height:60,
    backgroundImage:'../images/favorite.png',
    backgroundSelectedImage:'../images/favorite-pressed.png',
});
currentWindow.add(favoriteButton);

var mailBoxButton = Ti.UI.createButton({
    top:'70%',
    left:'25%',
    width:60,
    height:60,
    backgroundImage:'../images/mail-box.png',
    backgroundSelectedImage:'../images/mail-box-pressed.png',
});
currentWindow.add(mailBoxButton);

var responseButton = Ti.UI.createButton({
    top:'70%',
    right:'25%',
    width:60,
    height:60,
    backgroundImage:'../images/response.png',
    backgroundSelectedImage:'../images/response-pressed.png',
});
currentWindow.add(responseButton);


var versionLabel = Ti.UI.createLabel({
    bottom:'2%',
    right:'2%',
    height:20,
    width:64,
    backgroundColor:'#FFF',
    text:Talky.version,
});

currentWindow.add(versionLabel);


Ti.Facebook.addEventListener('login', function(e) {

    if (e.success) {
        Ti.API.info('login Facebook successful');
        Talky.login();
    }
    else {
        alert(e.error);
    }
});

// 1. check network connection status.
// 2. request user login to FB

currentWindow.addEventListener('open', function(e){

    if (!Ti.Network.online) {
        alert('No network connections');
        return;
    }

    if (Ti.Facebook.loggedIn) {
        Talky.login();
    }
    else {
        // Login the user and authorize our app
        Ti.Facebook.authorize();
    }
});




// TODO
// Layout the Main Window
//




























