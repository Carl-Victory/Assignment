const tokenGenerated = require('../JWT/token');
const userSchema = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'yourSecretKey'; // Use an environment variable for security


//USER REGISTERATION
const register = async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' })
    }try {
        const user = await userSchema.findOne({ email })
        if (user) {
            return res.status(409).json({ message: 'User already exists' })
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const newUser = new userSchema({ username, email, password: hash })
        await newUser.save()
        res.status(200).json({ user: newUser })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Server error' })
    }
}


//USER LOGIN

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }
  try {
    const userLog = await userSchema.findOne({ email });
    if (!userLog) {
      return res.status(404).json({ message: 'Email or Password is incorrect' });
    }
    // Compare the provided password with the stored hashed password
    const validPassword = bcrypt.compareSync(password, userLog.password);
    if (!validPassword) {
      return res.status(404).json({ message: 'Email or Password is incorrect' });
    }
    // Generate the token
    const token = tokenGenerated(userLog);
    // Set the token as a secure cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === 'production', // Ensures HTTPS only in production
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'Strict',
    });
    // Exclude the password from the user object in the response
    const { password: _, ...userdata } = userLog.toObject();
    return res.status(200).json({ message: 'Login successful', userdata, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//GET ALL USERS
const getUsers = async (req, res) => {
    try {
        const users = await userSchema.find()
        res.status(200).json({ users })
        if (!users) {
            return res.status(401).json({ message: 'No users found' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}


module.exports = { register, login, getUsers };
