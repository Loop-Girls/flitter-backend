const basicAuth = require('basic-auth');

const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next)=>{
  const token = req.cookies.jwt;
  //check if json web token exists and is verified
  if(token){
    jwt.verify(token, 'loop girls secret', (err, decodedToken)=>{
      if(err){
        return {err}
      } else{
        console.log(decodedToken);
        next();
      }
    })
  }else{
    next();
  }
}

const basicAuthMiddleware= (req, res, next) => {

  const usuario = basicAuth(req);

  // check if user's data is in the data base and check its credentials.

  if (!usuario || usuario.name !== 'admin' || usuario.pass !== '1234') {
    res.set('WWW-Authenticate', 'Basic realm=Authorization required');
    res.sendStatus(401);
    return;
  }

  next();

}

module.exports = {requireAuth, basicAuthMiddleware}