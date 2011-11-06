
Ti.Facebook.appid = "280459581967624";
Ti.Facebook.permissions = ['publish_stream', 'read_stream'];
Ti.Geolocation.purpose = 'Talky-Talky';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;

var talky = {}
talky.version = "v0.0.1";
talky.author = ["chao-chih.lin", "wei-cheng.liu"];
talky.copyright = "Lynx Interactive";
talky.app = {};
talky.app.osname = Titanium.Platform.osname;
talky.app.version = Titanium.Platform.version;


// test Date
var rightNow = new Date();
Ti.API.info('rightNow:getFullYear = ' + rightNow.getFullYear());
Ti.API.info('rightNow:getMonth = ' + rightNow.getMonth());
Ti.API.info('rightNow:getDate = ' + rightNow.getDate());
Ti.API.info('rightNow:getHours = ' + rightNow.getHours());
Ti.API.info('rightNow:getMinutes = ' + rightNow.getMinutes());
Ti.API.info('rightNow:getSeconds = ' + rightNow.getSeconds());
Ti.API.info('rightNow:getTimezoneOffset = ' + rightNow.getTimezoneOffset());
Ti.API.info('rightNow:getUTCHours = ' + rightNow.getUTCHours());


Ti.include('ui.js');
Ti.include('service.js')
Ti.include('data.js')


talky.ui.appTabGroup.open();

Ti.Facebook.addEventListener('login', function(e) {

    if (e.success) {
        Ti.API.info('login Facebook successful');
        talky.service.login();
    }
    else {
        alert(e.error);
    }
});

// 1. check network connection status.
// 2. request user login to FB
if (!Ti.Network.online) {
    alert('No network connections');
}

if (Ti.Facebook.loggedIn) {
    talky.service.login();
}
else {
    // Login the user and authorize our app
    Ti.Facebook.authorize();
}
























