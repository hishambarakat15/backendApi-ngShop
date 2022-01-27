const express = require('express');
const { Promise } = require('mongoose');
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order_item');
const router = express.Router();

router.get('/', async(req,res)=>{
    const orderList = await Order.find().populate('user','name').sort({'dateOrdered':-1});

    if(!orderList){
        res.status(5000).json({success:false})
    }
    res.send(orderList);
})


router.get('/:id', async(req,res)=>{
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({ path:'orderItems',populate:{path:'product',populate:{path:'category'}}});

    if(!order){
        res.status(5000).json({success:false})
    }
    res.send(order);
})

router.post('/', async(req,res)=>{
    const orderItemsIds =Promise.all(  req.body.orderItems.map(async orderItem=>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        }) 
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id
    })
    )
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices =await  Promise.all(orderItemsIdsResolved.map( async orderItemId =>{
        const orderItem = await OrderItem.findById(orderItemId).product('product','price')
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }))

    const totalPrice = totalPrices.reduce((a,b)=> a + b , 0 );
    let order = new Order({
        orderItems:orderItemsIdsResolved,
        shippingAdrsress1: req.body.shippingAdrsress1,
        shippingAdrsress2:req.body.shippingAdrsress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:totalPrice,
        user:req.body.user,
        dateOrdered:req.body.dateOrdered,

    })

    order = await order.save();
    
    if(!order) return res.status(404).send('The Order Cannot be Created !! ')
    res.send(order);

})


router.put('/:id', async(req,res)=>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status,
        },
        {
            new : true

        }
    )
    if(!order){
        res.status(500).json({success:false})
    }
    res.send(order);
})


router.delete('/:id',(req,res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order=>{
        if(order){
            await order.orderItems.map(async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem);
            });
            return res.status(200).json({success:true,msg:'Order Was Deleted !'})
        }else{
            return res.status(404).json({success:false, msg:'Order Not Found'})
        }
    }).catch(err=>{
        return res.status(400).json({err:err})
    })
});

 router.get('/get/count',async(req,res)=>{
    const OrderCount = await Order.countDocuments();
    res.send({
        orderCount: OrderCount
    });
    })
    

router.get('/get/totalsales', async (req,res)=>{
    const totalSales = await Order.aggregate([
        { $group:{ _id: null, totalsales:{ $sum:'$totalPrice'}}}
    ])
    if(!totalSales){
        return res.status(400).send('the order sales cannot  be generated ')
    }
    res.send({totalSales: totalSales})
})

module.exports = router;