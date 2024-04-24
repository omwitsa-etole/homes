const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
	phone: {
        type: Number,
        default:254,
    },
	stripe_id:{
		type:String,
		unique: true,
	},
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('user', UserSchema);