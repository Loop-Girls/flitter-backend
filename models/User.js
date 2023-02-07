'use strict';

const mongoose = require('mongoose');
const Follower = require('./Follower')
const bcrypt = require('bcrypt');

// define users schema
const usersSchema = mongoose.Schema({
    username:   {type: String, index: true, required: true, unique: true} ,
    email:    {type: String, index: true, required: true, unique: true, lowercase: true} ,
    password: {type: String, required: true, minLength: 6},
    avatar:   {type: String, index: true},
    followers:    {type: [Follower.Schema], index: true},
    following: {type: [Follower.Schema], index: true}
});

usersSchema.statics.lista = function (filtro, skip, limit, campos, sort) {
  const query = Users.find(filtro); // this does only return the query not executed
  query.skip(skip);
  query.limit(limit);
  query.select(campos);
  query.sort(sort);
  return query.exec() // here the query is executed and a promise is returned
}
//fire a function after doc saved to db
usersSchema.post('save', function(doc, next){
  console.log('new user was created &saved', doc);
  next();
})

//fire a function before doc saved to db
usersSchema.pre('save', async function(next){
  // console.log('user about to be created and saved', this)
  const salt = await bcrypt.genSalt();
  //get hash version of the password
  this.password = await bcrypt.hash(this.password, salt);
  next();

});

//static method to login user
usersSchema.statics.login = async function (email, password){
  //check if user exists in database
  const user = await this.findOne({email:email});
  if(user){
    //compare password from login with password stored in database that is hashed
    const auth = bcrypt.compare(password, user.password);
    if(auth){
      return user;
    }
    throw Error('incorrect password'); //change to credentials
  }
  throw Error("incorrect email"); //change to credencials
}

// Create the model
const Users = mongoose.model('Users', usersSchema);

// Export the model
module.exports = Users;