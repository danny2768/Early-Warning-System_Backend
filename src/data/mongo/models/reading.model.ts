import mongoose, { Schema } from "mongoose";

const readingSchema = new mongoose.Schema({
    value: { 
        type: Number, 
        required: [ true, 'value is required'],
    },
    sensor: {
        type: Schema.Types.ObjectId,
        ref: "Sensor",
        required: [ true, 'sensor is required'],
    },    
}, {    
    timestamps: true,
});

readingSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const ReadingModel = mongoose.model("Reading", readingSchema);