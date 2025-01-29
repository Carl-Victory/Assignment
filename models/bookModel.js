const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title : {type: String, required: true},
    author : {type: String, required: false},
    yearofpublication : {type: Number, required: true},
    price : {type: String, required: true},
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {timestamps: true});

    module.exports = mongoose.model('Book', bookSchema);