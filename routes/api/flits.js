'use strict';

const express = require('express');
const createError = require('http-errors');
const Flit = require('../../models/Flit');
const multer = require('../../config/multer');
const Users = require('../../models/User');
const router = express.Router();
const imageRoute = 'http://localhost:3000/images/flits/';
const authMiddleware = require('../../lib/authMiddleware');


// CRUD

// POST /apiv1/flits(body=adData)
// Create a flit


router.post('/post', multer.single("imagen"), async function (req, res, next) {
  console.log(req.file);
  console.log(req.body);
  if (req.body.message == undefined && req.file == undefined || req.body.message == '' && req.file == undefined) {
    res.status(400).json({ error: "Can't post a flit without any message or picture." });
  } else {
    let image = '';
    if (req.file) {
      image = imageRoute + req.file.filename;
    }

    const flit = new Flit({
      author: req.body.author,
      image: image,
      message: req.body.message,
      date: req.body.date.toString(), //TODO: change type to Date?
    });
    try {
      const savedFlit = await flit.save();
      console.log('Saved ' + savedFlit);
      res.json({ result: savedFlit });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Can't post a flit without any message or picture." });
    }
  }





});

// PUT /apiv1/flits/(id) (body=agenteData)
// Update a flit
router.put('/:id', async (req, res, next) => {
  try {

    const id = req.params.id;
    const adData = req.body;

    const updateFlit = await Flit.findOneAndUpdate({ _id: id }, adData, {
      new: true
    });

    res.json({ result: updateFlit });

  } catch (err) {
    next(err);
  }
});

// GET /apiv1/flits
// Returns list of flits all
router.get('/', async (req, res, next) => {
  try {

    // filters
    const author = req.query.author;
    const exactAuthor = req.query.exactAuthor;
    const image = req.query.image;
    const message = req.query.message;
    const kudos = req.query.kudos;
    const date = req.query.date;
    // pagination /apiv1/flits?skip=1&limit=1
    const skip = req.query.skip;
    const limit = req.query.limit;
    // fields selection
    const fields = req.query.fields; // /apiv1/flits/?fields=name -_id
    // sort
    const sort = req.query.sort; // /apiv1/flits/?sort=date%20name // /apiv1/flits?sort=-date%20name
    const following = req.query.following;
    const filtro = {};
    // if(date){
    //   filtro.date= req.query.exactAuthor;
    // }
    if (exactAuthor) {
      filtro.author = req.query.exactAuthor;

    }
    if (author) {// /apiv1/flits/?author=Karen,Steff
      if (author.includes(',')) {
        console.log('includes ,')
        let authorFilter = [];
        let authors = author.split(',');
        console.log(authors);
        authors.forEach(element => {
          authorFilter.push(
            {
              "author": element
            }
          )
        });
        console.log(authorFilter);
        filtro.author = { '$or': authorFilter }
      } else {// 1 tag query /apiv1/flits/?author=Karen
        filtro.author = { '$in': author };
      }
    }
    if (message) { // /apiv1/flits?message=h
      // search for a flit that it starts with those letters
      //filtro.message = new RegExp('^' + req.query.message, "i");
      //contains
      filtro.message = new RegExp(req.query.message, "i");

    }

    if (image) {// /apiv1/flits?image=false
      filtro.image = image.toLocaleLowerCase();

    }
    let currentDate = new Date().toISOString();
    filtro.date = { $lte: currentDate };
    const flits = await Flit.lista(filtro, skip, limit, fields, sort);
    res.json(flits);
  } catch (err) {
    next(err);
  }
});

//TODO: add to general get all flits and remove this one.
router.get('/private', authMiddleware, async (req, res, next) => {
  // filters
  // pagination /apiv1/flits/?skip=1&limit=1
  const date = req.query.date;
  const skip = req.query.skip;
  const limit = req.query.limit;
  // fields selection
  const fields = req.query.fields; // /apiv1/flits?fields=name -_id
  // sort
  const sort = req.query.sort; // /apiv1/flits?sort=date%20name // /apiv1/flits?sort=-date%20name

  const author = req.query.author;
  const message = req.query.message;
  let filtro = {};
  console.log('includes ,')
  let authorFilter = [];
  let authors = author.split(',');
  console.log(authors);
  authors.forEach(element => {
    authorFilter.push(
      {
        "author": element
      }
    )
  });
  let currentDate = new Date().toISOString();
  filtro.date = { $lte: currentDate };
  console.log(authorFilter);
  // filtro = { '$or': authorFilter}

  filtro.date = { $lte: currentDate };
  filtro = {
    $and: [
      { $or: authorFilter },
      { $or: [{ date: { $lte: currentDate } }] }
    ]
  }
  let flits = await Flit.listaFollowing(filtro, skip, limit, fields, sort);

  res.json(flits);
});



// GET /apiv1/flits/(id)
// Returns a flit
router.get('/:id', async (req, res, next) => {
  try {

    const id = req.params.id;

    // Search for an ad in database
    const flit = await Flit.findById(id);

    res.json(flit);

  } catch (err) {
    next(err);
  }
});

module.exports = router;


// DELETE /apiv1/flits/:id
// Delete a flit //TODO: delete image file from folder
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {

    const id = req.params.id;

    const flit = await Flit.findById(id);

    if (!flit) {

      return next(createError(404));
    }

    await Flit.deleteOne({ _id: id });
    //TODO: delete img from folder if flit has an image.
    res.json();

  } catch (err) {
    next(err);
  }
});

router.put('/kudos/give/id/:id', authMiddleware, async (req, res, next) => {
  try {

    const id = req.params.id;
    const userData = req.body.kudos;
    console.log(userData);

    const updateFlit = await Flit.findOneAndUpdate({ _id: id }, { $push: { kudos: userData } }, {
      new: true
    });
    // res.json({ updateUser });
    res.json({ updateFlit });

  } catch (err) {
    next(err);
  }
});
router.put('/kudos/remove/id/:id', authMiddleware, async (req, res, next) => {
  try {

    const id = req.params.id;
    const userData = req.body.kudos;
    console.log(userData);

    const updateFlit = await Flit.findOneAndUpdate({ _id: id }, { $pull: { kudos: userData } }, {
      new: true
    });
    // res.json({ updateUser });
    res.json({ updateFlit });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
