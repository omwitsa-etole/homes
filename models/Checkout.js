const mongoose = require('mongoose');

const checkoutSchema = mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
	},
    id:{
        type:String,
    },
    description:{
        type: mongoose.Schema.Types.Object,
        default:{default:true}
    },
    completed:{
        type:Boolean,
        default:false
    },
    invoices:{
        type:Array,
        default:[]
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('checkout', checkoutSchema);