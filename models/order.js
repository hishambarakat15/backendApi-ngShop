const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAdrsress1:{
        type: String,
    },
    shippingAdrsress2:{
        type: String,
    },
    city:{
        type: String,
    },
    zip:{
        type: String,
    },
    country:{
        type: String,
    },
    phone:{
        type: String,
    },
    status:{
        type: String,
        default: "Pending"
    },
    totalPrice:{
        type: Number,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dateOrdered:{
        type: Date,
        default: Date.now
    },
})

exports.Order = mongoose.model('Order',orderSchema);
