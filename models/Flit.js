'use strict';

const mongoose = require('mongoose');
const User = require('./User')
const Comment = require('./Comment')

// define flips schema
const flitsSchema = mongoose.Schema({
  author: { type: String, index: true, required: true },
  image: { type: String, index: true },
  message: { type: String, index: true },
  date: {type: Date,index: true, required:true},
  kudos: { type: [User.schema], index: true },
  comments: { type: [Comment.schema], index: true },
});

flitsSchema.statics.lista = function (filtro, skip, limit, campos, sort) {
  const query = Flits.find(filtro); // this does only return the query not executed
  query.skip(skip);
  query.limit(limit);
  query.select(campos);
  query.sort(sort);
  return query.exec() // here the query is executed and a promise is returned
}


// Create the model
const Flits = mongoose.model('Flits', flipsSchema);

// Export the model
module.exports = Flits;