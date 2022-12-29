const express = require('express')
const router = express.Router()
const {createUser, userLogin, getUserById, updateUserProfile}= require("../controller/UserController")
const{createProduct,getProductsById,getProductsByFilter,updateProduct,deleteProduct}=require("../controller/productController")
const {createCart,updateCart,getCartById,deleteCart}=require("../controller/cartController")
const{createOrder,cancelOrder}=require("../controller/orderController")
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
 router.put("/products/:productId",updateProduct)
router.delete("/products/:productId",deleteProduct)
//------------------cartapi-------------------------------------
router.post("/users/:userId/cart",createCart)
router.get("/users/:userId/cart",getCartById)
router.put("/users/:userId/cart",updateCart)
router.delete("/users/:userId/cart",deleteCart)
//------------------orderapi------------------------------------
router.post("/users/:userId/orders",createOrder)
router.put("/users/:userId/orders",cancelOrder)


module.exports = router