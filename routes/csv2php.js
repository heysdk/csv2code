/**
 * Created by zhs007 on 2014/12/3.
 */
var express = require('express');
var router = express.Router();
var logger = require('../logger');
var csv2obj = require('../csv2obj');
var phpcode = require('../phpcode');

/* GET users listing. */
router.all('/', function(req, res) {

    if (req.method == 'POST') {
        var body = req.body;

        var funcname = body.funcname;
        var csvinfo = csv2obj.csv2obj(body.csvinfo);
        var csvhead = csv2obj.csv2obj(body.csvhead);

        var code = phpcode.makePHPCode(funcname, csvinfo, csvhead);

        res.render('csv2php', { phpcode: code });

        return ;
    }

    res.send('');
});

module.exports = router;
