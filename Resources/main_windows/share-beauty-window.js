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


var postContent = function(photo, content) {

    var client = Ti.Network.createHTTPClient();

    var uid = Ti.Facebook.uid;
    var spotName = Ti.App.Properties.getString('current-spot');

    //var data = {"userId":Ti.Facebook.uid,"spotName":currentWindow.title, "content":textArea.value};
    //var body = JSON.stringify(data);

    var data = 
    {
        "picture":photo,
        "name":"photo-name"
    };


    client.setRequestHeader("enctype", "multipart/form-data");
    client.setRequestHeader("Content-type", "image/png");
    client.open('POST', Talky.sendImageURL, true);

    client.onload = function() {
        Ti.API.info('response = ' + client.responseText);

        var imageView = Ti.UI.createImageView({
            top:256,
            left:20,
            width:128,
            height:128,
            image:client.responseData
        });

        currentWindow.add(imageView);


        //var result = JSON.parse(client.responseText);
        // TODO: parse result from GAE server
        //requestPosts();
    };


    client.onerror = function(e) {
        alert(e.error);
    };

    client.send(data);
    Ti.API.info('sending image...');
}



// Open Media Gallery..., Since my IPod doesn't have camera, use image from gallery.

var pickPhotoFromGallery = function() {

    Titanium.Media.openPhotoGallery({
    //Ti.Media.openPhotoGallery({
        success:function(e)
        {
            var image = e.media;
            if (e.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
            {
                postContent(image, 'test');
            }
            else
            {
                alert('MediaType is not a PHOTO!');
            }
        },
        cancel:function(e)
        {
        
        },
        error:function(e)
        {

        },
        allowEditing:true,
        mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO],
    });
}



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
            pickPhotoFromGallery();
        }
        else if (e.index === 1) {
            Ti.API.info('Disable sharing with photo');
            Talky.sharingWithPhoto = false;
        }
    });
    dialog.show();

});


















