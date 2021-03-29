const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Applicant = require("../models/applicantModel");
const Recruiter = require("../models/recruiterModel");
const JobPost = require("../models/jobPostModel");

router.post("/register", async(req, res) => {
    
    try {
        let { email, password, passwordCheck, displayName, typeOfUser } = req.body;
        
        //validate

        if (!displayName || !email || !password || !passwordCheck || !typeOfUser)
            return res.status(400).json({msg: "Not all fields have been entered"});

        if (password.length < 8)
            return res.status(400).json({msg: "Password to be atleast 8 characters long"});

        if(password !== passwordCheck)
            return res.status(400).json({msg: "Confirm password in not as same as password"});       

        let existingUser;

        if(typeOfUser === "Applicant"){
            existingUser = await Applicant.findOne({ email: email });
        }
        else if(typeOfUser === "Recruiter"){
            existingUser = await Recruiter.findOne({ email: email });
        }

        if(existingUser)
            return res.status(400).json({msg: "User with this email already exists."});

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        //console.log(passwordHash);

        let newUser;

        if(typeOfUser === "Applicant"){
            newUser = new Applicant({
                displayName,
                email,
                password: passwordHash,
                typeOfUser
            });
            //console.log("Applicant");
        }
        else if(typeOfUser === "Recruiter"){
            newUser = new Recruiter({
                displayName,
                email,
                password: passwordHash,
                typeOfUser
            });
            //console.log("Recruiter");
        }

        const savedUser = await newUser.save();
        res.json(savedUser);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;
        
        //console.log(req.body);

        //validate

        if (!email || !password)
            return res.status(400).json({msg: "Not all fields have been entered"});

        const user1 = await Applicant.findOne({email: email});
        const user2 = await Recruiter.findOne({email: email});

        if(!user1 && !user2)
            return res.status(400).json({msg: "No account with this email has been registered"});
        
        let isMatch;

        if(user1){
            //console.log("user1");
            isMatch = await bcrypt.compare(password, user1.password);
        }
        
        else if(user2){
            //console.log("user2");
            isMatch = await bcrypt.compare(password, user2.password);
        }
        
        if (!isMatch)
            return res.status(400).json({msg: "Incorrect password"});
        
        if(user1){
            const token = jwt.sign({id: user1._id}, process.env.JWT_SECRET);
            
            res.json({
                token,
                user: {
                    id: user1._id,
                    displayName: user1.displayName,
                    email : user1.email,
                    typeOfUser: user1.typeOfUser,
                },
            });
        }
        else if(user2){
            const token = jwt.sign({id: user2._id}, process.env.JWT_SECRET);
            
            res.json({
                token,
                user: {
                    id: user2._id,
                    displayName: user2.displayName, 
                    email : user2.email,
                    typeOfUser: user2.typeOfUser,
                },
            });
        }
    }

    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/tokenIsValid", async(req, res) => {
    try{
        const token = req.header("x-auth-token");
        if(!token)
            return res.json(false);
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified)
            return res.json(false);

        //important

        req.user = verified.id;

        const x = await Applicant.findById(req.user);
        const y = await Recruiter.findById(req.user);

        let user;

        if(x)
            user = await Applicant.findById(req.user);

        else if(y)
            user = await Recruiter.findById(req.user);

        if(!user)
            return res.json(false);

        return res.json(true);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/",auth, async (req,res) => {

    const x = await Applicant.findById(req.user);
    const y = await Recruiter.findById(req.user);

    let user;

    if(x)
        user = await Applicant.findById(req.user);

    else if(y)
        user = await Recruiter.findById(req.user);
    
    res.json(user);
});

router.post("/applicant_register", auth, async(req, res) => {
    try{

        //console.log(req.user);

        const {education, skills, profile_picture} = req.body.data;

        if(education[0].name !== undefined && education[0].start_year === undefined){
            return res.status(400).json({msg: "Start year is not mentioned"});
        }
        if(education[1].name !== undefined && education[1].start_year === undefined){
            return res.status(400).json({msg: "Start year is not mentioned"});
        }
        if(education[2].name !== undefined && education[2].start_year === undefined){
            return res.status(400).json({msg: "Start year is not mentioned"});
        }
        if(education[3].name !== undefined && education[3].start_year === undefined){
            return res.status(400).json({msg: "Start year is not mentioned"});
        }


        if(education[0].name === undefined && education[0].start_year !== undefined){
            return res.status(400).json({msg: "Name of Institution is not mentioned"});
        }
        if(education[1].name === undefined && education[1].start_year !== undefined){
            return res.status(400).json({msg: "Name of Institution is not mentioned"});
        }
        if(education[2].name === undefined && education[2].start_year !== undefined){
            return res.status(400).json({msg: "Name of Institution is not mentioned"});
        }
        if(education[3].name === undefined && education[3].start_year !== undefined){
            return res.status(400).json({msg: "Name of Institution is not mentioned"});
        }

        const x = await Applicant.findById(req.user);

        //console.log(req.body.data.skills);


        let infoUser;

        if(x){
            infoUser = await Applicant.findOneAndUpdate({_id : req.user},{$set: {education: education, skills: skills, profile_picture:profile_picture}},
                function (err, docs) { 
                    if (err){ 
                    console.log(err) 
                }
            });
        }

        //console.log(infoUser);
        res.json(infoUser);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/recruiter_register", auth, async(req, res) => {
    try{

        const {contact_no, bio} = req.body.data;

        if(!contact_no || !bio){
            return res.status(400).json({msg: "Not all fields have been entered"});
        }

        const x = await Recruiter.findById(req.user);

        if(bio){
            if(bio.split(' ').length > 250)
                return res.status(400).json({msg: "You have exceeded maximum limit of words."});
        }

        let infoUser;

        if(x){
            infoUser = await Recruiter.findOneAndUpdate({_id : req.user}, {$set : {bio: bio, contact_no: contact_no}},
                function (err, docs) { 
                    if (err){ 
                    console.log(err) 
                }
            });

            //console.log(infoUser);
            res.json(infoUser);
        }
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/applicant_profile", auth, async(req, res) => {
    try{
        const x = await Applicant.findById(req.user);
        res.json(x);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/recruiter_profile", auth, async(req, res) => {
    try{

        //console.log(req.user);

        const x = await Recruiter.findById(req.user);
        res.json(x);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/new_job", auth, async(req, res) => {
        
    try {
        const { title, max_applications, max_positions, deadline, skill_set, typeOfJob, duration, salary} = req.body.data;

        if ((!title) || (!max_applications) || (!max_positions) || (!deadline) || (!skill_set) || (!typeOfJob) || (!duration) || (!salary))
            return res.status(400).json({msg: "Not all fields have been entered"});

        if ( max_applications <=0  || max_positions <= 0 || salary < 0)
            return res.status(400).json({msg: "Invalid Input"});

        //console.log(req.user);

        const d = new Date(deadline);
        const n = d.getTime(d);

        const d1 = new Date();
        const n1 = d1.getTime();

        if (n1 > n)
            return res.status(400).json({msg: "Invalid deadline"});
        
        if(max_applications < max_positions)
            return res.status(400).json({msg: "Maximum number of applications should be greater than or equal to the Maximum number of positions"});

        const x = await Recruiter.findOne({_id: req.user});

        //console.log(n);

        const newPost = new JobPost({
            recruiter_id: req.user,
            title,
            name: x.displayName,
            email: x.email,
            max_applications, 
            max_positions, 
            skill_set, 
            typeOfJob, 
            duration, 
            salary, 
            deadline,
            deadline_sec: n
        });

        const savedPost = await newPost.save();
        res.json(savedPost);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/edit_job/:id", async(req, res) => {
        
    try {
        //console.log("Entered");
        const { max_applications, max_positions, deadline } = req.body.data;
        
        if ((!max_applications) || (!max_positions) || (!deadline))
            return res.status(400).json({msg: "Not all fields have been entered"});

        if ( max_applications <=0  || max_positions <= 0 )
            return res.status(400).json({msg: "Invalid Input"});

        //console.log(req.user);

        const d = new Date(deadline);
        const n = d.getTime(d);

        const d1 = new Date();
        const n1 = d1.getTime();

        if (n1 > n)
            return res.status(400).json({msg: "Invalid deadline"});
        
        if(max_applications < max_positions)
            return res.status(400).json({msg: "Maximum number of applications should be greater than or equal to the Maximum number of positions"});

        const post = await JobPost.findByIdAndUpdate({_id : req.params.id}, {$set : {max_applications: max_applications, max_positions: max_positions, deadline: deadline, deadline_sec: n}});
        res.json(post);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/display_all_jobs", async(req, res) => {
    const all_posts = await JobPost.find();
    res.json(all_posts);
});

router.get("/recruiter_jobs", auth, async(req, res) => {
    const all_posts = await JobPost.find({recruiter_id: req.user});
    res.json(all_posts);
});

router.post("/delete_job", async(req, res) => {
    const deleted_post = await JobPost.findByIdAndDelete(req.body._id);
    res.json(deleted_post);
});

router.get("/display_job/:id", async(req, res) => {
    try{
        const post = await JobPost.findById({_id : req.params.id});
        if (!post){
            res.status(404).send("data is not found");
        }
        else{
            res.json(post);
        }
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/get_applicant/:id", async(req, res) => {
    try{
        const applicant = await Applicant.findById({_id : req.params.id});
        if (!applicant){
            res.status(404).send("data is not found");
        }
        else
        {   
            res.json(applicant);
        }
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/get_applied_jobs", auth, async(req, res) => {
    const user = await Applicant.findById(req.user);
    res.json(user);
});

router.post("/apply_job/:id", auth, async(req, res) => {
    try{
        const {sop} = req.body.data;
        const post = await JobPost.findOne({_id : req.params.id});
        const user = await Applicant.findOne({_id : req.user});
        const id = req.params.id;
        const date = Date.now();

        //console.log(sop);

        if(sop){
            if(sop.split(' ').length > 250)
                return res.status(400).json({msg: "You have exceeded maximum limit of words."});
        }

        if (!post){
            res.status(404).send("data is not found");
        }
        else{
            post.applicants_list.push({applicant_id: req.user, sop: sop, stage:"Applied", date_of_appication: date});
            post.save();
            user.applied_jobs.push({id:id, status:"Applied"});
            user.save();
            res.json(true);
        }
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.delete("/delete_all", async(req, res) => {
    try{
        await JobPost.deleteMany({});
        await Applicant.deleteMany({});
        await Recruiter.deleteMany({});
        res.json(true);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/shortlist_candidate/:postId", auth, async(req, res) => {
    try{
        const {id} = req.body.data;
        const post = await JobPost.findOneAndUpdate({_id : req.params.postId, "applicants_list.applicant_id": id},{$set: {"applicants_list.$.stage": "Shortlisted"}});
        post.save();
        res.json(true);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/accept_candidate/:postId", auth, async(req, res) => {
    try{
        const {id} = req.body.data;
        const date = Date.now();
        const post = await JobPost.findOneAndUpdate({_id : req.params.postId, "applicants_list.applicant_id": id},{$set: {"applicants_list.$.stage": "Accepted", "applicants_list.$.date_of_acceptance": date}});
        post.save();
        const post1 = await JobPost.findOneAndUpdate({_id : req.params.postId},{$inc: {no_of_accepted_candidates: 1}});
        post1.save();
        const post2 = await JobPost.findOne({_id : req.params.postId});
        if(post2.no_of_accepted_candidates === post2.max_positions){
            var i;
            for(i=0; i<post2.applicants_list.length; i++){
                if(post2.applicants_list[i].stage !== "Accepted"){
                    const temp = await JobPost.findOneAndUpdate({_id : req.params.postId, "applicants_list.applicant_id": post2.applicants_list[i].applicant_id},{$set: {"applicants_list.$.stage": "Rejected"}});
                    temp.save();
                }
            }
        }
        const post3 = await JobPost.find();
        var j, k;
        for(j=0; j<post3.length; j++){
            //console.log("entered_hello");
            for(k=0; k<post3[j].applicants_list.length; k++){
                //console.log("entered++");
                if(post3[j].applicants_list[k].applicant_id === id._id && post3[j].applicants_list[k].stage !== "Accepted"){
                    //console.log("entered");
                    const temp = await JobPost.findOneAndUpdate({_id : post3[j]._id, "applicants_list.applicant_id": id},{$set: {"applicants_list.$.stage": "Rejected"}});
                    temp.save();
                }
            }
        }
        res.json(true);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/reject_candidate/:postId", auth, async(req, res) => {
    try{
        const {id} = req.body.data;
        const post = await JobPost.findOneAndUpdate({_id : req.params.postId, "applicants_list.applicant_id": id},{$set: {"applicants_list.$.stage": "Rejected"}});
        post.save();
        res.json(true);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/my_applications", auth, async(req, res) => {
    try{
        const posts = await JobPost.find({"applicants_list.applicant_id": req.user});
        res.json(posts);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/get_applicant_with_token", auth, async(req, res) => {
    try{
        //console.log(req.user);
        const applicant = await Applicant.findById({_id: req.user});
        if (!applicant){
            res.status(404).send("data is not found");
        }
        else
        {   
            res.json(applicant);
        }
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/rate_candidate/:id", auth, async(req, res) => {
    try{
        const rating = req.body.data;
        //console.log(rating);
        const post = await Applicant.findOneAndUpdate({_id : req.params.id},{$inc: {rating_num: rating, rating_den: 1}});
        post.save();
        const post1 = await Applicant.findOneAndUpdate({_id : req.params.id});
        const x = post1.rating_num;
        const y = post1.rating_den;
        const r = x*1.0/y;
        //console.log(r);
        const post2 = await Applicant.findOneAndUpdate({_id : req.params.id},{$set: {rating: r}});
        post2.save();
        res.json(true);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.post("/rate_job/:id", auth, async(req, res) => {
    try{
        const rating = req.body.data;
        //console.log(rating);
        const post = await JobPost.findOneAndUpdate({_id : req.params.id},{$inc: {rating_num: rating, rating_den: 1}});
        post.save();
        const post1 = await JobPost.findOne({_id : req.params.id});
        const y = post1.rating_den;
        const x = post1.rating_num;
        const r = x*1.0/y;
        //console.log(r);
        const post2 = await JobPost.findOneAndUpdate({_id : req.params.id},{$set: {rating: r}});
        post2.save();
        res.json(true);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
 