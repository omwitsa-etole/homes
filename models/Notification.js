const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
	user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
   
    name: {
        type: String,
    },
	model: {
        type: String,
    },
    description: {
        type: String,
    },
	price: {
        type: Number,
    },
	checked: {
        type: Boolean,
		default: false,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('notification', notificationSchema);