'use strict';

const mongoose = require('mongoose');
const User = require('./User')

// define comment schema
const commentsSchema = mongoose.Schema({
    author:   {type: String, index: true, required: true} ,
    image:    {type: String, index: true} ,
    message:   {type: String, index: true},
    //TODO: add date
    kudos:    {type: [User.schema], index: true},
});

commentsSchema.statics.lista = function (filtro, skip, limit, campos, sort) {
  const query = Comments.find(filtro); // this does only return the query not executed
  query.skip(skip);
  query.limit(limit);
  query.select(campos);
  query.sort(sort);
  return query.exec() // here the query is executed and a promise is returned
}


// Create the model
const Comments = mongoose.model('Comments', commentsSchema);

// Export the model
module.exports =Comments;