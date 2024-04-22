import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
    sensor: {
        type: String,
        enum: ["level", "flow", "rain"],
        required: [ true, 'Name is required'],
    },
    value: { 
        type: Number, 
        required: [ true, 'Value is required'],
    },
    receivedAt: { 
        type: Date, 
        default: new Date(),
        required: [ true, 'ReceivedAt is required'],
    },
    threshold: {    // Add required if necessary
        type: Number,
        default: null
    },
    sendingInterval: {  // Add required if necessary
        type: Number,
        default: null
    },

});

export const SensorModel = mongoose.model("Sensor", sensorSchema);