
Ti.include('talky.js');






// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.UI.setBackgroundColor('#000');


// create tab group
var tabGroup = Ti.UI.createTabGroup();



// create main window
var mainWindow = Ti.UI.createWindow({
    url:'main_windows/main-window.js',
    title:'Main',
    backgroundColor:'#fff'
});


var mainTab = Ti.UI.createTab({
    title:'首頁',
    window:mainWindow
});




// create locationWindow

Talky.locationWindow = Titanium.UI.createWindow({  
    url:'main_windows/location-window.js',
    title:'Location',
    backgroundColor:'#fff'
});



var locationTab = Titanium.UI.createTab({  
    icon:'images/location.png',
    title:'定位',
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
    icon:'images/sharing-beauty.png',
    title:'分享正妹',
    window:Talky.shareBeautyWindow
});

Talky.shareHandsomeWindow = Ti.UI.createWindow({
    url:'main_windows/share-handsome-window.js',
    title:'分享帥哥'
});

var shareHandsomeTab = Ti.UI.createTab({
    icon:'images/sharing-handsome.png',
    title:'分享帥哥',
    window:Talky.shareHandsomeWindow
});

Talky.messageNotificationWindow = Ti.UI.createWindow({
    url:'main_windows/message-notification-window.js',
    title:'訊息'
});

var messageNotificationTab = Ti.UI.createTab({
    icon:'images/message-notification.png',
    title:'訊息',
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





















