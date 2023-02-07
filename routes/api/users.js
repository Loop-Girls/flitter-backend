var express = require('express');
var router = express.Router();
const User = require('../../models/User');

/* GET users listing. */


// PUT /apiv1/flips/(id) (body=agenteData)
// Update a flip
router.put('/:id', async (req, res, next) => {
  try {

    const id = req.params.id;
    const adData = req.body;

    const updateUser = await User.findOneAndUpdate({ _id: id}, adData, {
      new: true
    });
    res.json({ updateUser });

  } catch (err) {
    next(err);
  }
});

// GET /apiv1/flits
// Returns list of flits
router.get('/', async (req, res, next) => {
  try {

      // filters
      const name = req.query.name;
      const id= req.query.id;
   
      // pagination /apiv1/flits?skip=1&limit=1
      const skip = req.query.skip;
      const limit = req.query.limit;
      // fields selection
      const fields = req.query.fields; // /apiv1/flits?fields=name -_id
      // sort
      const sort = req.query.sort; // /apiv1/flits?sort=date%20name // /apiv1/flits?sort=-date%20name

      const filtro = {};

      if (name) { // /apiv1/ads?author=Bi
          // search for a product that it starts with those letters
          filtro.name = new RegExp('^' + req.query.name, "i");;
      }
      if (message) { // /apiv1/ads?message=Bi
          // search for a product that it starts with those letters
          filtro.message = new RegExp('^' + req.query.message, "i");;
      }
     
      if (image) {// /apiv1/flits?image=false
          filtro.image = image.toLocaleLowerCase();
      }

      const flits = await Flit.lista(filtro, skip, limit, fields, sort);
      res.json({ results: flits });
  } catch (err) {
      next(err);
  }
});

// GET /apiv1/flits/(id)
// Returns a flit
router.get('/:id', async (req, res, next) => {
  try {

      const id = req.params.id;

      // Search for an ad in database
      const user = await User.findById(id);

      res.json({ user });

  } catch (err) {
      next(err);
  }
});

module.exports = router;


// DELETE /apiv1/flits/:id
// Delete a flit
router.delete('/:id', async (req, res, next) => {
  try {

    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      
      return next(createError(404));
    }

    await User.deleteOne({ _id: id });

    res.json();

  } catch (err) {
    next(err);
  }
});

module.exports = router;

module.exports = router;
