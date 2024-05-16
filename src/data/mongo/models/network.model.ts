import mongoose, { Schema } from "mongoose";

const networkSchema = new mongoose.Schema({
    name: {
        type: String,        
        required: [ true, 'name is required'],
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});

networkSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const NetworkModel = mongoose.model("Network", networkSchema);