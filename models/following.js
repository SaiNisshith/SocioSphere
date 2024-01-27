const mongoose = require('mongoose');

//for maintaing the created at and updated at we make timestamps: true
const followingSchema = new mongoose.Schema({
   from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   },
   to: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
   }
},{
    timestamps: true
})

const Following = mongoose.model('Following',followingSchema);
module.exports = Following;