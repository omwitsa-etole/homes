const mongoose = require('mongoose');

const stripeSchema = mongoose.Schema({
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
	
    name: {
        type: String,
        required: true,
    },
    public_key:{
        type:String,
    },
    private_key:{
        type:String,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('stripe', stripeSchema);