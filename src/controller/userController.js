const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")
const mongoose= require("mongoose")

const bcrypt = require("bcrypt");
const urlValid = require("is-valid-http-url");
const {uploadFile}= require("./aws")
const {
  valid,
  isValidEmail,
  isValidName,
  isValidPhone,
  isValidPassword,
  isvalidPincode,
  isValidStreet
} = require("../validator/validation");

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let files = req.files;
    //console.log(files)

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: "false", message: "All fields are mandatory" });
    }

    let { fname, lname, email, phone, password, address, profileImage } = data;
    if (!valid(fname)) {
      return res.status(400).send({status: "false", message: "fname must be present"});
    }
    if (!isValidName(fname)) {
      return res.status(400).send({status: "false", message: " first name must be in alphabetical order"});
    }
    if (!valid(lname)) {
      return res.status(400).send({status: "false", message: "lname must be present"});
    }
    if (!isValidName(lname)) {
      return res.status(400).send({status: "false", message: "last name must be in alphabetical order"});
    }
    if (!valid(email)) {
      return res.status(400).send({status: "false", message: "email must be present"});
    }
    if (!isValidEmail(email)) {
      return res.status(400).send({status: "false", message: "email must be present"});
    }

    if (!valid(phone)) {
      return res.status(400).send({status: "false", message: "phone number must be present"});
    }
    if (!isValidPhone(phone)) {
      return res.status(400).send({ status: "false", message: "Provide a valid phone number" });
    }
    if (!valid(password)) {
      return res.status(400).send({status: "false", message: "password must be present"});
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({status: "false", message: "password must be present"});
    }
    if( password.length < 8 || password.length > 15){
      return res.status(400).send({ status: false, message: "Length of password is not correct" })
    }
    if (!valid(address)) {
      return res.status(400).send({status: "false", message: "Address must be present"});
    }
  
    
    
    

    
    

    // ------- Address Validation  --------
    if (address) {
      data.address = JSON.parse(data.address);
      if(address.shipping) {
        if (!valid(address.shipping.street)) {
          return res.status(400).send({status: "false", message: "street must be present"});
        }
        if (!valid(address.shipping.city)) {
          return res.status(400).send({ status: "false", message: "city must be present" });
        }
        if (!valid(address.shipping.pincode)) {
          return res.status(400).send({ status: "false", message: "pincode must be present" });
        }
        if (!isValidStreet(address.shipping.street)) {
          return res.status(400).send({status: "false",message: "street should include no. & alphabets only"});
        }
        if (!isValidName(address.shipping.city)) {
          return res.status(400).send({status: "false",message: "city should include alphabets only"});
        }
        if (!isvalidPincode(address.shipping.pincode)) {
          return res.status(400).send({status: "false",message: "pincode should be digits only"});
        }
      }
      if (address.billing) {
        if (!valid(address.billing.street)) {
          return res.status(400).send({status: "false", message: "street must be present"});
        }
        if (!valid(address.billing.city)) {
          return res.status(400).send({status: "false", message: "city must be present"});
        }
        if (!valid(address.billing.pincode)) {
          return res.status(400).send({status: "false", message: "pincode must be present"});
        }
        if (!isValidStreet(address.billing.street)) {
          return res.status(400).send({status: "false",message: "street should include no. and alphabets only"});
        }
        if (!isValidName(address.billing.city)) {
          return res.status(400).send({status: "false",message: "city should be in alphabetical order"});
        }
        if (!isvalidPincode(address.billing.pincode)) {
          return res.status(400).send({status: "false",message: "pincode should be digits only"});
        }
      }
    }
    const saltRounds = 18
    const hash = await bcrypt.hash(password, saltRounds);
    data.password = hash;

    let emailExists = await userModel.findOne({ email});
    if (emailExists) {
      return res.status(400).send({status: "false", message: "Email is already in use"});
    }
    let phoneExists = await userModel.findOne({phone });
    if (phoneExists) {
      return res.status(400).send({status: "false", message: "Phone number is already in use"});
    }
    if(files && files.length>0){
      let uploadedFileURL = await uploadFile(files[0]);
      data.profileImage= uploadedFileURL
    }else{
      res.status(400).send({ msg: "ProfileImage is Mandatory" });
    }



  
    let savedUser = await userModel.create(data);
    return res.status(201).send({
      status: true,data: savedUser});
    } catch (error) {
    return res.status(500).send({ status: "false", msg: error.message });
  }
};


const userLogin = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter data" });

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Please enter email" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Please enter password" });

    const Login = await userModel.findOne({ email });
    if (!Login){
      return res
        .status(404)
        .send({ status: false, message: "Email Id does Not exist" });

    }
    let hash = Login.password
    bcrypt.compare(password, hash, function(err, result) {
      if (result) {
        let token = jwt.sign({userId:Login._id}, "passord", {expiresIn:"1hr"})
        res.setHeader("x-api-key", token)
        return res.status(200).send({status:true,message:"Login Successfull", data:{userId:Login._id, token:token}})
      }
      else {
        return res.status(400).send({status:true, message:"Invalid Password"})
        
      }
    });

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getUserById = async function (req, res) {
  try{
  let userId = req.params.userId;

if (!userId) {
  return res.status(400).send({ status: false, message:"Please provide userid" })
    }
if (mongoose.Types.ObjectId.isValid(userId)==false) {
return res.status(400).send({ status: false, message: "Invalid userId" });
}
  let userDetails = await userModel.findOne({_id:userId}).lean();
     if (!userDetails){
     return res.status(404).send({ status: false, msg: "No such user exists" });
     }
    
   res.status(200).send({ status: true,message:"User profile details", data:userDetails });
  }
  catch(err){
    return res.status(500).send({status:false,message:err.message})
    }
  };

module.exports = { userLogin, createUser ,getUserById};
