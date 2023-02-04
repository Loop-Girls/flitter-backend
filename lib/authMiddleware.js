const basicAuth = require('basic-auth');


module.exports = (req, res, next) => {

  const usuario = basicAuth(req);

  // check if user's data is in the data base and check its credentials.

  if (!usuario || usuario.name !== 'admin' || usuario.pass !== '1234') {
    res.set('WWW-Authenticate', 'Basic realm=Authorization required');
    res.sendStatus(401);
    return;
  }

  next();

}