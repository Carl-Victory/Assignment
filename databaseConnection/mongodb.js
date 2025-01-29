const mongoose = require('mongoose')
require('dotenv').config();

const mongodb = async (req,res) => {
    try {
        await mongoose.connect(process.env.MONGO, {connectTimeoutMS: 50000})
    } catch (error) {
        console.log(error);
    }console.log('Connected to database');
}

module.exports= mongodb

