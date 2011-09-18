
var currentWindow = Ti.UI.currentWindow;

currentWindow.addEventListener('open', function(){

    var dialog = Ti.UI.createOptionDialog({
        title:'是否拍照分享',
        options:['確定', '取消'],
        cancel:-1
    });


    dialog.show();

});
