(function(){
    talky.utils = {}


    talky.utils.dateFromInterchangeable = function(interchangeable) {
        //Ti.API.info('convertDateFromServer');
        var date = new Date();
        date.setUTCFullYear(interchangeable.year);
        date.setUTCMonth(interchangeable.month - 1);
        date.setUTCDate(interchangeable.date);
        date.setUTCHours(interchangeable.hour);
        date.setUTCMinutes(interchangeable.minute);
        date.setUTCSeconds(interchangeable.second);
        return date;
    };


    talky.utils.dateToInterchangeable = function(date) {
        var interchangeable = {};
        interchangeable.year   = date.getUTCFullYear();
        interchangeable.month  = date.getUTCMonth() + 1;
        interchangeable.date   = date.getUTCDate();
        interchangeable.hour   = date.getUTCHours();
        interchangeable.minute = date.getUTCMinutes();
        interchangeable.second = date.getUTCSeconds();
        return interchangeable;
    };


    talky.utils.sortPostListByDateTime = function(postList) {

        var compare = function(p1, p2) {

            if (p1.date_time > p2.date_time) {
                return -1;
            } else {
                return 1;
            }
        };
        postList.sort(compare);
    };

    talky.utils.getTimeLabelString = function(date) {

        /*
        if (typeof date!='Date') {
            //return "有問題";
            return typeof date;
        }
        */

        var rightNow = new Date();

        //1. compare year
        //var yearDiff = rightNow.getUTCYear() - date.getUTCYear();
        var yearDiff = rightNow.getYear() - date.getYear();
        if (yearDiff > 0) {
            return '' + yearDiff + ' years ago';
        }

        var monthDiff = rightNow.getUTCMonth() - date.getUTCMonth();
        if (monthDiff > 0) {
            return '' + monthDiff + ' months ago';
        }

        var dayDiff = rightNow.getUTCDay() - date.getUTCDay();
        if (dayDiff > 0) {
            //return '' + dayDiff + ' days ago';
            return '' + dayDiff + ' 天前';
        }

        var hourDiff = rightNow.getUTCHours() - date.getUTCHours();
        if (hourDiff > 0) {
            //return '' + hourDiff + ' hours ago';
            return '' + hourDiff + ' 小時前';
        }

        var diff = rightNow.getUTCMinutes() - date.getUTCMinutes();
        if (diff > 0) {
            //return '' + diff + ' minutes ago';
            return '' + diff + ' 分鐘前';
        }

        return '就在剛剛';
    };


})()
