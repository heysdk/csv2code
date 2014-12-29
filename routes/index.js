var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var session = req.session;

  session.updfile_type = '';

  res.redirect('csv2phpfile');
  //res.render('mainphpfile', { title: 'csv2code', csvfile: 'scvfile.csv' });
});

module.exports = router;
