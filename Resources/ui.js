(function(){
    
    talky.ui = {}


    talky.ui.createMainWindow = function() {
        var win = Ti.UI.createWindow({
            title:'首頁',
            backgroundColor:'#fff'
        });

        var fbButton = Ti.Facebook.createLoginButton({
            'style':'wide',
            bottom:10
        });

        win.add(fbButton);

        var hereButton = Ti.UI.createButton({
            top:'10%',
            width:60,
            height:60,
            backgroundImage:'images/here.png',
            backgroundSelectedImage:'images/here-pressed.png',
        });
        win.add(hereButton);

        var optionButton = Ti.UI.createButton({
            top:'30%',
            right:'10%',
            width:60,
            height:60,
            backgroundImage:'images/option.png',
            backgroundSelectedImage:'images/option-pressed.png',

        });
        win.add(optionButton);

        var aboutMeButton = Ti.UI.createButton({
            top:'50%',
            right:'10%',
            width:60,
            height:60,
            backgroundImage:'images/about-me.png',
            backgroundSelectedImage:'images/about-me-pressed.png',
        });
        win.add(aboutMeButton);

        var beautyMapButton = Ti.UI.createButton({
            top:'30%',
            left:'10%',
            width:60,
            height:60,
            backgroundImage:'images/beauty-map.png',
            backgroundSelectedImage:'images/beauty-map-pressed.png',
        });
        win.add(beautyMapButton);

        var favoriteButton = Ti.UI.createButton({
            top:'50%',
            left:'10%',
            width:60,
            height:60,
            backgroundImage:'images/favorite.png',
            backgroundSelectedImage:'images/favorite-pressed.png',
        });
        win.add(favoriteButton);

        var mailBoxButton = Ti.UI.createButton({
            top:'70%',
            left:'25%',
            width:60,
            height:60,
            backgroundImage:'images/mail-box.png',
            backgroundSelectedImage:'images/mail-box-pressed.png',
        });
        win.add(mailBoxButton);

        var responseButton = Ti.UI.createButton({
            top:'70%',
            right:'25%',
            width:60,
            height:60,
            backgroundImage:'images/response.png',
            backgroundSelectedImage:'images/response-pressed.png',
        });
        win.add(responseButton);

        var versionLabel = Ti.UI.createLabel({
            bottom:'2%',
            right:'2%',
            height:20,
            width:64,
            backgroundColor:'#FFF',
            text:talky.version,
        });
        win.add(versionLabel);

        return win
    };

    talky.ui.createMainWindowTab = function() {
        /*
        var win = Ti.UI.createWindow({
            url:'main_windows/main-window.js',
            title:'Main',
            backgroundColor:'#fff'
        });
        */
        var win = talky.ui.createMainWindow();

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











