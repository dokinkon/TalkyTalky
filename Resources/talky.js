





var Talky = {
    version:"0.0.1",
    author:["chao-chih.lin", "wei-cheng.liu"],
    copyright:"",
    sharingWithPhoto:true,
    spotName:"unknown",
    getSpotURL:   'http://lets-talky-talky.appspot.com/get-spot-list',
    createPostURL:'http://lets-talky-talky.appspot.com/create-post',
    getPostsURL:  'http://lets-talky-talky.appspot.com/get-post-list',
    //getSpotURL:'http://127.0.0.1:8084/get-spot-list',
    //createPostURL:'http://127.0.0.1:8084/create-post',
    //getPostsURL:'http://127.0.0.1:8084/get-post-list',
    locationTabIndex:0,
};

// Query Screen Size
var width  = Ti.Platform.displayCaps.platformWidth;
var height = Ti.Platform.displayCaps.platformHeight;
Ti.App.SCREEN_WIDTH  = (width > height) ? height : width;
Ti.App.SCREEN_HEIGHT = (width > height) ? width : height;
