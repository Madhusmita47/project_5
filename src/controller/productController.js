// const userModel = require("../models/userModel");
// const productModel=require("../models/productModel")
// const jwt = require("jsonwebtoken")
// const mongoose = require("mongoose")
// const bcrypt = require("bcrypt");
// const urlValid = require("is-valid-http-url");
// const { uploadFile } = require("./aws")


// const createProduct=async function(req,res){
//     try{
//         let data=req.body
//         let createdata=await productModel.create(data)
//         res.send(createdata)
//     }catch(err){
//         res.status(500).send({status:false,msg:err.message})
//     }
// }
// const getProductsById = async function (req, res) {
//     try{
//     let ProductId = req.params.ProductId;
  
//   if (!ProductId) {
//     return res.status(400).send({ status: false, message:"Please provide Productid" })
//       }
//   if (mongoose.Types.ObjectId.isValid(ProductId)==false) {
//   return res.status(400).send({ status: false, message: "Invalid ProductId" });
//   }
//     let ProductDetails = await ProductModel.findOne({_id:ProductId}).lean();
//        if (!ProductDetails){
//        return res.status(404).send({ status: false, msg: "No such Product exists" });
//        }
      
//      res.status(200).send({ status: true,message:"Product details", data:ProductDetails });
//     }
//     catch(err){
//       return res.status(500).send({status:false,message:err.message})
//       }
//     };



// const getProductsByFilter=async function(req,res){
//        try{
//         const {size,name,priceGreaterThan,priceLessThan}=req.query
//         let data = {isDeleted:false}



//         // console.log(size, name)
//         // if(size|| name || priceGreaterThan || priceLessThan){
//         //     var data=await productModel.find({isDeleted:false, availableSizes:size, title:name, price:{$gt:priceGreaterThan} , price:{$lt:priceLessThan}})

//         }else{
//             var data=await productModel.find({isDeleted:false})
//         }

        
//         if(data.length==0){return res.status(404).send({status:false,message:"data is not present"})}
//         res.send(data)



//     }
//        catch(err){
//           res.status(500).send({status:false,msg:err.message})
//        }
//     }

    
    
// module.exports={createProduct,getProductsByFilter}

