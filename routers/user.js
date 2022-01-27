const express = require('express');
const { User } = require('../models/users');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get('/',async(req,res)=>{
    const userList = await User.find().select('-passwordHash');
    if(!userList){
        res.status(500).json({success:false})
    }

    res.send(userList)
})

router.get('/:id',async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(501).send("This User Not Found");
    }

    res.send(user);

})

router.put('/:id',async(req,res)=>{

    const userExist = await User.findById(req.params.id);
    let newPassword;
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password,10)
    }else{
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(req.params.id,
        {
            name:req.body.name,
            email:req.body.email,
            passwordHash:newPassword,
            phone:req.body.phone,
            isAdmin:req.body.isAdmin,
            street:req.body.street,
            apartment:req.body.apartment,
            zip:req.body.zip,
            city:req.body.city,
            country:req.body.country, 

    },{
        new: true
    })

    if(!user){
        res.status(501).send("This User Not Found");
    }
    res.send(user);
})

router.post('/', async(req,res)=>{
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country,
    })

    user = await user.save();
    if(!user){
        return res.status(500).send('This User Can not be Created !')
    }

    res.send(user);
})

router.post('/login',async(req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send("This user not Found!")
    }
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token = jwt.sign({
            userId : user.id,
            isAdmin: user.isAdmin
        },'secret',
        {expiresIn: '1d'})

        res.status(200).send({user: user.email,token: token});
    }else{
        res.status(400).send("Password Is Wrong")

    }
})

router.delete('/:id',(req,res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success:true,msg:'User Was Deleted !'})
        }else{
            return res.status(404).json({success:false, msg:'User Not Found'})
        }
    }).catch(err=>{
        return res.status(400).json({err:err})
    })
})

router.get(`/get/count`,async(req,res)=>{
    const userCount = await User.countDocuments()
        if(!userCount){
                res.status(500).json({success: false})
        }
        res.send({
            userCount: userCount
        
    })
})



module.exports = router;