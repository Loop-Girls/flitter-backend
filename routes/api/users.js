var express = require('express');
var router = express.Router();
const User = require('../../models/User');

/* GET users listing. */


// PUT /apiv1/users/(id) (body=userData)
// Update a user
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
router.put('/follow/id/:id', async (req, res, next) => {
  try {

    const id = req.params.id;
    const userData = req.body.following;
    console.log(userData);

    const updateUser = await User.findOneAndUpdate({_id: id},{ $push: { following: userData} }, {
      new: true
    });
    // res.json({ updateUser });

    const updateUser2 = await User.findOneAndUpdate({username: userData},{ $push: { followers: updateUser.username} }, {
      new: true
    });
    res.json({ updateUser,updateUser2 });

  } catch (err) {
    next(err);
  }
});
router.put('/unfollow/id/:id', async (req, res, next) => {
  try {

    const id = req.params.id;
    const userData = req.body.following;
    console.log('userdata' + userData);

    const updateUser = await User.findOneAndUpdate({_id: id},{ $pull: { following: userData} }, {
      new: true
    });
    // res.json({ updateUser });

    const updateUser2 = await User.findOneAndUpdate({username: userData},{ $pull: { followers: updateUser.username} }, {
      new: true
    });
    //return user to update loggedUser in front
    res.json({ updateUser});

  } catch (err) {
    next(err);
  }
});

// GET /apiv1/users
// Returns list of users
router.get('/', async (req, res, next) => {
  try {

      // filters
      const name = req.query.name;
      const id= req.query.id;
   
      // pagination /apiv1/users?skip=1&limit=1
      const skip = req.query.skip;
      const limit = req.query.limit;
      // fields selection
      const fields = req.query.fields; // /apiv1/users?fields=name -_id
      // sort
      const sort = req.query.sort; // /apiv1/users?sort=date%20name // /apiv1/users?sort=-date%20name

      const filtro = {};

      if (name) { // /apiv1/ads?author=Bi
          // search for a product that it starts with those letters
          filtro.name = new RegExp('^' + req.query.name, "i");;
      }
     

      const users = await User.lista(filtro, skip, limit, fields, sort);
      res.json(users);
  } catch (err) {
      next(err);
  }
});

// GET /apiv1/users/(id)
// Returns a user
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


// DELETE /apiv1/users/:id
// Delete a user
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