const jwt = require('jsonwebtoken');
const { UserModel } = require('../model/user.model');

const extractUserMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.user = null;
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, 'masai'); 

    const user = await UserModel.findById(decoded.userId);
    console.log(user)
    if (!user) {
      req.user = null;
    } else {
      req.user = {
        userId: user._id,
        username: user.username,
        role: user.role, 
      };
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = { extractUserMiddleware };
