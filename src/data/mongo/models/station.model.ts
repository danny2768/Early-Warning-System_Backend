import mongoose, { Schema } from "mongoose";

const stationSchema = new mongoose.Schema({
    name: {
        type: String,        
        required: [ true, 'name is required'],
    },
    city: {
        type: String,
        // required: [ true, 'city is required'],
    },        
    state: {
        type: String,
        required: [ true, 'state is required'],     
    },
    countryCode:{
        type: String,
        required: [ true, 'countryCode is required'],
    },
    coordinates: {
        type: {
            longitude: Number,
            latitude: Number,
        },
        _id: false,
        required: [ true, 'coordinates are required'],
    },    
    networkId: {
        type: Schema.Types.ObjectId,
        ref: 'Network',        
    }

}, {
    timestamps: true,
});

stationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const StationModel = mongoose.model("Station", stationSchema);