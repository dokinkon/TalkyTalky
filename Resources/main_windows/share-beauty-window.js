Ti.include('../talky.js');


Ti.App.addEventListener('spotChanged', function(e){

    Ti.API.info("ShareBeautyWindow receive spotChanged event");
    Talky.spotName = e.spotName;
    Ti.API.info("New SpotName = " + Talky.spotName);
});



var currentWindow = Ti.UI.currentWindow;



currentWindow.addEventListener('focus', function(e){

    //focusCount = focusCount + 1;
    //Ti.API.info('focus' + focusCount);

});
//
// 
// Add hairstyle buttons
//



// Scrollable View
var scrollableView = Ti.UI.createScrollableView({
    top:'50%',
    width:'100%',
    bottom:"0",
    height:'50%',
    backgroundColor:'#AAA',
});

currentWindow.add(scrollableView);

var initHairStyleView = function () {

    var hairStyleView = Ti.UI.createView({
        widht:'100%',
        height:'100%',
    });

    var qmoButton = Titanium.UI.createButton({
        backgroundImage: '../images/qmo.png',
        top:0,
        width:75,
        height:60,
        left:'0%',
    });

    hairStyleView.add(qmoButton);

    var shortHairButton = Ti.UI.createButton({
        backgroundImage: '../images/shorthair.png',
        top:0,
        width:75,
        height:60,
        left:'25%',
    });
    hairStyleView.add(shortHairButton);

    var horseTailButton = Ti.UI.createButton({
        backgroundImage:'../images/horsetail.png',
        title:'馬尾',
        width:75,
        height:60,
        top:0,
        left:'50%',
    });
    hairStyleView.add(horseTailButton);

    var longHairButton = Ti.UI.createButton({
        backgroundImage:'../images/longhair.png',
        top:0,
        left:'75%',
        width:75,
        height:60,
    });
    hairStyleView.add(longHairButton);
    longHairButton.addEventListener('click', function(){
        scrollableView.scrollToView(1);

    });

    scrollableView.addView(hairStyleView);
};


var initDescribeDressingView = function() {

    var describeDressingView = Ti.UI.createView({
        width:'100%',
        height:'100%',
    });

    var textArea = Ti.UI.createTextArea({
        left:10,
        height:40,
        width:250,
        backgroundColor:'#FFF',
        value:"請簡單描述穿著與確切位置",
    });
    describeDressingView.add(textArea);

    var button = Ti.UI.createButton({
        title:'確定',
        right:10,
        width:40,
        height:40,
    });
    describeDressingView.add(button);
    button.addEventListener('click', function(){
        scrollableView.scrollToView(2);
    });
    scrollableView.addView(describeDressingView);
};

var initDescribeStyleView = function() {

    var view = Ti.UI.createView({
        width:'100%',
        height:'100%',
    });

    var button1 = Ti.UI.createButton({
        title:'氣質高雅型',
        width:'25%',
        height:'25%',
        center:{x:80, y:60},
    });
    var button2 = Ti.UI.createButton({
        title:'性感豔麗型',
        width:'25%',
        height:'25%',
        center:{x:240, y:60}
    });

    var button3 = Ti.UI.createButton({
        title:'可愛甜美型',
        width:'25%',
        height:'25%',
        center:{x:80, y:120}
    });
    var button4 = Ti.UI.createButton({
        title:'運動健康型',
        width:'25%',
        height:'25%',
        center:{x:240, y:120},
    });

    view.add(button1);
    view.add(button2);
    view.add(button3);
    view.add(button4);

    button1.addEventListener('click', function(){
        scrollableView.scrollToView(3);
    });
    button2.addEventListener('click', function(){
        scrollableView.scrollToView(3);
    });
    
    button3.addEventListener('click', function(){
        scrollableView.scrollToView(3);
    });
    button4.addEventListener('click', function(){
        scrollableView.scrollToView(3);
    });
    scrollableView.addView(view);
};


var initConclusionView = function() {

    var view = Ti.UI.createView({
        width:'100%',
        height:'100%',
    });
    scrollableView.addView(view);

    var textArea = Ti.UI.createTextArea({
        left:10,
        height:40,
        width:250,
        backgroundColor:'#FFF',
        value:"然後你想說什麼?",
    });
    view.add(textArea);

    var button = Ti.UI.createButton({
        title:'分享',
        right:10,
        width:40,
        height:40,
    });
    view.add(button);
};


initHairStyleView();
initDescribeDressingView();
initDescribeStyleView();
initConclusionView();





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

var pickPhotoFromGallery = function(callbacks) {

    Ti.Media.openPhotoGallery({
        success:function(e)
        {
            var image = e.media;
            if (e.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
            {
                Ti.API.info("1");
                if (callbacks.onPickPhotoSuccess && typeof callbacks.onPickPhotoSuccess === 'function')
                {
                    Ti.API.info("2");
                    callbacks.onPickPhotoSuccess(e.media);
                }

                //postContent(image, 'test');
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
            Ti.App.Properties.setBool('share-with-photo', true);
            pickPhotoFromGallery({
                onPickPhotoSuccess:function(photo) {
                    Ti.API.info('w:' + photo.width);
                    Ti.API.info('h:' + photo.height);

                    var imageView = Ti.UI.createImageView({
                        top:0,
                        width:160,
                        height:160,
                        image:photo,
                    });

                    currentWindow.add(imageView);
                },
            });
        }
        else if (e.index === 1) {
            Ti.API.info('Disable sharing with photo');
            Ti.App.Properties.setBool('share-with-photo', false);
        }
    });
    dialog.show();

});


















