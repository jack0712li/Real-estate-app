import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    firstname: {
        type: String,
        required: false,
        unique: false,
        minlength: 1,
    },
    lastname: {
        type: String,
        required: false,
        unique: false,
        minlength: 1,
    },
    location: {
        type: String,
        required: false,
        unique: false,
        minlength: 1,
    },
    description: {
        type: String,
        required: false,
        unique: false,
        maxlength: 1024
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    avatar: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
    },
    favorites: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favorite'
    },
    type: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer',
        required: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;