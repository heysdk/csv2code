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
        var body = req.body;

        logger.normal.log('info', 'files ', body);

        var csvfile = '';
        var csvheadfile = '';
        var funcname = body.funcname;

        if (session.hasOwnProperty('csvfile')) {
            csvfile = session.csvfile;
        }
        else {
            res.redirect('csv2phpfile');
        }

        if (session.hasOwnProperty('csvheadfile')) {
            csvheadfile = session.csvheadfile;
        }
        else {
            res.redirect('csv2phpfile');
        }

        fs.readFile(__dirname + '/../uploads/' + csvfile, function(err, data) {
            if (err) {
                res.redirect('csv2phpfile');

                return ;
            }

            var csvinfo = csv2obj.csv2obj(data.toString());

            fs.readFile(__dirname + '/../uploads/' + csvheadfile, function(err, data) {
                if (err) {
                    res.redirect('csv2phpfile');

                    return ;
                }

                var csvhead = csv2obj.csv2obj(data.toString());

                var code = phpcode.makePHPCode(funcname, csvinfo, csvhead);

                res.render('csv2php', { phpcode: code });
            });
        });

        return ;
    }

    var csvfile = '';
    var csvheadfile = '';

    if (session.hasOwnProperty('csvfile')) {
        csvfile = session.csvfile;
    }

    if (session.hasOwnProperty('csvheadfile')) {
        csvheadfile = session.csvheadfile;
    }
    res.render('mainphpfile', { title: 'csv2code', csvfile: csvfile, csvheadfile: csvheadfile });
});

module.exports = router;
