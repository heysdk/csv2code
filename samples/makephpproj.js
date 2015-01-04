/**
 * Created by zhs007 on 2014/12/29.
 */
var csv2obj = require('../csv2obj.js');
var phpcode = require('../phpcode.js');
var fs = require('fs');
var path = require('path');
var fileutils = require('../fileutils');

function insdestfile(lst, filename) {
    var max = lst.length;
    for (var i = 0; i < max; ++i) {
        if (filename == lst[i].destname) {
            return ;
        }
    }

    lst[max] = {destname: filename, data: '<?php\r\n'};
}

function writedestfiledata(lst, filename, code) {
    var max = lst.length;
    for (var i = 0; i < max; ++i) {
        if (filename == lst[i].destname) {
            lst[i].data += '\r\n' + code;
        }
    }
}

function procline(lstdestfile, lstproj, i, callback) {
    var max = lstproj.length;
    if (i >= max) {
        callback();

        return ;
    }

    var csvfile = lstproj[i].csvfile;
    var csvhead = lstproj[i].csvhead;
    var destfunc = lstproj[i].destfunc;
    var destfile = lstproj[i].destfile;

    fs.readFile(csvfile, function(err, data) {
        if (err) {
            console.log('read ' + csvfile + ' fail!');

            return ;
        }

        var csvinfo = csv2obj.csv2obj(data.toString());

        fs.readFile(csvhead, function(err, data) {
            if (err) {
                console.log('read ' + csvheadfile + ' fail!');

                return ;
            }

            var csvhead = csv2obj.csv2obj(data.toString());

            var code = phpcode.makePHPCode(destfunc, csvinfo, csvhead);

            writedestfiledata(lstdestfile, destfile, code);

            procline(lstdestfile, lstproj, i + 1, callback);
        });
    });
}

var argv = process.argv.splice(2);

if (argv.length != 1) {
    console.log('please input node makephpproj.js projdef.csv');
}
else {
    var projfile = argv[0];

    fs.readFile(projfile, function(err, data) {
        if (err) {
            console.log('read ' + projfile + ' fail!');

            return ;
        }

        var projinfo = csv2obj.csv2obj(data.toString());

        var lstdestfile = [];
        var max = projinfo.length;
        for (var i = 0; i < max; ++i) {
            insdestfile(lstdestfile, projinfo[i].destfile);
        }

        procline(lstdestfile, projinfo, 0, function () {
            var max = lstdestfile.length;
            for (var i = 0; i < max; ++i) {
                var phpfileinfo = lstdestfile[i].data + '\r\n?>';
                var filename = path.join('output/php', lstdestfile[i].destname);

                fileutils.writeFile(filename, phpfileinfo, function(err) {
                    if (err) {
                        console.log('write ' + lstdestfile[i].destname + ' fail!');

                        return ;
                    }

                    if (i == max - 1) {
                        console.log('makephpproj ' + projfile + ' OK!');
                    }
                });
            }
        });
    });
}