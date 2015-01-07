/**
 * Created by zhs007 on 2015/1/4.
 */

var codeutils = require('./codeutils');

function makeJavaCode(mgrname, itemname, csvinfo, csvhead) {
    var str = '';
    var primary = codeutils.getPrimaryField(csvhead);
    var singlekey = '';
    if (codeutils.isSingleOutput(csvhead)) {
        singlekey = codeutils.getSingleKey(csvhead);
    }

    str = 'package com.heysdk.lib;\r\n';
    str += '\r\n';
    str += 'import java.util.Map;\r\n';
    str += '\r\n';
    str += 'public class ' + mgrname + ' extends HeyCSVObject {\r\n';
    str += '\r\n';

    if (singlekey.length > 0) {
        str += codeutils.makeTabLine(1) + 'public class ' + itemname + '{\r\n';

        for (var key in csvhead[0]) {
            if (codeutils.isOutputField(csvhead[0][key])) {
                str += codeutils.makeTabLine(2) + 'public String ' + csvhead[0][key] + ';\r\n';
            }
        }

        str += codeutils.makeTabLine(1) + '}\r\n';
        str += '\r\n';
        str += codeutils.makeTabLine(1) + 'protected Map<String, ' + itemname + '>	mMap;\r\n';
        str += '\r\n';
    }
    else {
        str += codeutils.makeTabLine(1) + 'protected Map<String, String>	mMap;\r\n';
        str += '\r\n';
    }

    str += codeutils.makeTabLine(1) + 'protected class MyLoaderListener implements HeyCSVObject.LoaderListener{\r\n';
    str += codeutils.makeTabLine(2) + 'public void onLoadLineEnd(String[] lstDat) {\r\n';
    if (singlekey.length > 0) {
        str += codeutils.makeTabLine(3) + itemname + ' item = new ' + itemname + '();\r\n';
        str += '\r\n';

        for (var key in csvhead[0]) {
            if (codeutils.isOutputField(csvhead[0][key])) {
                str += codeutils.makeTabLine(3) + 'item.' + csvhead[0][key] + ' = lstDat[0];\r\n';
            }
        }

        str += '\r\n';
        str += codeutils.makeTabLine(3) + 'mMap.put(item.name, item);\r\n';
    }
    else {

    }

    str += codeutils.makeTabLine(2) + '}\r\n';
    str += codeutils.makeTabLine(1) + '}\r\n';
    str += '\r\n';
    str += codeutils.makeTabLine(1) + 'public ' + mgrname + '() {\r\n';
    str += codeutils.makeTabLine(2) + 'mLoader = new MyLoaderListener();\r\n';
    str += codeutils.makeTabLine(1) + '}\r\n';
    str += '\r\n';

    if (singlekey.length > 0) {
        str += codeutils.makeTabLine(1) + 'public ' + itemname + ' get' + itemname + '(String name) {\r\n';
        str += codeutils.makeTabLine(2) + 'return mMap.get(name);\r\n';
        str += codeutils.makeTabLine(1) + '}\r\n';
    }
    else {

    }

    str += '}\r\n';

    return str;
}

exports.makeJavaCode = makeJavaCode;