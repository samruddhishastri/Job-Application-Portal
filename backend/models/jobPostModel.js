const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    recruiter_id: {type: String, required:true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    max_applications: {type:Number},
    max_positions: {type: Number},
    date: {type: Date, default: Date.now},
    deadline: { type:Date },
    deadline_sec: {type: Number},
    skill_set: [
        {type: String}
    ],
    typeOfJob: {type: String},
    duration: {type: Number},
    salary: {type: Number},
    rating: {type: Number, default: 0},
    rating_num: {type: Number, default: 0},
    rating_den: {type: Number},
    no_of_accepted_candidates: {type: Number, default: 0},
    applicants_list: [{
        applicant_id: {type: String, required: true},
        sop: {type: String, required:true},
        stage: {type: String, required:true},
        date_of_application: {type: Date, default: Date.now()},
        date_of_acceptance: {type: Date}
    }]
});

module.exports = JobPost = mongoose.model("jobPost", jobPostSchema);