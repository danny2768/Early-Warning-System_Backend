import mongoose, { Schema } from "mongoose";

const sensorSchema = new mongoose.Schema({
    name: {
        type: String,        
        required: [ true, 'name is required'],
    },
    sensor: {
        type: String,
        enum: ["level", "flow", "rain"],
        required: [ true, 'name is required'],
    },
    readings: [{
        type: Schema.Types.ObjectId,
        ref: 'Reading',    
    }],    
    threshold: {    // Add required if necessary
        type: Number,
        required: [ true, 'threshold is required'],
    },
    sendingInterval: {  // Add required if necessary
        type: Number,
        required: [ true, 'sendingInterval is required'],
    },
    stationId: {
        type: Schema.Types.ObjectId,
        ref: 'Station',
        required: [ true, 'stationId is required'],
    }

}, {    
    timestamps: true,
});

sensorSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const SensorModel = mongoose.model("Sensor", sensorSchema);