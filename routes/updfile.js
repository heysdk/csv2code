/**
 * Created by zhs007 on 2014/12/3.
 */
var express = require('express');
var router = express.Router();
var logger = require('../logger');
var csv2obj = require('../csv2obj');
var phpcode = require('../phpcode');
var fs = require('fs');

/* GET users listing. */
router.all('/', function(req, res) {
    var session = req.session;

    if (req.method == 'POST') {
        if (session.updfile_type == 'csvfile' || session.updfile_type == 'csvheadfile') {
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                logger.normal.log('info', 'uploading ' + fieldname, filename);
                //console.log("Uploading: " + filename);
                var fstream = fs.createWriteStream(__dirname + '/../uploads/' + filename);
                file.pipe(fstream);
                fstream.on('close', function () {
                    logger.normal.log('info', 'uploading ok!', filename);
                    //console.log("Uploading: " + filename + " ok");
                    //res.send(filename + 'ok');

                    session[session.updfile_type] = filename;
                    res.redirect('csv2phpfile');
                });
            });
        }
        else {
            res.redirect('back');
        }

        return ;
    }
    else if (req.method == 'GET') {
        var query = req.query;

        if (query.hasOwnProperty('type')) {
            session.updfile_type = query.type;

            res.render('updfile', { title: 'csv2code', csvfile: 'scvfile.csv' });
        }
        else {
            res.redirect('back');
        }
    }
});

module.exports = router;
