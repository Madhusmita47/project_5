const express = require('express')
const {createUser, userLogin, getUserById}= require("../controller/UserController")
const router = express.Router()

router.get('/test', async function(req,res){
    res.send("Test success")
})


router.post("/register",createUser )
router.post("/login",userLogin )
router.get("/user/:userId/profile",getUserById)


module.exports = router