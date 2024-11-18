const jwt = require("jsonwebtoken")
const {Jwt_secret}=require("../key")
const mongoose = require("mongoose")
const User= mongoose.model("User")
module.exports = (req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization){
        return res.status(401).json({error:"You Must have login 1"})
    }
    const token= authorization.replace("Bearer ","")
    jwt.verify(token,Jwt_secret,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You Must have login 2"})
        }
        const {_id}=payload
        User.findById(_id).then(userData=>{req.user=userData;
            next()
        })
    })
}