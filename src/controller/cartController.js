const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const cartModel = require("../models/cartModel")
const { isIdValid } = require("../validator/validation.js")


const createCart = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, message: "Body cannot be empty" });

        let userId = req.params.userId;
        if (!isIdValid(userId))
            return res.status(400).send({ status: false, message: "Invalid userId Id" });
        let checkUser = await userModel.findOne({ _id: userId });
        if (!checkUser)
            return res.status(404).send({ status: false, message: "User does not exists" });

        let { productId, cartId } = data;
        if (!(productId))
            return res.status(400).send({ status: false, message: "productId required" });
        if (!isIdValid(productId))
            return res.status(400).send({ status: false, message: "Invalid productId" });
        let checkProduct = await productModel.findOne({ _id: productId, isDeleted: false });
        if (!checkProduct)
            return res.status(404).send({ status: false, message: "No products found or product has been deleted" });

        let quantity = 1


        if (cartId) {                                       // checking cartId
            if (!isIdValid(cartId))
                return res.status(400).send({ status: false, message: "Invalid cartId" });
            var findCart = await cartModel.findOne({ _id: cartId });
            if (!findCart)
                return res.status(404).send({ status: false, message: "Cart does not exists" });
        }

        let checkCart = await cartModel.findOne({ userId: userId });
        console.log(checkCart && findCart)
          if (!checkCart && findCart) {
            return res.status(403).send({status: false, message: "Cart does not belong to this user"});
          }
          console.log(checkCart)
        if (checkCart) {
            if (cartId) {
                if (checkCart._id.toString() != cartId)
                    return res.status(403).send({ status: false, message: "Cart does not belong to this user" });
            }
            let ProdIdInCart = checkCart.items;
            let uptotal = checkCart.totalPrice + checkProduct.price * Number(quantity);
            let productId = checkProduct._id.toString();
            for (let i = 0; i < ProdIdInCart.length; i++) {
                let productfromitem = ProdIdInCart[i].productId.toString(); // socks  

                //updates previous product i.e QUANTITY
                if (productId == productfromitem) {
                    let previousQuantity = ProdIdInCart[i].quantity;
                    let updatedQuantity = previousQuantity + quantity;
                    ProdIdInCart[i].quantity = updatedQuantity;
                    checkCart.totalPrice = uptotal;
                    await checkCart.save();
                    return res.status(200).send({ status: true, message: "Success", data: checkCart });
                }
            }
            //adds new product
            checkCart.items.push({ productId: productId, quantity: Number(quantity) });
            let total = checkCart.totalPrice + checkProduct.price * Number(quantity);
            checkCart.totalPrice = total;
            let count = checkCart.totalItems;
            checkCart.totalItems = count + 1;
            await checkCart.save();
            return res.status(200).send({ status: true, message: "Success", data: checkCart });
        }
  // if checkcart is empty it will directly come down here!
        let calprice = checkProduct.price * Number(quantity);           // 1st time cart
        let obj = {
            userId: userId,
            items: [{ productId: productId, quantity: quantity }],
            totalPrice: calprice,
        };
        obj["totalItems"] = obj.items.length;
        let result = await cartModel.create(obj);
        return res.status(201).send({ status: true, message: "Success", data: result });
    } catch (err) {
        return res.status(500).send({ status: false, err: err.message });
    }
};

//=======================updatecart===========================================
const updateCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let { cartId, productId, removeProduct } = req.body
        //================checkpresence====================
        if (!userId) { return res.status(400).send({ status: false, message: "userId is mandatory" }) }
        if (!cartId) { return res.status(400).send({ status: false, message: "enter cartId to access the cart" }) }
        if (!productId) { return res.status(400).send({ status: false, message: "enter productId to access the product" }) }
        if (!removeProduct) { return res.status(400).send({ status: false, message: "userId is mandatory" }) }
        //=================checkidValid=======================
        if (!isIdValid(userId)) { return res.status(400).send({ status: false, message: "userId is inValid" }) }
        if (!isIdValid(cartId)) { return res.status(400).send({ status: false, message: "cartId is inValid" }) } if (!isIdValid(productId)) { return res.status(400).send({ status: false, message: "productId is inValid" }) }
        if (typeof parseInt(removeProduct) != "number") {
            return res.status(400).send({ status: false, message: "remove product should be a number" })
        }
        if (removeProduct != 0 && removeProduct != 1) {
            return res.status(400).send({ status: false, message: "remove product should be a number" })
        }
        //===============================dbcall=======================================
        let userExist = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!userExist) { return res.status(400).send({ status: false, message: "user Doesn't exist" }) }
        let cartExist = await cartModel.findOne({ _id: cartId, isDeleted: false })
        if (!cartExist) { return res.status(404).send({ status: false, message: "cart Doesn't exist" }) }
        if (cartExist.userId != userId) { return res.status(400).send({ status: false, message: "you dont have access to this cart" }) }
        let productExist = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productExist) { { return res.status(400).send({ status: false, message: "This product doesnot exist" }) } }
        let productPrice = parseInt(productExist.price)
        console.log(typeof productPrice)
        let items = cartExist.items
        let index = -1
        for (let i = 0; i < items.length; i++) {
            if (items[i].productId == productId) {
                index = i
            }
        }
        if (index == -1) {
            return res.status(400).send({ status: false, message: "product not found inside cart" })
        }

        if (removeProduct == 1) {
            items[index].quantity--
            cartExist.totalPrice -= productPrice

        } else {
            let price = items[index].quantity * productPrice   
            cartExist.totalPrice -= price
            items[index].quantity = 0

        }
        if (items[index].quantity == 0) {
            items.splice(index, 1)
        }
        cartExist.totalItems = items.length
        await cartExist.save()
        let updatedProd = await cartModel.findOne({ userId: userId })
        return res.status(200).send({ status: false, message: updatedProd })

    } catch (er) {
        res.status(500).send({ status: false, message: err.message })
    }
}
//===========================getCartById============================================
const getCartById = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!userId) { return res.status(400).send({ status: false, message: "userId is mandatory" }) }
        if (!isIdValid(userId)) { return res.status(400).send({ status: false, message: "userId is invalid" }) }
        let userExist = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!userExist) { return res.status(400).send({ status: false, message: "user doesnot exist or deleted" }) }
        let cartExist = await cartModel.findOne({ userId: userId })
        if (!cartExist) { return res.status(400).send({ status: false, message: "cart doesnot exist" }) }
        let arr = []
        let items = cartExist['items']

        for (let i = 0; i < items.length; i++) {
            let pId = items[i]['productId']

            //console.log(pId)
            arr[i] = await productModel.findOne({ _id: pId, isDeleted: false })

        }
        res.status(200).send({ status: true, data: arr })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}
//====================deletecart==============================
const deleteCart = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!userId) { return res.status(400).send({ status: false, message: "userId is mandatory" }) }
        if (!isIdValid(userId)) { return res.status(400).send({ status: false, message: "userId is invalid" }) }
        let userExist=await userModel.findOne({_id:userId,isDeleted:false})
        if(!userExist){return res.status(404).send({ status: false, message: "No user found with this Id" })}
        let cartExist = await cartModel.findOne({ userId: userId })
        if (!cartExist) { return res.status(404).send({ status: false, message: "cart is already deleted" }) }
        let cartDelete = await cartModel.findOneAndUpdate({ userId: userId ,_id:cartExist._id}, { $set: { items: [], totalItems: 0, totalPrice: 0 } },{new:true})
        if (!cartDelete) { return res.status(400).send({ status: false, message: "cart doesnot exist" }) }
        res.status(200).send({ status: true, message: " cart successfully deleted " })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createCart, updateCart, getCartById, deleteCart }
























// On error - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
