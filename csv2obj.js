/**
 * Created by zhs007 on 2014/12/3.
 */

var strutil = require('./stringutils');

function csv2obj(str) {
    var obj = [];
    var head = [];

    if (typeof (str) == 'undefined' || str.length <= 0) {
        return obj;
    }

    //var str = csvinfo.toString();

    var lstLine = strutil.splitEx(str, '\r\n', true);
    var lines = lstLine.length;
    if (lines > 0) {
        var lstHead = strutil.splitEx(lstLine[0], ',');
        var numsHead = lstHead.length;

        for (var i = 1; i < lines; ++i) {
            var val = strutil.splitEx(lstLine[i], ',');
            var nums = val.length;
            if (nums == numsHead) {
                obj[i - 1] = {};
                for(var j = 0; j < numsHead; ++j) {
                    obj[i - 1][lstHead[j]] = val[j];
                }
            }
        }
    }

    return obj;
}

exports.csv2obj = csv2obj;