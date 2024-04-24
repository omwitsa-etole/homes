const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },

    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
       
		default: 0,
    },
    rate: {
        type: String,
		required: true,
    },
	address: {
        type: String,
		default: "",
    },
	
    type : {
        type: String, 
		
    },
	description : {
        type: String, 
		
    },
	email : {
        type: String, 
		
    },
	phone : {
        type: String, 
		
    },
	
	spots: {
        type: Number,
		default: 1,
    },
	
    date: {
        type: Date,
        default: Date.now(),
    },
	
	
});

module.exports = mongoose.model('product', productSchema);