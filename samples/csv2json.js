/**
 * Created by zhs007 on 2015/1/7.
 */

var csv2obj = require('../csv2obj.js');
var fs = require('fs');

var argv = process.argv.splice(2);

if (argv.length != 2) {
    console.log('please input node csv2json.js src.csv dest.json');
}
else {
    var csvfile = argv[0];
    var destfile = argv[1];

    fs.readFile(csvfile, function(err, data) {
        if (err) {
            console.log('read ' + csvfile + ' fail!');

            return ;
        }

        var csvinfo = csv2obj.csv2obj(data.toString());

        fs.writeFile(destfile, JSON.stringify(csvinfo), function(err) {
            if (err) {
                console.log('write ' + destfile + ' fail!');

                return ;
            }

            console.log('csv2json ' + destfile + ' OK!');
        });
    });
}