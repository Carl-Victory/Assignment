const express = require('express')
const mongodb = require('./databaseConnection/mongodb')
const router = require('./routers/allRouters')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const port=process.env.PORT


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', router)

//Database Connection
mongodb()


//Port Testing
app.get('/', function (req, res) {
    res.send('Hello World')
  })
  app.listen(port, console.log(`listening on port ${port}`))
