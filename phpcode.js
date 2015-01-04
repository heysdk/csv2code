/**
 * Created by zhs007 on 2014/12/3.
 */

// csvhead is [{...}]
function isSingleOutput(csvhead) {
    var singlenums = 0;
    for (var key in csvhead[0]) {
        if (csvhead[0][key] == 'single') {
            ++singlenums;
        }
    }

    return singlenums == 1;
}

function getSingleKey(csvhead) {
    for (var key in csvhead[0]) {
        if (csvhead[0][key] == 'single') {
            return key;
        }
    }

    return '';
}

// csvhead is [{...}]
function getPrimaryField(csvhead) {
    for (var key in csvhead[0]) {
        if (csvhead[0][key] == 'primary') {
            return key;
        }
    }

    return '';
}

// csvhead is [{...}]
function getPrimaryFieldWithPrimaryIndex(primaryindex, csvhead) {
    var cp = 'primary' + primaryindex;
    for (var key in csvhead[0]) {
        if (csvhead[0][key] == cp) {
            return key;
        }
    }

    return '';
}

// csvhead is [{...}]
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

function makeTabLine(tabnums) {
    var str = '';
    for(var i = 0; i < tabnums; ++i) {
        str += '    ';
    }

    return str;
}

function isIn(lst, val) {
    var max = lst.length;
    for (var i = 0; i < max; ++i) {
        if (lst[i] == val) {
            return true;
        }
    }

    lst[max] = val;

    return false;
}

function isOutput(field) {
    if (field == 'none') {
        return false;
    }

    return true;
}

function makeValArray(valarr, val) {
    var arr = [];
    var max = valarr.length;
    for (var i = 0; i < max; ++i) {
        arr[i] = valarr[i];
    }
    arr[max] = val;
    return arr;
}

function outputFinalVal(singlekey, csvhead, csvinfo, index) {
    if (singlekey.length > 0) {
        return 'return ' + csvinfo[index][singlekey] + ';\r\n';
    }

    var str = 'return array(';

    var isfirst = true;
    for (var key in csvhead[0]) {
        if (isOutput(csvhead[0][key])) {
            if (!isfirst) {
                str += ', ';
            }

            var val = csvinfo[index][key];
            var isnum = isNum(val);
            if (isnum) {
                str += "'" + key + "' => " + val;
            }
            else {
                str += "'" + key + "' => '" + val + "'";
            }

            isfirst = false;
        }
    }

    str += ');\r\n'

    return str;
}

function makePHPCodeWithPrimary(primaryindex, primaryarr, valarr, csvinfo, csvhead) {
    //console.info("makePHPCodeWithPrimary ");

    var singlekey = '';
    if (isSingleOutput(csvhead)) {
        singlekey = getSingleKey(csvhead);
    }
    var str = '';
    var maxprimary = primaryarr.length;
    if (maxprimary == primaryindex + 1) {
        var curval = [];

        var primary = primaryarr[primaryindex];
        str += makeTabLine(primaryindex + 1) + 'switch($' + primary + ')\r\n';
        str += makeTabLine(primaryindex + 1) + '{\r\n';

        var max = csvinfo.length;
        for (var i = 0; i < max; ++i) {
            var iscontinue = false;
            for (var j = 0; j < primaryindex; ++j) {
                if (csvinfo[i][primaryarr[j]] != valarr[j]) {
                    iscontinue = true;
                    break;
                }
            }

            if (iscontinue) {
                continue ;
            }

            if (isIn(curval, csvinfo[i][primary])) {
                continue ;
            }

            if (isNum(csvinfo[i][primary])) {
                str += makeTabLine(primaryindex + 1) + 'case ' + csvinfo[i][primary] + ':\r\n';
            }
            else {
                str += makeTabLine(primaryindex + 1) + "case '" + csvinfo[i][primary] + "':\r\n";
            }

            str += makeTabLine(primaryindex + 2) + outputFinalVal(singlekey, csvhead, csvinfo, i);//'return array(';

            //var isfirst = true;
            //for (var key in csvhead[0]) {
            //    if (isOutput(csvhead[0][key])) {
            //        if (!isfirst) {
            //            str += ', ';
            //        }
            //
            //        var val = csvinfo[i][key];
            //        var isnum = isNum(val);
            //        if (isnum) {
            //            str += "'" + key + "' => " + val;
            //        }
            //        else {
            //            str += "'" + key + "' => '" + val + "'";
            //        }
            //
            //        isfirst = false;
            //    }
            //}
            //
            //str += ');\r\n'
        }

        str += makeTabLine(primaryindex + 1) + '}\r\n';
    }
    else {
        var curval = [];

        var primary = primaryarr[primaryindex];
        str += makeTabLine(primaryindex + 1) + 'switch($' + primary + ')\r\n';
        str += makeTabLine(primaryindex + 1) + '{\r\n';

        var max = csvinfo.length;
        for (var i = 0; i < max; ++i) {
            var iscontinue = false;
            for (var j = 0; j < primaryindex; ++j) {
                if (csvinfo[i][primaryarr[j]] != valarr[j]) {
                    iscontinue = true;
                    break;
                }
            }

            if (iscontinue) {
                continue ;
            }

            if (isIn(curval, csvinfo[i][primary])) {
                continue ;
            }

            if (isNum(csvinfo[i][primary])) {
                str += makeTabLine(primaryindex + 1) + 'case ' + csvinfo[i][primary] + ':\r\n';
            }
            else {
                str += makeTabLine(primaryindex + 1) + "case '" + csvinfo[i][primary] + "':\r\n";
            }

            //console.log("for " + csvinfo[i][primary]);
            var curarrval = makeValArray(valarr, csvinfo[i][primary]);
            str += makePHPCodeWithPrimary(primaryindex + 1, primaryarr, curarrval, csvinfo, csvhead);
        }

        str += makeTabLine(primaryindex + 1) + '}\r\n';
    }

    return str;
}

function makePHPCode_MulPrimary(funcname, csvinfo, csvhead) {
    var str = '';
    var parr = getPrimaryArray(csvhead);
    var pmax = parr.length;
    if (pmax <= 0) {
        return str;
    }

    str = 'function ' + funcname + '(';
    for (var i = 0; i < pmax; ++i) {
        str += '$' + parr[i];

        if (i < pmax - 1) {
            str += ', ';
        }
    }
    str += ')\r\n';

    str += '{\r\n';

    str += makePHPCodeWithPrimary(0, parr, [], csvinfo, csvhead);
    str += makeTabLine(1) + 'return false;\r\n';
    str += '}';

    return str;
}

function makePHPCode_SimplePrimary(funcname, csvinfo, csvhead) {
    var singlekey = '';
    if (isSingleOutput(csvhead)) {
        singlekey = getSingleKey(csvhead);
    }

    var primary = getPrimaryField(csvhead);
    var str = "";

    str = 'function ' + funcname + '($' + primary + ')\r\n';
    str += '{\r\n';
    str += makeTabLine(1) + 'switch($' + primary + ')\r\n';
    str += makeTabLine(1) + '{\r\n';

    var max = csvinfo.length;
    for (var i = 0; i < max; ++i) {
        if (isNum(csvinfo[i][primary])) {
            str += makeTabLine(1) + 'case ' + csvinfo[i][primary] + ':\r\n';
        }
        else {
            str += makeTabLine(1) + "case '" + csvinfo[i][primary] + "':\r\n";
        }

        str += makeTabLine(2) + outputFinalVal(singlekey, csvhead, csvinfo, i);//'return array(';

        //var isfirst = true;
        //for (var key in csvhead[0]) {
        //    if (isOutput(csvhead[0][key])) {
        //        if (!isfirst) {
        //            str += ', ';
        //        }
        //
        //        var val = csvinfo[i][key];
        //        var isnum = isNum(val);
        //        if (isnum) {
        //            str += "'" + key + "' => " + val;
        //        }
        //        else {
        //            str += "'" + key + "' => '" + val + "'";
        //        }
        //
        //        isfirst = false;
        //    }
        //}
        //
        //str += ');\r\n'
    }

    str += makeTabLine(1) + '}\r\n';
    str += makeTabLine(1) + 'return false;\r\n';
    str += '}';

    return str;
}

function makePHPCode(funcname, csvinfo, csvhead) {

    var primary = getPrimaryField(csvhead);
    if (primary.length == 0) {
        return makePHPCode_MulPrimary(funcname, csvinfo, csvhead);
    }
    else {
        return makePHPCode_SimplePrimary(funcname, csvinfo, csvhead);
    }
}

exports.makePHPCode = makePHPCode;