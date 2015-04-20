/**
 * Created by zhs007 on 2015/1/4.
 */

// is csvhead has only one 'single'
function isSingleOutput(csvhead) {
    var singlenums = 0;
    for (var key in csvhead[0]) {
        if (csvhead[0][key] == 'single') {
            ++singlenums;
        }
    }

    return singlenums == 1;
}

// find 'single' key in csvhead
function getSingleKey(csvhead) {
    for (var key in csvhead[0]) {
        if (csvhead[0][key] == 'single') {
            return key;
        }
    }

    return '';
}

// find 'primary' key in csvhead
function getPrimaryField(csvhead) {
    for (var key in csvhead[0]) {
        if (csvhead[0][key] == 'primary') {
            return key;
        }
    }

    return '';
}

// find 'primary?' key in csvhead
function getPrimaryFieldWithPrimaryIndex(primaryindex, csvhead) {
    var cp = 'primary' + primaryindex;
    for (var key in csvhead[0]) {
        if (csvhead[0][key] == cp) {
            return key;
        }
    }

    return '';
}

// find all 'primary' key in csvhead
function getPrimaryArray(csvhead) {
    var arr = [];
    var pi = 0;
    while (true) {
        var key = getPrimaryFieldWithPrimaryIndex(pi, csvhead);
        if (key.length == 0) {
            return arr;
        }

        arr[pi] = key;
        pi = pi + 1;
    }

    return arr;
}

// is num string
function isNum(str) {
    var max = str.length;
    if (max >= 10) {
        return false;
    }

    for (var i = 0; i < max; ++i) {
        if (!((str[i] >= '0' && str[i] <= '9') || str[i] == '.')) {
            return false;
        }
    }

    return true;
}

// is last primary key
function isLastPrimaryIndex(primaryindex, csvhead) {
    var next = primaryindex + 1;
    var primaryname = 'primary' + next;

    for (var key in csvhead[0]) {
        if (csvhead[0][key] == primaryname) {
            return false;
        }
    }

    return true;
}

// make tabs
function makeTabLine(tabnums) {
    var str = '';
    for(var i = 0; i < tabnums; ++i) {
        str += '    ';
    }

    return str;
}

function isInList(lst, val) {
    var max = lst.length;
    for (var i = 0; i < max; ++i) {
        if (lst[i] == val) {
            return true;
        }
    }

    lst[max] = val;

    return false;
}

// this field is can output
function isOutputField(field) {
    if (field == 'none') {
        return false;
    }

    return true;
}

exports.isSingleOutput = isSingleOutput;
exports.getSingleKey = getSingleKey;
exports.getPrimaryField = getPrimaryField;
exports.getPrimaryFieldWithPrimaryIndex = getPrimaryFieldWithPrimaryIndex;
exports.getPrimaryArray = getPrimaryArray;
exports.isNum = isNum;
exports.isLastPrimaryIndex = isLastPrimaryIndex;
exports.makeTabLine = makeTabLine;
exports.isInList = isInList;
exports.isOutputField = isOutputField;