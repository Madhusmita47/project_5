const express = require('express')
const router = express.Router()
const {createUser, userLogin, getUserById, updateUserProfile}= require("../controller/UserController")
const{createProduct,getProductsById,getProductsByFilter}=require("../controller/productController")
const {Authentication,Authorisation}=require("../middleware/auth")

router.get('/test', async function(req,res){
    res.send("Test success")
})

//--------------userapi-------------------------------------
 router.post("/register",createUser )
 router.post("/login",userLogin )
 router.get("/user/:userId/profile",Authentication,getUserById)
 router.put("/user/:userId/profile",Authentication,Authorisation,updateUserProfile)
//----------------productapi---------------------------------
router.post("/products",createProduct)
router.get("/products/:productId",getProductsById)
router.get("/products", getProductsByFilter)
//------------------cartapi-------------------------------------
//------------------orderapi------------------------------------



module.exports = router