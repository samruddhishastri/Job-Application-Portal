const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
    displayName: {type: String},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true, minlength: 8},
    typeOfUser: {type: String, required: true},
    contact_no: {type: String},
    bio: {type: String},
});

module.exports = Recruiter = mongoose.model("recruiter", recruiterSchema);