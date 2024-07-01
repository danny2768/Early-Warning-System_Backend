import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: [String],
        default: ['USER_ROLE'],
        enum: ['SUPER_ADMIN_ROLE','ADMIN_ROLE', 'USER_ROLE'],
    },
    phone: {
        countryCode: {
            type: String,
            match: [/^\+\d{1,3}$/, 'Please fill a valid country code'], // Matches + followed by 1 to 3 digits
        },
        number: {
            type: String,
            match: [/^\\d{7,15}$/, 'Please fill a valid phone number'] // Matches 7 to 15 digits
        },
    },
}, {    
    timestamps: true,
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const UserModel = mongoose.model('User', userSchema);
