const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
	
	booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
   
	amount: {
        type: Number,
    },
	rate: {
        type: String,
      
    },
	
	complete: {
        type: Boolean,
        default: false,
    },
	due:{
		type: Date,
        default: null,
	},
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('invoice', invoiceSchema);