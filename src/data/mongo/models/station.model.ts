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
        longitude: {
            type: Number,
            required: [ true, 'longitude is required'],
        },
        latitude: {
            type: Number,
            required: [ true, 'latitude is required'],
        },        
        _id: false,        
    },    
    networkId: {
        type: Schema.Types.ObjectId,
        required: [ true, 'networkId is required'],
        ref: 'Network',        
    },
    isVisibleToUser: {
        type: Boolean,
        required: true,
        default: true,
    },
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