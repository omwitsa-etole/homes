const mongoose = require('mongoose');

const shippingSchema = mongoose.Schema({
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
	
    
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('shipping', shippingSchema);