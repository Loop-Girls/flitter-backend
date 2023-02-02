'use strict';
const fsPromises = require('fs').promises;
const mongoose = require('mongoose');
const User = require('./User')
const Comment = require('./Comment')

// define flits schema
const flitsSchema = mongoose.Schema({
  author: { type: String, index: true, required: true },
  image: { type: String, index: true },
  message: { type: String, index: true },
  date: {type: String,index: true, required:true}, //TODO: change type to Date?
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
/**
 * load a json of flits
 */
flitsSchema.statics.cargaJson = async function (fichero) {

  const data = await fsPromises.readFile(fichero, { encoding: 'utf8' });

  if (!data) {
    throw new Error(fichero + ' is empty!');
  }

  const flits = JSON.parse(data).flits;
  const numFlits = flits.length;

  for (var i = 0; i < flits.length; i++) {
    await (new Flits(flits[i])).save();
  }

  return numFlits;

};

// Create the model
const Flits = mongoose.model('Flits', flitsSchema);

// Export the model
module.exports = Flits;