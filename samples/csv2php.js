/**
 * Created by zhs007 on 2014/12/29.
 */
var csv2obj = require('../csv2obj.js');
var phpcode = require('../phpcode.js');
var fs = require('fs');

var argv = process.argv.splice(2);

if (argv.length != 4) {
    console.log('please input node csv2php.js src.csv src_head.csv dest.php destfunc');
}
else {
    var csvfile = argv[0];
    var csvheadfile = argv[1];
    var destfile = argv[2];
    var funcname = argv[3];

    fs.readFile(csvfile, function(err, data) {
        if (err) {
            console.log('read ' + csvfile + ' fail!');

            return ;
        }

        var csvinfo = csv2obj.csv2obj(data.toString());

        fs.readFile(csvheadfile, function(err, data) {
            if (err) {
                console.log('read ' + csvheadfile + ' fail!');

                return ;
            }

            var csvhead = csv2obj.csv2obj(data.toString());

            var code = phpcode.makePHPCode(funcname, csvinfo, csvhead);

            var phpfileinfo = '<?php\r\n' + code + '\r\n?>';

            fs.writeFile(destfile, phpfileinfo, function(err) {
                if (err) {
                    console.log('write ' + destfile + ' fail!');

                    return ;
                }

                console.log('csv2php ' + destfile + ' OK!');
            });
        });
    });
}