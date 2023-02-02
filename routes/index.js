
'use strict';

const router = require('express').Router();
const Flit = require('../models/Flit');
/* GET home page. */
router.get('/', function (req, res, next) {
  Flit.find({}, function (err, flits) {
      if (err) {
          console.log(err);
      } else {
          res.render('index', {flits });
      }
  })


});

module.exports = router;