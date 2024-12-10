const express = require("express")
const router = express.Router();
const Job = require("../schema/job.schema")
const dotenv = require("dotenv")
const authmiddleware = require("../middleware/auth")
dotenv.config()

router.get("/", async (req, res)=>{
    const {limit, offset, salary} = req.query;
    const jobs = await Job.find({salary}).skip(offset).limit(limit);
    res.status(200).json(jobs)
})

router.get("/:id", async (req, res)=>{
    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job){
        return res.status(404).json({message: "job not found"})
    }
    res.status(200).json(job);
})

router.delete("/:id", authmiddleware, async (req, res)=>{
    const { id } = req.params;
    const job = await Job.findById(id);
    const userId = req.user.id;

    if(!job){
        return res.status(404).json({message: "job not found"});
    }
    if(userId !== job.user.toString()){
        return res.status(401).json({message: "You are not authorize to delete this"});
    }
    await Job.deleteOne({_id: id})
    res.status(200).json({message: "Job deleted"})
})

router.post("/", authmiddleware, async (req, res)=>{
    const {Companyname, jobPosition, salary, jobType} = req.body;
    if(!Companyname || !jobPosition || !salary || !jobType){
        return res.status(400).json({message: "Missing required fields"});
    }
    try{
        const user = req.user;
        const job = await Job.create({
            Companyname,
            jobPosition,
            salary,
            jobType,
            user: user.id,
        });
        res.status(200).json(job)
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Error in creating job"});
    }
    
})

router.put("/:id", authmiddleware, async(req, res)=>{
    const {id} = req.params;
    const {Companyname, jobPosition, salary, jobType} = req.body;
    const job = await Job.findById(id);
    if(!job){
        return res.status(404).json({message: "job not found"});
    }
    if(job.user.toString() !== req.user.id){
        return res.status(401).json({message: "You are not authorize to update this"})
    }
    try{
        await Job.findByIdAndUpdate(id, {
            Companyname,
            jobPosition,
            salary,
            jobType,
        });
        res.status(200).json({message: "Job updated"})
    } 
    catch (err){
        console.log(err)
        return res.status(500).json({message: "Error in updating job"});
    }
})

module.exports = router