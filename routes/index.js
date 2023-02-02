
'use strict';

const router = require('express').Router();
const Flip = require('../models/Flip');
/* GET home page. */
router.get('/', function (req, res, next) {
  Flip.find({}, function (err, flips) {
      if (err) {
          console.log(err);
      } else {
          res.render('index', {flips });
      }
  })


});

module.exports = router;