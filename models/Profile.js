const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
		
    },
	
    name: {
        type: String,
        
    },
    email: {
        type: String, 
        
    },
	phone: {
        type: Number,
        
    },
	
	address: {
        type: String, 
		
    },
	fb: {
        type: String, 
		
    },
	ig: {
        type: String, 
		
    },
	tw: {
        type: String, 
		
    },
	description: {
        type: String, 
		
    },
    image:{
        type:String,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('profile', profileSchema);