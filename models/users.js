const mongoose = require('mongoose');

const userShema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    passwordHash:{
        type:String,
        required: true
    },
    phone:{
        type:Number,
        required: true
    },
    isAdmin:{
        type:Boolean,
        default: false
    },
    street:{
        type:String,
        default:''
    },
    apartment:{
        type:String,
        default:''
    },
    zip:{
        type:String,
        default:''
    },
    city:{
        type:String,
        default:''
    },
    country:{
        type:String,
        default:''
    }
})

userShema.virtual('id').get( function(){
    return this._id.toHexString();

})

userShema.set('toJSON',{
    virtuals:true
})


exports.User = mongoose.model('User',userShema);
exports.userShema = userShema;