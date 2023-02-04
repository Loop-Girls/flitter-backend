'use strict';
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Follower = require('./Follower')
//import function to validate email
const { isEmail } = require('validator');

// define users schema
const usersSchema = mongoose.Schema({
  name: { type: String, index: true, required: true, unique: true },
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },// validate it is an email: npm install validator ,
  password: { type: String, required: true, minLength: [6, 'Password must be at least 6 characters length'],},
  avatar: { type: String, index: true },
  followers: { type: [Follower.Schema], index: true },
  following: { type: [Follower.Schema], index: true },

});

usersSchema.statics.lista = function (filtro, skip, limit, campos, sort) {
  const query = Users.find(filtro); // this does only return the query not executed
  query.skip(skip);
  query.limit(limit);
  query.select(campos);
  query.sort(sort);
  return query.exec() // here the query is executed and a promise is returned
}

// Create the model
const Users = mongoose.model('Users', usersSchema);

// Export the model
module.exports = Users;