const mongoose = require("mongoose")
const ObjectId=mongoose.Schema.Types.ObjectId

const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "'user",
        required: true,
        unique: true
    },
    items: [{
        productId: {
            type: ObjectId,
            ref: "product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        
        _id:false

    }],
    totalPrice: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    }

}, { timestamps: true })
module.exports = mongoose.model("cart", cartSchema)

// [{"productId":"63a35f6b9b5578e7805fcb01","quantity":1} ,{"productId":"63a362afe93619f69f772a1f","quantity":2}]