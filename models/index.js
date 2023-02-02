module.exports = {
    mongoose: require('mongoose'),
    connectMongoose: require('../lib/connectMongoose'),
    // Anuncio: require('./Anuncio') Modificar por nombre del modelo (Flip, User) para poder usarlo en otros archivos //TODO

    Flip: require('./Flit'),
    Comment: require('./Comment'),
    User: require('./User'),
    Follower: require('./Follower')
  }