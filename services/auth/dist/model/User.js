import mongoose, { Schema, Document } from "mongoose";
const schema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
const User = mongoose.model("User", schema);
export default User;
