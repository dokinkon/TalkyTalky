Ti.include('../talky.js')



Ti.Facebook.appid = "280459581967624";
Ti.Facebook.permissions = ['publish_stream', 'read_stream'];


var currentWindow = Ti.UI.currentWindow;

var fbButton = Ti.Facebook.createLoginButton({
	'style':'wide',
	bottom:10
});

currentWindow.add(fbButton);

var tableViewData = 
[
    {title:'熱門看板', hasChild:true},
    {title:'我的最愛', hasChild:true},
    {title:'設定'    , hasChild:true},
    {title:'關於'    , hasChild:true},
];

var tableView = Ti.UI.createTableView({
    data:tableViewData,
    bottom:60,
});

currentWindow.add(tableView);





var versionLabel = Ti.UI.createLabel({
    top:10,
    left:10,
    text:'version: ' + Talky.version,
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




























