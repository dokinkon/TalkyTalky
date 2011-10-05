
Ti.include('talky.js');


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');


// create tab group
var tabGroup = Titanium.UI.createTabGroup();



// create main window
var mainWindow = Ti.UI.createWindow({
    url:'main_windows/main_window.js',
    title:'Main',
    backgroundColor:'#fff'
});


var mainTab = Ti.UI.createTab({
    window:mainWindow
});




// create locationWindow

Talky.locationWindow = Titanium.UI.createWindow({  
    url:'main_windows/location_window.js',
    title:'Location',
    backgroundColor:'#fff'
});



var locationTab = Titanium.UI.createTab({  
    icon:'location.png',
    window:Talky.locationWindow
});


locationTab.addEventListener('click', function(e){
    Ti.API.info("LocationTab Pressed");
});





Talky.shareBeautyWindow = Titanium.UI.createWindow({  
    url:'main_windows/share-beauty-window.js',
    title:'分享正妹',
    backgroundColor:'#fff'
});


var tab2 = Titanium.UI.createTab({  
    icon:'sharing-beauty.png',
    window:Talky.shareBeautyWindow
});

Talky.shareHandsomeWindow = Ti.UI.createWindow({
    url:'main_windows/share-handsome-window.js',
    title:'分享帥哥'
});

var shareHandsomeTab = Ti.UI.createTab({
    icon:'icons/sharing-handsome.png',
    window:Talky.shareHandsomeWindow
});

Talky.messageNotificationWindow = Ti.UI.createWindow({
    url:'main_windows/message-notification-window.js',
    title:'訊息'
});

var messageNotificationTab = Ti.UI.createTab({
    icon:'icons/message-notification.png',
    window:Talky.messageNotificationWindow
});

//
//  add tabs
//
tabGroup.addTab(mainTab);
tabGroup.addTab(locationTab);  
tabGroup.addTab(tab2);  
tabGroup.addTab(shareHandsomeTab);  
tabGroup.addTab(messageNotificationTab);  

tabGroup.addEventListener('focus', function(e){
    //Ti.API.info('tabIndex = ' + e.index);
    //if (e.index===Talky.locationTabIndex)
});


// open tab group
tabGroup.open();





















