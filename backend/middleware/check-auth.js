import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secret_this_should_be_longer');
    req.userData = { email: decoded.email, userId: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Auth failed!' });
  }
};
