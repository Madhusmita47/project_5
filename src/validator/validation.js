
const valid=function(value){
    if(typeof value=="number" || typeof value==null || typeof value==undefined)
    return false
    if(typeof value=="string" && value.trim().length==0)
    return false
    return true
}
const regForUrl=function(value){
    let re=/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
    return re.test(value)

}
//=========================// isValidEmail //===================================

const isValidEmail = function (value) {
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  return emailRegex.test(value)
};

//============================// idCharacterValid //============================

// const isIdValid = function (value) {
//   return mongoose.Types.ObjectId.isValid(value); 
// };


//==============================// isValidName //===============================

const isValidName = function (name) {
  let re = /^[a-z A-Z ]+$/
  return re.test(name)
  
};

//==============================// isValidMobile //===============================

const isValidPhone = function (phone) {
  let re = /^[0]?[6789]\d{9}$/
  return re.test(phone)
 
}
//==============================// isValidPassword //==============================

const isValidPassword = function(password){
  let re= /^(?=.*[0-9])(?=.*[!.@#$%^&*])[a-zA-Z0-9!.@#$%^&*]{8,15}$/
  return re.test(password)
}


//==============================// isValid-date //==============================

// const isValidDate = function (date) {
//   if (typeof date != "string") return false
//   return moment(date, 'YYYY-MM-DD', true).isValid()
// }
//==============================// isValid-pincode //==============================

const isvalidPincode = function (pincode) {
  let re= /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/
  return re.test(pincode)
  
}
const isValidStreet = function (street) {
  let streets = /^[#.0-9a-zA-Z\s,-]+$/;
  return streets.test(street);
};
//=============================// module exports //==============================

module.exports = { isValidStreet,valid,regForUrl,isValidEmail, isValidName, isValidPhone, isValidPassword, isvalidPincode }


