import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true,
    },
    stationIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Station',
    }],
    contactMethods: {
        email: { type: Boolean, default: true },
        whatsapp: { type: Boolean, default: false },
    },
}, {
    timestamps: true,
});

subscriptionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);