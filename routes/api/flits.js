'use strict';

const express = require('express');
const createError = require('http-errors');
const Flit = require('../../models/Flit');
const multer = require('../../config/multer');
const router = express.Router();
const imageRoute = 'http://localhost:3000/images/flits/'


// CRUD

// POST /apiv1/flits(body=adData)
// Create a flit


router.post('/post', multer.single("imagen"), async function (req, res, next) {
  console.log(req.file);
  console.log(req.body);
  if (req.body.message == undefined && req.file == undefined || req.body.message=='' && req.file == undefined) {
    res.status(400).json({ error:"Can't post a flit without any message or picture." });
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
      res.status(400).json({ error:"Can't post a flit without any message or picture." });
    }
  }





});
// router.post('/post', async (req, res, next) => {
//   try {

//     const adData = req.body;
//     // instanciate new ad in the memory
//     const flit = new Flit(adData);

//     // save it in de database
//     const savedFlit = await flit.save();

//     res.json({ result: savedFlit });
//     // }


//   } catch (err) {
//     next(err);
//   }
// });

// PUT /apiv1/flits/(id) (body=agenteData)
// Update a flip
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
    const fields = req.query.fields; // /apiv1/flits?fields=name -_id
    // sort
    const sort = req.query.sort; // /apiv1/flits?sort=date%20name // /apiv1/flits?sort=-date%20name

    const filtro = {};
    // if(date){
    //   filtro.date= req.query.exactAuthor;
    // }
    if (exactAuthor) {
      filtro.author = req.query.exactAuthor;
    }

    if (author) { // /apiv1/flits?author=k
      // search for a product that it starts with those letters
      filtro.author = new RegExp('^' + req.query.author, "i");;
    }
    if (message) { // /apiv1/flits?message=h
      // search for a product that it starts with those letters
      filtro.message = new RegExp('^' + req.query.message, "i");;
    }

    if (image) {// /apiv1/flits?image=false
      filtro.image = image.toLocaleLowerCase();
    }

    //TODO: maybe
    //   if (tag) {// /apiv1/ads?tags=lifestyle,work
    //     if (tag.includes(',')) {
    //       filtro.tags = { '$all': tag.split(',') }
    //     } else {// 1 tag query /apiv1/ads?tags=mobile
    //       filtro.tags = { '$in': tag };
    //     }

    //   }
    // /apiv1/flits?kudos=1000
    // if (kudos) {
    //     if (kudos.includes('-')) {
    //         if (kudos.charAt(0) === '-') {// /apiv1/flits?kudos=-50 Search for product less or equal than 50
    //             const maxKudos = kudos.slice(1);
    //             filtro.kudos= { '$lte': maxKudos };
    //             console.log(maxKudos);
    //         } else if (kudos.slice(-1) === '-') {  // /apiv1/flits?kudos=10- Search for product greater or equal than 10
    //             const minKudo = kudos.split('-');
    //             filtro.kudos = { '$gte': (minKudo[0]) };
    //         } else {
    //             // /apiv1/flits?price=0-50 Search for product between 0-50 price
    //             const minMaxArray = kudos.split('-');
    //             const min = minMaxArray[0];
    //             const max = minMaxArray[1];
    //             filtro.kudos = { '$gte': min, '$lte': max };
    //         }

    //     } else {// /apiv1/flits?kudo=32
    //         filtro.kudos = kudos;
    //     }
    // }


    const flits = await Flit.lista(filtro, skip, limit, fields, sort);
    res.json(flits);
  } catch (err) {
    next(err);
  }
});

//TODO: get all flits from following


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
router.delete('/:id', async (req, res, next) => {
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

module.exports = router;
