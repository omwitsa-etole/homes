const mongoose = require('mongoose');

const taxSchema = mongoose.Schema({
	company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
	
    name:{
        type:String,
    },
    rate:{
        type:Number,
    },
    status:{
        type:Boolean,
        default:true
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('tax', taxSchema);