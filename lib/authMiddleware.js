const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    // Header names in Express are auto-converted to lowercase
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");
    if (!token) return res.status(403).send("Access denied.");
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('verified ');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}