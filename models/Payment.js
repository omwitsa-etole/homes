const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
	user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
	
    id: {
        type: String,
		
    },
	
	type: {
        type: String,
		default:"card",
    },
	description:{
        type: mongoose.Schema.Types.Object,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('payment', paymentSchema);