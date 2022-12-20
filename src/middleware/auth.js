const jwt = require("jsonwebtoken")
const userModel = require('../models/userModel')
//=========================== Authentication ==========================================

const Authentication=function (req,res,next){
    try {
    let token=req.headers["x-api-key"]
    if(!token) {return res.status(400).send({status:false,message:"token must be present"})}
     let decode =jwt.verify(token,"group 27")   ////_id894789577658945898978
 if(!decode) { return res.status(401).send({status:false,message:"user not authenticated"})}
 next()
    }
    catch (error) {
        res.status(500).send({status: false, msg: error.message })
    }
 }
const Authorisation = async function(req,res,next){
    try{
        let userId = req.params. userId   //params


        let token = req.headers["x-api-key"] 
        let decoded = jwt.verify(token, 'group 27')     // {userId:"7979879789"}
    
        if (!decoded) {
            return res.status(400).send({ status: false, msg: "token is not valid" })
        }
        
        let userLoggedIn = decoded.userId
        
        let userDetails =  await userModel.findOne({_id:userId})
        
        
        if (userDetails.userId!= userLoggedIn)
            return res.status(401).send({ status: false, msg: 'user logged is not allowed to modify the requested books data' })
            else {
                next()
            }
    }
    catch (error) {
        res.status(500).send({status: false, msg: error.message })
    }
}
 module.exports = {Authentication,Authorisation}