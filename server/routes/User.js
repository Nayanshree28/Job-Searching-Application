const express = require("express")
const router = express.Router();
const User = require("../schema/user.schema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")


router.post("/register", async(req, res)=>{
    const {name, email, password, mobile} = req.body;
    const isUSerExist = await User.findOne({email});
    if(isUSerExist){
        return res.status(400).json({message: "User already exist"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);
    try{
        const user = await User.create({
            name, 
            email,
            password: hashedPassword,
            mobile,
        });
        res.status(200).json({message: "user created"});
    } catch(err){
        console.log(err)
        res.status(500).json({message: "Error in creating user"});
    }
})
router.post("/login", async(req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "Wrong credentials"})
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Wrong credentials"})
    }
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({token})
})


module.exports = router