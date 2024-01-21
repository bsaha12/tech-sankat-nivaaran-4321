const jwt = require('jsonwebtoken');
const { UserModel } = require('../model/user.model');

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'masai'); // Replace with your actual JWT secret key

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
    }

    req.user = {
      userId: user._id,
      image:user.image,
      username: user.username,
      email:user.email,
      phoneNumber:user.phoneNumber,
      dateofBirth:user.dateofBirth,
      designation: user.designation,
      role:user.role,
      registeredDate:user.registeredDate

    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

module.exports = { authenticateToken };
