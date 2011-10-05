//Ti.include()
//


Ti.Facebook.appid = "280459581967624";
Ti.Facebook.permissions = ['publish_stream', 'read_stream'];


var currentWindow = Ti.UI.currentWindow;


// 1. check network connection status.
// 2. request user login to FB

currentWindow.addEventListener('open', function(e){

    if (!Ti.Network.online) {
        alert('No network connections');
        return;
    }

    // Login the user and authorize our app
    Ti.Facebook.authorize();

});


// TODO
// Layout the Main Window