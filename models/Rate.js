const mongoose = require('mongoose');

const rateSchema = mongoose.Schema({
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    type: {
        type: String,
		required:true,
        
    },
    active: {
        type: Boolean,
		default:true
    },
    price: {
        type: Number,
		required:true,
    },
	
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('rate', rateSchema);