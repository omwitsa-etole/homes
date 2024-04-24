const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
	user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
	
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
	
	complete:{
		type:Boolean,
		default: false,
	},
		
    date: {
        type: Date,
        default: Date.now(),
    }
	
});

module.exports = mongoose.model('follow', followSchema);