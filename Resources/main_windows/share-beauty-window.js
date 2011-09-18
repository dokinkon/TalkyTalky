Ti.include('../talky.js')

var currentWindow = Ti.UI.currentWindow;

var qmoButton = Titanium.UI.createButton({
	title : 'V-Bottom',
    backgroundImage: '../icons/qmo.png',
	width : 50,
	height: 40,
	top : 50,
	left : 10
});

currentWindow.add(qmoButton);

var shortHairButton = Ti.UI.createButton({
    backgroundImage: '../icons/shorthair.png',
    width:74,
    height:60,
    top:50,
    left:70
});

currentWindow.add(shortHairButton);

var longHairButton = Ti.UI.createButton({
    backgroundImage:'../icons/longhair.png',
    width:74,
    height:60,
    top:50,
    left:144,
});

currentWindow.add(longHairButton);

var horseTailButton = Ti.UI.createButton({
    backgroundImage:'../icons/horsetail.png',
    width:74,
    height:60,
    top:50,
    left:218
});

currentWindow.add(horseTailButton);



currentWindow.addEventListener('focus', function(e){

    focusCount = focusCount + 1;
    Ti.API.info('focus' + focusCount);

});
//
// 
// Add hairstyle buttons
//
var longhairButton = Ti.UI.createButton({
    backgroundImage:'icons/longhair.png',
    top:50,
    left:10
});

currentWindow.add(longhairButton);

currentWindow.addEventListener('open', function(){

    var dialog = Ti.UI.createOptionDialog({
        title:'是否拍照分享',
        options:['確定', '取消'],
        cancel:-1
    });

    dialog.addEventListener('click', function(e){
        if (e.index === 0) {
            Ti.API.info('Enable sharing with photo');
            Talky.sharingWithPhoto = true;
        }
        else if (e.index === 1) {
            Ti.API.info('Disable sharing with photo');
            Talky.sharingWithPhoto = false;
        }
    });
    dialog.show();

});


















