const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
    name: String,
    email: String,
    password: String,

}, { timestamps: true });

const Admin = model("Admin", adminSchema);

module.exports = Admin;