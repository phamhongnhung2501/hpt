const mongoose = require('mongoose');

const InformationSchema = new mongoose.Schema({
    mac: {
        type: String,
        required: true
    },
    patient_name:{
        type: String,
        required: true
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    phone_number:{
        type: String,
        required: true
    },
    alert_heart_beat:{
        type: Number,
        required: true
    },
    photo: {
        type: String,
        default: 'avatar\\unknown.png'
    },
    address:{
        type: String,
    },
    health_status:{
        type: String
    }
},{ versionKey: false });

const Information = mongoose.model("miband_info", InformationSchema);
module.exports = Information;
