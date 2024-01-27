const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./user');

const resetPasswordSchema = new mongoose.Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    accessToken: { 
        type: String,
        default: function () {
            return crypto.randomBytes(30).toString('hex');
        },
        unique: true
    },createdAt: {
        type: Date,
        default: Date.now(),
        expires: 15 * 60,
    }
});

const ResetPassword = mongoose.model('ResetPassword',resetPasswordSchema);
module.exports = ResetPassword;