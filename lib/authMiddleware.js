const basicAuth = require('basic-auth');
const jwt = require('jsonwebtoken');
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

const requireAuth = (req, res, next) => {
  //grab token from cookies
  const token = req.cookies.jwt;

  //check json web token exists % is verified
  if(token){
    jwt.verify(token,'loop girls secret', (err, decodedToken)=>{
      if(err){
        console.log(err.message);
        res.redirect('http://localhost:8080/login');
      }else{
        console.log(decodedToken);
        next();
      }
    })
  }else{
    res.redirect('http://localhost:8080/login')
  }
  
}

module.exports = { basicAuthMiddleware, requireAuth}