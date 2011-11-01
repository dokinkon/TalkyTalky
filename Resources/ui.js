(function(){
    
    talky.ui = {}

    talky.ui.createMainWindowTab = function() {
        var win = Ti.UI.createWindow({
            url:'main_windows/main-window.js',
            title:'Main',
            backgroundColor:'#fff'
        });

        var tab = Ti.UI.createTab({
            icon:'images/home.png',
            title:'首頁',
            window:win
        });

        return tab;
    };


    talky.ui.createLocationWindowTab = function() {
        var win = Titanium.UI.createWindow({  
            url:'main_windows/location-window.js',
            title:'Location',
            backgroundColor:'#fff'
        });

        var tab = Titanium.UI.createTab({  
            icon:'images/location.png',
            title:'定位',
            window:win
        });

        return tab;
    };


    talky.ui.createShareBeautyWindowTab = function() {
        var win = Titanium.UI.createWindow({  
            url:'main_windows/share-beauty-window.js',
            title:'分享正妹',
            backgroundColor:'#fff'
        });


        var tab = Titanium.UI.createTab({  
            icon:'images/sharing-beauty.png',
            title:'分享正妹',
            window:win
        });

        return tab;
    };


    talky.ui.createShareHandsomeWindowTab = function() {
        var win = Ti.UI.createWindow({
            url:'main_windows/share-handsome-window.js',
            title:'分享帥哥'
        });

        var tab = Ti.UI.createTab({
            icon:'images/sharing-handsome.png',
            title:'分享帥哥',
            window:win
        });

        return tab;
    };

    
    talky.ui.createMessageNotifycationWindowTab = function() {
        var win = Ti.UI.createWindow({
            url:'main_windows/message-notification-window.js',
            title:'訊息'
        });

        var tab = Ti.UI.createTab({
            icon:'images/message-notification.png',
            title:'訊息',
            window:win
        });

        return tab;
    };

    talky.ui.createAppTabGroup = function() {
        var tabGroup = Ti.UI.createTabGroup();
        tabGroup.addTab(talky.ui.createMainWindowTab());
        tabGroup.addTab(talky.ui.createLocationWindowTab());
        tabGroup.addTab(talky.ui.createShareBeautyWindowTab());
        tabGroup.addTab(talky.ui.createShareHandsomeWindowTab());
        tabGroup.addTab(talky.ui.createMessageNotifycationWindowTab());
        return tabGroup;
    };

    talky.ui.appTabGroup = talky.ui.createAppTabGroup();
})()











