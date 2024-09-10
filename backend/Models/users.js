const mongoose = required("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordhash: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, unique: true },
    lastName: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: String, default: Date.now}
});

const User = mongoose.model('User', userSchema);