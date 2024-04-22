import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: [String],
        default: ["USER_ROLE"],
        enum: ["ADMIN_ROLE", "USER_ROLE"],
    },
    dateCreated: {
        type: Date,
        default: new Date(),
        required: true,
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
});

export const UserModel = mongoose.model("User", userSchema);
