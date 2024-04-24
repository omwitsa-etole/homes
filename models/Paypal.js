const mongoose = require('mongoose');

const paypalSchema = mongoose.Schema({
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
	
    name: {
        type: String,
        required: true,
    },
    id_key:{
        type:String,
    },
    secret_key:{
        type:String,
    },
    active:{
        type:Boolean,
        default:false,
    },
    enviroment:{
        type:Boolean,
        default:false,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('paypal', paypalSchema);