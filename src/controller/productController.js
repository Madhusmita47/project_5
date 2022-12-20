const userModel = require("../models/userModel");
const productModel=require("../models/productModel")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const urlValid = require("is-valid-http-url");
const { uploadFile } = require("./aws");
const { valid, isValidName } = require("../validator/validation");


const createProduct = async function (req, res) {
    try {
        let files=req.files
        let data= req.body
        let { title, description, price, currencyId, currencyFormat, productImage,availableSizes} =data

        if(Object.keys(data).length==0){
            return res.status(400).send({status:false,message:"body is blank"})
        }

        if (!valid(title)) {
            return res.status(400).send({ status: "false", message: "title must be present" });
          }

        if (!isValidName(title)) {
            return res.status(400).send({ status: "false", message: " title name must be in alphabetical order" });
          }
       
        let checktitle = await productModel.findOne({title:title})
         
        if(checktitle){
          return res.status(400).send({ status: false, message:"Please provide unqiue title" })
        }
        
        if (!valid(description)) {
            return res.status(400).send({ status: "false", message: "description must be present" });
        }
        if (!isValidName(description)) {
            return res.status(400).send({ status: "false", message: " description must be in string" });
        }
  
        if (!price) {
            return res.status(400).send({ status: false, message:"please provide price of product"})
        }

        if (!valid(currencyId)) {
            return res.status(400).send({ status: "false", message: "currencyId must be present" });
        }

        if (!isValidName(currencyId)) {
            return res.status(400).send({ status: "false", message: " currencyId must be in string" });
        }

        if (!valid(currencyFormat)) {
            return res.status(400).send({ status: "false", message: "currencyFormat must be present" });
        }

        if (currencyFormat != "₹") {
            return res.status(400).send({ status: "false", message: "currencyFormat must be in string ₹" });
        }
        
        
        if (!valid(availableSizes) || availableSizes != 'S' && availableSizes != 'XS' && availableSizes != 'M' && availableSizes != 'X' && availableSizes != 'L' && availableSizes != 'XXL' && availableSizes != 'XL') {
            return res.status(400).send({ status: false, msg: "Please select from the available sizes- S, XS, M, X, L, XXL, XL " })
        }

        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0]);
            data.productImage = uploadedFileURL
          }else {
      res.status(400).send({ msg: "ProductImage is Mandatory" });
    }
    
       let createProd = await productModel.create(data);
       return res.status(201).send({status:true,data:createProd});
        
    }
    catch (error) {
        console.log("This is the error :", error.message)
        res.status(500).send({ status: false, data: error.message })
    }
}
const getProductsById = async function (req, res) {
    try{
    let ProductId = req.params.productId;
  
  if (!ProductId) {
    return res.status(400).send({ status: false, message:"Please provide Productid" })
      }
  if (mongoose.Types.ObjectId.isValid(ProductId)==false) {
  return res.status(400).send({ status: false, message: "Invalid ProductId" });
  }
    let ProductDetails = await productModel.findOne({_id:ProductId}).lean();
       if (!ProductDetails){
       return res.status(404).send({ status: false, msg: "No such Product exists" });
       }
      
     res.status(200).send({ status: true,message:"Product details", data:ProductDetails });
    }
    catch(err){
      return res.status(500).send({status:false,message:err.message})
      }
    };



const getProductsByFilter=async function(req,res){
       try{
        const {size,name,priceGreaterThan,priceLessThan,priceSort }=req.query
        let data = {isDeleted:false}
        if(size){
            data['availableSizes']= {$in: size}
        } 
        if(name){
            
            data['title']= name
        }
        if(priceGreaterThan){
            data['price']= {$gt:priceGreaterThan}
        }
        if(priceLessThan){
            data['price']= {$lt:priceLessThan}
        }
        if(priceSort){
            if(!(priceSort==1 || priceSort==-1)){
                return res.status(400).send({status:false,message:"price sort can have only two values 1 or -1"})
            }
        }
        let filteredData=await productModel.find(data).sort({price:priceSort})

        
        if(filteredData.length==0){return res.status(404).send({status:false,message:"data is not present"})}
        res.send(filteredData)
}
       catch(err){
          res.status(500).send({status:false,msg:err.message})
       }
    }
    module.exports={createProduct,getProductsById,getProductsByFilter}

    
    

