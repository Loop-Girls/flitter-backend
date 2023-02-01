
'use strict';

const router = require('express').Router();
const fsPromises = require('fs').promises;
const path = require('path');
const asyncHandler = require('express-async-handler');

/* GET home page. */
router.get('/', asyncHandler(async function (req, res) {
  const filename = path.join(__dirname, '../README.md');
  const readme = await fsPromises.readFile(filename, 'utf8');
  res.render('index', { readme });
}));

module.exports = router;