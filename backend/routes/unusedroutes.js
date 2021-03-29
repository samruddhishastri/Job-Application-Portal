router.delete("/delete", auth, async(req, res) => {
    try{
        
        //console.log(req.user);
        
        const x = await Applicant.findById(req.user);
        const y = await Recruiter.findById(req.user);

        let deletedUser;

        if(x)
            deletedUser = await Applicant.findByIdAndDelete(req.user);

        else if(y)
            deletedUser = await Recruiter.findByIdAndDelete(req.user);

        //console.log(deletedUser);
        res.json(deletedUser);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.delete("/delete_job/:postId", auth, async(req, res) => {
    try{
        const post = await JobPost.findOne({_id : req.params.postId});
        //console.log(post);
        const str = req.user.toString();
        if (!post){
            res.status(404).send("data is not found");
        }
        else
        {   
            if(post.recruiter_id === str){
                const x = await JobPost.findByIdAndDelete(req.params.postId);
                res.json(x);
            }
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

router.post("/apply_job/:postId", auth, async(req, res) => {
    try{
        const post = await JobPost.findOne({_id : req.params.postId});
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


router.post("/search", auth, async(req, res) => {
    try {
        let { typeOfJob, salary_min, salary_max, duration} = req.body;

        const filtered_posts = await jobPost.find({typeOfJob: typeOfJob, duration: {$lt: duration}, salary: {$gte: salary_min}, salary: {$lte: salary_max}});
        res.json(filtered_posts);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/display_job/:postId", auth, async(req, res) => {
    try{
        const post = await JobPost.findOne({_id : req.params.postId});
        //console.log(post);
        
        if (!post){
            res.status(404).send("data is not found");
        }
        else
        {   
            res.json(post);
        }
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

