const { Router } = require('express');
const { register, login, getUsers } = require('../controller/usercontroller');
const { authmiddleware, verifyToken, verifyOwnership } = require('../middleware/authmidlleware');
const { postBook, updateBook, deleteBook } = require('../controller/bookcontroller');
const router = Router();


router.post('/register', register);  //REGISTER USER

router.post('/login', login);  //LOGIN USER

router.get('/users', authmiddleware, getUsers);  //GET ALL USERS

router.post('/postbook', authmiddleware, postBook);  // POST BOOK after auth

router.put('/book/:id', verifyToken, verifyOwnership, updateBook);    //UPDATE BOOK

router.delete('/book/:id', verifyToken, verifyOwnership, deleteBook); //DELETE BOOK


module.exports = router;


