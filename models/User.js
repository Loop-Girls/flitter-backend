'use strict';
const fsPromises = require('fs').promises;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Follower = require('./Follower')

//import function to validate email
const { isEmail } = require('validator');
// define users schema
const usersSchema = mongoose.Schema({
  username: { type: String, index: true, required: true, unique: true },
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },// validate it is an email: npm install validator ,
  password: { type: String, required: true, minLength: [6, 'Password must be at least 6 characters length'], },
  avatar: { type: String },
  followers: { type: [String] }, //TODO: change to ref User
  following: { type: [String] },

});


usersSchema.statics.lista = function (filtro, skip, limit, campos, sort) {
  const query = Users.find(filtro); // this does only return the query not executed
  query.skip(skip);
  query.limit(limit);
  query.select(campos);
  query.sort(sort);
  return query.exec() // here the query is executed and a promise is returned
}
/**
 * load a json of flits
 */
usersSchema.statics.cargaJson = async function (fichero) {

  const data = await fsPromises.readFile(fichero, { encoding: 'utf8' });

  if (!data) {
    throw new Error(fichero + ' is empty!');
  }

  const users = JSON.parse(data).users;
  const numUsers = users.length;

  for (var i = 0; i < users.length; i++) {
    await (new Users(users[i])).save();
  }

  return numUsers;

};

//fire a function before doc saved to db
usersSchema.pre('save', async function (next) {
  // console.log('user about to be created and saved', this)
  const salt = await bcrypt.genSalt();
  //get hash version of the password
  this.password = await bcrypt.hash(this.password, salt);
  next();

});

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', username: ''}

  //incorrect email
  if(err.message === 'incorrect email'){
      errors.email = 'that email in not registered';
  }

  //duplicate error code
  if (err.code === 11000) {
      if(err.message.includes('username')){
          errors.username = 'That username is already registered'
      }else{
          errors.email= 'That email is already registered'
      }
      
      return errors;
  }

  //validation errors 
  if (err.message.includes('Users validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
          errors[properties.path] = properties.message;
      });

  }

  return errors;
}

//static method to login user
usersSchema.statics.login = async function (email, password) {
  //check if user exists in database
  const user = await this.findOne({ email: email });
  if (!user){
    console.log('not valid email');
    return null;
  } else{
      //compare password from login with password stored in database that is hashed
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword){
      console.log('not valid password');
      return null;
    } else{
      return user;
    }
  }

}
// Create the model
const Users = mongoose.model('Users', usersSchema);

// Export the model
module.exports = Users;