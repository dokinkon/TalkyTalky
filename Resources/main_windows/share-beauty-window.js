Ti.include('../talky.js');


Ti.App.addEventListener('spotChanged', function(e){

    Ti.API.info("ShareBeautyWindow receive spotChanged event");
    Talky.spotName = e.spotName;
    Ti.API.info("New SpotName = " + Talky.spotName);
});



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

    //focusCount = focusCount + 1;
    //Ti.API.info('focus' + focusCount);

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

var textArea = Titanium.UI.createTextArea({
	editable: true,
	value:'I am a textarea',
	height:150,
	width:300,
	top:100,
	font:{fontSize:20,fontFamily:'Marker Felt', fontWeight:'bold'},
	color:'#888',
	textAlign:'left',
	appearance:Titanium.UI.KEYBOARD_APPEARANCE_ALERT,	
	keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
	returnKeyType:Titanium.UI.RETURNKEY_EMERGENCY_CALL,
	borderWidth:2,
	borderColor:'#bbb',
	borderRadius:5,
	suppressReturn:false
});

currentWindow.add(textArea);

var submitButton = Ti.UI.createButton({
    title:'Submit',
    top:300,
    width:100,
    left:30
});

currentWindow.add(submitButton);

submitButton.addEventListener('click', function(e){
    Ti.API.info("SubmitButton Pressed");
    Ti.API.info("Talky.spotName = " + Talky.spotName);

    Ti.App.fireEvent('querySpotName', {});


    var value = textArea.value;

    //var client = Ti.Network.HTTP

    var client = Ti.Network.createHTTPClient();

    //var data = {"spotName":Talky.spotName, "content":textArea.value};
    var data = {"spotName":"department-store", "content":textArea.value};
    var body = JSON.stringify(data);

    //var url = 'http://lets-talky-talky.appspot.com/get-room-list';
    //var url = 'http://127.0.0.1:8084/create-post';
    client.open('POST', Talky.createPostURL, true);
    client.setRequestHeader("Content-type", "application/json");
    client.setRequestHeader("Content-length", body.length);

    client.onreadystatechange = function() {
        
        if (client.readyState==4 && client.status == 200)
        {
            Ti.API.info('response = ' + client.responseText);
            var result = JSON.parse(client.responseText);
        }
    };

    client.send(body);

});


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


















