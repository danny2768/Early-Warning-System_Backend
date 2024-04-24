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
    // TODO: add country
    state: {
        type: String,
        required: [ true, 'state is required'],     
    },
    coordinates: {
        type: {
            longitude: Number,
            latitude: Number,
        },
        required: [ true, 'coordinates are required'],
    },    
    sensors: [{
        type: Schema.Types.ObjectId,
        ref: 'Sensor', 
        // Can't be required since you need to create a station before creating a sensor
    }],
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