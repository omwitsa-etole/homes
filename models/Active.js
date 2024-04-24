const mongoose = require('mongoose');

const activeSchema = mongoose.Schema({
	parked:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'parked'
	},
	handler:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'handler'
	},
	booking:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'booking'
	},
    clockedin: {
        type: Date,
        required: true,
    },
	clockedout: {
        type: Date,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('active', activeSchema);