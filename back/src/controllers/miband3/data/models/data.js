const mongoose = require('mongoose');

const MiBandSchema = new mongoose.Schema({
    mac: {
        type: String,
        index: true,
        require: true
    },
    heartbeat: Number,
    steps: Number,
    callories: Number,
    fat_gramms: Number,
    meters: Number,
    battery: Number,
    time: Date,
    created_date: {
        type: Date,
        default: Date.now()
    }
},{ versionKey: false });

const Data = mongoose.model("miband_data", MiBandSchema);
module.exports = Data;
