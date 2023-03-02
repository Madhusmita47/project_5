const aws= require("aws-sdk")



aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    let s3= new aws.S3({apiVersion: '2006-03-01'}); 

    var uploadParams= {
        ACL: "public-read",//acess control list.
        Bucket: "classroom-training-bucket",  //bucket or object
        Key: "abc/" + file.originalname, //file name 
        Body: file.buffer//body content
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }

        return resolve(data.Location)
    })

   })
}

module.exports.uploadFile=uploadFile