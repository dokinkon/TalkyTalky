





var Talky = {
    version:"v0.0.1",
    author:["chao-chih.lin", "wei-cheng.liu"],
    copyright:"",
    sharingWithPhoto:true,
    spotName:"unknown",
    appURLForAndroidEmu:'http://10.0.2.2:8084',
    appURLForAppleEmu:'http://127.0.0.1:8084',
    appURL:function() {
        //return 'http://lets-talky-talky.appspot.com';
        //return Talky.appURLForAndroidEmu
        return Talky.appURLForAppleEmu;
    },
    loginURL:function() {
        return Talky.appURL()+'/login';
    },
    getSpotURL:'http://10.0.2.2:8084/get-spot-list',
    createPostURL:'http://10.0.2.2:8084/create-post',
    getPostsURL:'http://10.0.2.2:8084/get-post-list',
    sendImageURL:'http://10.0.2.2:8084/send-image',
    locationTabIndex:0,
};

// Query Screen Size
var width  = Ti.Platform.displayCaps.platformWidth;
var height = Ti.Platform.displayCaps.platformHeight;
Ti.App.SCREEN_WIDTH  = (width > height) ? height : width;
Ti.App.SCREEN_HEIGHT = (width > height) ? width : height;


Talky.login = function(callback) {

    var xhr = Ti.Network.createHTTPClient();

    var data = 
    {
        fb_uid:Ti.Facebook.uid
    };

    Ti.API.info('loginURL = ' + Talky.loginURL());

    xhr.open('POST', Talky.loginURL(), true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setTimeout(1000);

    xhr.onload = function() {

        //Ti.API.info('response = ' + xhr.responseText);
        var response = JSON.parse(xhr.responseText);

        if (!response.success) {
            alert(response.error);
            return;
        } else {

            Ti.API.info('login Talky successful. Talky-id is ' + response.talky_uid);
            Ti.App.Properties.setString('talky_uid', response.talky_uid);
        }
    };

    xhr.onerror = function(e){
        alert(e.error);
    };

    //Ti.API.info(JSON.stringify(data));
    xhr.send(JSON.stringify(data));
}





















