const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
    displayName: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true, minlength: 8},
    typeOfUser: {type: String, required: true},
    education: [{
        name: {type : String},
        start_year: {type: Number},
        end_year: {type: Number}
    }],

    skills: [
        {type: String}
    ],
    rating: {type: Number, default: 0},
    rating_num: {type: Number, default: 0},
    rating_den: {type: Number, default: 0},
    applied_jobs: [{
        id:{type: String, required: true},
        status:{type: String, required: true}
    }]
});

module.exports = Applicant = mongoose.model("applicant", applicantSchema);
