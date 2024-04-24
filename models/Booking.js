const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
	company:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'company',
	},
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'user',
	},
	vehicle:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'vehicle',
	},
	invoice:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'invoice',
	},
	
	checkout:{
		type:Date,
		
	},
	description:{
		type: mongoose.Schema.Types.Object,
		default:{default:true}
	},
	total:{
		type:Number,
		default: 0
	},
	saved:{
		type:Boolean,
		default:true,
	},
	complete:{
		type:Boolean,
		default: false,
	},
	confirmed:{
		type:Boolean,
		default: false,
	},

	comments:{
		type:String,

	},
	
    date: {
        type: Date,
        default: Date.now(),
    }
	
});

module.exports = mongoose.model('booking', BookingSchema);