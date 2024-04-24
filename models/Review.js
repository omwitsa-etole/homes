const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
	company:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
	},
    
	user:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
	},

    book:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
	},

    invoice:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'invoice'
	},
	vehicle:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle'
	},
    description:{
        type:String,
        default: null,
    },
	rating:{
        type:Number,
        default: null,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('review', reviewSchema);