const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/routes');
const mongoose = require('mongoose');
const app = express();
const multer=require("multer")


mongoose.set('strictQuery', true)


app.use(multer().any())
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://madhusmita_123:5fiVrKsOKBIGJsKe@cluster0.cpbhduk.mongodb.net/Project-5", {
    useNewUrlParser: true 
})
.then( () => console.log("MongoDb connect ho chuka"))
.catch ( err => console.log(err) )



app.use('/', route);
app.use("/*",function(req,res){

    res.status(400).send({status:false ,message:"Wrong path! "})
}
)


app.listen( 3000, function () {

    console.log('Apna server ' + 3000 + ' pe chal rha hai or')

});
