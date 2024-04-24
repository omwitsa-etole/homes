const mongoose = require('mongoose');

const wishSchema = mongoose.Schema({
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
		
    },
	user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle'
    },

    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('wish', wishSchema);