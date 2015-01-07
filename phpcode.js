/**
 * Created by zhs007 on 2014/12/3.
 */

var codeutils = require('./codeutils');

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
        if (codeutils.isOutputField(csvhead[0][key])) {
            if (!isfirst) {
                str += ', ';
            }

            var val = csvinfo[index][key];
            var isnum = codeutils.isNum(val);
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
    if (codeutils.isSingleOutput(csvhead)) {
        singlekey = codeutils.getSingleKey(csvhead);
    }
    var str = '';
    var maxprimary = primaryarr.length;
    if (maxprimary == primaryindex + 1) {
        var curval = [];

        var primary = primaryarr[primaryindex];
        str += codeutils.makeTabLine(primaryindex + 1) + 'switch($' + primary + ')\r\n';
        str += codeutils.makeTabLine(primaryindex + 1) + '{\r\n';

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

            if (codeutils.isInList(curval, csvinfo[i][primary])) {
                continue ;
            }

            if (codeutils.isNum(csvinfo[i][primary])) {
                str += codeutils.makeTabLine(primaryindex + 1) + 'case ' + csvinfo[i][primary] + ':\r\n';
            }
            else {
                str += codeutils.makeTabLine(primaryindex + 1) + "case '" + csvinfo[i][primary] + "':\r\n";
            }

            str += codeutils.makeTabLine(primaryindex + 2) + outputFinalVal(singlekey, csvhead, csvinfo, i);
        }

        str += codeutils.makeTabLine(primaryindex + 1) + '}\r\n';
    }
    else {
        var curval = [];

        var primary = primaryarr[primaryindex];
        str += codeutils.makeTabLine(primaryindex + 1) + 'switch($' + primary + ')\r\n';
        str += codeutils.makeTabLine(primaryindex + 1) + '{\r\n';

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

            if (codeutils.isInList(curval, csvinfo[i][primary])) {
                continue ;
            }

            if (codeutils.isNum(csvinfo[i][primary])) {
                str += codeutils.makeTabLine(primaryindex + 1) + 'case ' + csvinfo[i][primary] + ':\r\n';
            }
            else {
                str += codeutils.makeTabLine(primaryindex + 1) + "case '" + csvinfo[i][primary] + "':\r\n";
            }

            //console.log("for " + csvinfo[i][primary]);
            var curarrval = makeValArray(valarr, csvinfo[i][primary]);
            str += makePHPCodeWithPrimary(primaryindex + 1, primaryarr, curarrval, csvinfo, csvhead);
        }

        str += codeutils.makeTabLine(primaryindex + 1) + '}\r\n';
    }

    return str;
}

function makePHPCode_MulPrimary(funcname, csvinfo, csvhead) {
    var str = '';
    var parr = codeutils.getPrimaryArray(csvhead);
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
    str += codeutils.makeTabLine(1) + 'return false;\r\n';
    str += '}';

    return str;
}

function makePHPCode_SimplePrimary(funcname, csvinfo, csvhead) {
    var singlekey = '';
    if (codeutils.isSingleOutput(csvhead)) {
        singlekey = codeutils.getSingleKey(csvhead);
    }

    var primary = codeutils.getPrimaryField(csvhead);
    var str = "";

    str = 'function ' + funcname + '($' + primary + ')\r\n';
    str += '{\r\n';
    str += codeutils.makeTabLine(1) + 'switch($' + primary + ')\r\n';
    str += codeutils.makeTabLine(1) + '{\r\n';

    var max = csvinfo.length;
    for (var i = 0; i < max; ++i) {
        if (codeutils.isNum(csvinfo[i][primary])) {
            str += codeutils.makeTabLine(1) + 'case ' + csvinfo[i][primary] + ':\r\n';
        }
        else {
            str += codeutils.makeTabLine(1) + "case '" + csvinfo[i][primary] + "':\r\n";
        }

        str += codeutils.makeTabLine(2) + outputFinalVal(singlekey, csvhead, csvinfo, i);
    }

    str += codeutils.makeTabLine(1) + '}\r\n';
    str += codeutils.makeTabLine(1) + 'return false;\r\n';
    str += '}';

    return str;
}

function makePHPCode(funcname, csvinfo, csvhead) {

    var primary = codeutils.getPrimaryField(csvhead);
    if (primary.length == 0) {
        return makePHPCode_MulPrimary(funcname, csvinfo, csvhead);
    }
    else {
        return makePHPCode_SimplePrimary(funcname, csvinfo, csvhead);
    }
}

exports.makePHPCode = makePHPCode;