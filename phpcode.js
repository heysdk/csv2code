/**
 * Created by zhs007 on 2014/12/3.
 */

// csvhead is [{...}]
function getPrimaryField(csvhead) {
    for (var key in csvhead[0]) {
        if (csvhead[0][key] == 'primary') {
            return key;
        }
    }

    return '';
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

function makePHPCode(funcname, csvinfo, csvhead) {
    var primary = getPrimaryField(csvhead);
    var str = "";

    str = 'function ' + funcname + '($' + primary + ')\r\n';
    str += '{\r\n';
    str += '    switch($' + primary + ')\r\n';
    str += '    {\r\n';

    var max = csvinfo.length;
    for (var i = 0; i < max; ++i) {
        if (isNum(csvinfo[i][primary])) {
            str += '        case ' + csvinfo[i][primary] + ':\r\n';
        }
        else {
            str += "        case '" + csvinfo[i][primary] + "':\r\n";
        }

        str += '            return array(';

        var isfirst = true;
        for (var key in csvhead[0]) {
            if (csvhead[0][key] == 'output' || csvhead[0][key] == 'primary') {
                if (!isfirst) {
                    str += ', ';
                }

                var val = csvinfo[i][key];
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
    }

    str += '    }\r\n';
    str += '    return false;\r\n';
    str += '}';

    return str;
}

exports.makePHPCode = makePHPCode;