import mongoose, { Schema } from "mongoose";

const sensorSchema = new mongoose.Schema({
    name: {
        type: String,        
        required: [ true, 'name is required'],
    },
    sensorType: {
        type: String,
        enum: ["level", "flow", "rain"],
        required: [ true, 'sensorType is required'],
    },
    threshold: {
        yellow: Number,
        orange: Number,
        red: Number,
        _id: false,
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