const jwt = require("jsonwebtoken")
const userModel = require('../models/userModel')
//=========================== Authentication ==========================================

const Authentication = function (req, res, next) {
    try {
        let token = req.headers["authorization"]
        console.log(token)      // "Bearer kdhgjkdhgfhgjdghfjhgksdhgkfjhgjksfhgjkfhgjdfghdfhgh"
        token = token.split(" ")[1]
        console.log(token)
        if (!token) { return res.status(400).send({ status: false, message: "token must be present" }) }
        let decode = jwt.verify(token, "group27")   ////_id894789577658945898978
        if (!decode) { return res.status(401).send({ status: false, message: "user not authenticated" }) }
        req.decoded = decode

        next()
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
//=============================Authosisation==============================================
const Authorisation = async function (req, res, next) {
    try {
        let userId = req.params.userId   //params
        let decoded = req.decoded
        let userLoggedIn = decoded.userId
        let userDetails = await userModel.findOne({ _id: userId })
        if (userDetails.userId != userLoggedIn) {
            return res.status(403).send({ status: false, msg: 'user logged is not allowed to modify the requested books data' })
        }
        next()
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}





module.exports = { Authentication, Authorisation }