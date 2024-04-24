const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
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
    address:{
        type:Array,
        default: null,
    },
	cancelled:{
        type:Boolean,
        default: false,
    },
	delivered:{
        type:Boolean,
        default: false,
    },
	due: {
        type: Date,
        default: null,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('order', orderSchema);