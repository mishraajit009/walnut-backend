const jwt = require('jsonwebtoken');
const secretKey ='secret';
function authenticateTokenUser(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).send('Access denied. Token is missing.');
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).send('Invalid token.');
      }
      if (user.role !== 'user') {
        return res.status(403).send('Invalid role. Access denied.');
      }
      req.user_detail = user;
      next();
    });
}
function authenticateTokenAdmin(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).send('Access denied. Token is missing.');
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).send('Invalid token.');
      }
      if (user.role !== 'admin') {
        return res.status(403).send('Invalid role. Access denied.');
      }
      req.user_detail = user;
      next();
    });
}
module.exports = {
    authenticateTokenAdmin,
    authenticateTokenUser
};
  