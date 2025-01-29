const jwt = require('jsonwebtoken');
require('dotenv').config();

const tokenGenerated = (userId) => {
  // Ensure you are using the correct variable name
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '5h' });
};

module.exports = tokenGenerated;
