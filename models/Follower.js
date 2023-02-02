'use strict';

const mongoose = require('mongoose');

// define follower schema
const followersSchema = mongoose.Schema({
    name:   {type: String, index: true, required: true} ,
    avatar:   {type: String, index: true}
});

followersSchema.statics.lista = function (filtro, skip, limit, campos, sort) {
  const query = Followers.find(filtro); // this does only return the query not executed
  query.skip(skip);
  query.limit(limit);
  query.select(campos);
  query.sort(sort);
  return query.exec() // here the query is executed and a promise is returned
}


// Create the model
const Followers = mongoose.model('Followers', followersSchema);

// Export the model
module.exports = Followers;