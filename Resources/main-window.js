(function(){

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

        var welcomeLabel = Ti.UI.createLabel({
            top:5,
            left:5,
            height:'auto',
            width:'auto',
            backgroundColor:'#DDF',
            font:{fontSize:48, fontWeight:'bold'},
            color:'#576996',
            text:'歡迎',
        });
        win.add(welcomeLabel);

        var hereButton = Ti.UI.createButton({
            top:'20%',
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

        win.addEventListener('close', function(){
            Ti.API.info('mainWindow:closed');
        });

        return win
    };
})()
