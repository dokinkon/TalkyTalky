(function(){

    talky.ui.createLocationWindow = function() {

        var createTableViewRowWithSpot = function(spot) {
            var tvRow = Ti.UI.createTableViewRow({
                spotId:spot.id,
                name:spot.name,
                hasChild:false,
                backgroundColor:'#DDD',
            });

            var starImageView = Ti.UI.createImageView({
                spotId:spot.id,
                left:'15dp',
                width:'30dp',
                height:'30dp',
                image:'images/unstarred.png',
            });

            starImageView.addEventListener('click', function(e){

                var currentSpot = talky.data.loadSpot(e.source.spotId);
                if (currentSpot.starred) {
                    starImageView.image = 'images/unstarred.png';
                    currentSpot.starred = false;
                    talky.data.saveSpot(e.source.spotId, currentSpot);
                } else {
                    starImageView.image = 'images/starred.png';
                    currentSpot.starred = true;
                    talky.data.saveSpot(e.source.spotId, currentSpot);
                } 
            });

            var titleLabel = Ti.UI.createLabel({
                spotId:spot.id,
                left:'60dp',
                width:'auto',
                height:'auto',
                text:spot.name,
                font:{fontSize:20, fontWeight:'bold'},
                color:'#576996',
            });

            titleLabel.addEventListener('click', function(e) {
                // Save current Spot to App.Properties
                Ti.App.Properties.setString('spot_name', e.source.text);
                Ti.App.Properties.setString('spot_id'  , e.source.spotId);

                talky.service.checkin({
                    onsuccess:function() {
                        Ti.API.info('checkin is successful. name:' + e.source.text + " id:" + e.source.spotId);
                        var win = talky.ui.createSpotWindow();
                        win.title = e.source.text;
                        talky.ui.locationTab.open(win, {animated:true});
                    },
                    onerror:function() {
                        // TODO
                    },
                });
            });

            var howManyPeopleLabel = Ti.UI.createLabel({
                font:{fontSize:16, fontWeight:'bold'},
                color:'#576AA6',
                width:'auto',
                height:'auto',
                bottom:'5dp',
                right:'15dp',
                text:'999人',
            });

            tvRow.add(starImageView);
            tvRow.add(titleLabel);
            tvRow.add(howManyPeopleLabel);
            
            return tvRow;
        };


        var win = Ti.UI.createWindow({
            title:'定位',
            backgroundColor:'#000',
            layout:'vertical',
        });

        var refreshButton = Ti.UI.createButton({
            systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
        });

        win.leftNavButton = refreshButton;

        var searchBar = Ti.UI.createSearchBar({
            barColor:'#000',
            showCancel:true,
            top:0,
            height:40,
        });
        win.add(searchBar);

        var spotTableView = Ti.UI.createTableView({
            allowsselection:false,
            top:0,
            bottom:0,
            height:480,
            width:'100%',
            backgroundColor:'#EEE',
        });
        win.add(spotTableView);

        var onSpotListAvailable = function(spots) {

            //Ti.API.info("LocationWindow::onSpotListAvailable");
            for (var i=0;i<spots.length;i++) {
                var tvRow = createTableViewRowWithSpot(spots[i]);
                spotTableView.appendRow(tvRow, {animated:true});
            }
        };

        var onSpotListUnavailable = function(error) {
            alert(error);
        };

        var onLocationAvailable = function(e) {

            if (!e.success || e.error)
            {
                alert('error:' + e.error.message + '. ' + translateErrorCode(e.error.code));
                return;
            }

            //Ti.API.info("location available:" + e.coords.latitude + ", " + e.coords.longitude);
            talky.service.requestSpotList({latitude:e.coords.latitude, longitude:e.coords.longitude}, 
                    {onSpotListAvailable:onSpotListAvailable,onSpotListUnavailable:onSpotListUnavailable});
        };

        refreshButton.addEventListener('click', function(){
            talky.service.requestGeolocation(onLocationAvailable);
        });


        /*
        spotTableView.addEventListener('click', function(e) {

            // Save current Spot to App.Properties
            Ti.App.Properties.setString('spot_name', e.rowData.name);
            Ti.App.Properties.setString('spot_id'  , e.rowData.spotId);

            talky.service.checkin({
                onsuccess:function() {
                    var msg = 'checkin is successful. name:' + e.rowData.name + " id:" + e.rowData.spotId;
                    Ti.API.info(msg);
                    var win = talky.ui.createSpotWindow();
                    win.title = e.rowData.title;
                    talky.ui.locationTab.open(win, {animated:true});
                },
                onerror:function() {
                    // TODO
                },
            });
        });
        */

        win.addEventListener('open', function(){
            Ti.API.info('location-window:opened');
            talky.service.requestGeolocation(onLocationAvailable);
        });

        return win;
    };
})()













