const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
	company:{
		type: mongoose.Schema.Types.ObjectId,
        ref: 'companyr'
	},
    name: {
        type: String,
        required: true,
    },
    plate: {
        type: String,

    },
    live_view:{
        type:Boolean,
        default:false,
    },
    description: {
        type: mongoose.Schema.Types.Object,
        default:{default:true}
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = mongoose.model('vehicle', vehicleSchema);