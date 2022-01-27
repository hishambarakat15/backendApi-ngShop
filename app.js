const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors')
const api = process.env.API_URL; 


const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const userRouter = require('./routers/user');
const orderRouter = require('./routers/order');
const authJwt = require('./helper/jwt');


//Middleware
app.use(express.json());
app.use(cors());
app.use(authJwt());
app.use('/public/uploads',express.static(__dirname + '/public/uploads'));
app.use((err,req,res,next)=>{
    if(err){
        res.status(500).json({msg: err})
    }
})


//Routers
app.use(api+'/products', productsRouter)

app.use(api+'/categories',categoriesRouter)

app.use(api+'/users',userRouter)

app.use(api+'/orders',orderRouter)


// mongoose.connect('mongodb://localhost:27017/ngShop',(err)=>{
//     console.log('MONGOOSE IS CONNECTED ')
// })

// //Database

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });


// const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT || 3000,()=>{
    console.log('SERVER IS RUNNING http://localhost:3000 ')
})