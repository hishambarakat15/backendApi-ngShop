
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const {Product} = require('../models/product');
const multer = require('multer');
const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',

}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid Image Type');
        if(isValid){
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extention = FILE_TYPE_MAP[file.mimetype];
      cb(null,`${fileName}-${Date.now()}.${extention}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })

router.get('/',async (req,res)=>{
    const productList = await Product.find().populate('category');
    res.send(productList);
})

router.get('/:id',async (req,res)=>{
    const productList = await Product.findById(req.params.id).populate('category');
    if(!productList) {
        res.status(5000).json({success: false})
    }
    res.send(productList);
})


router.post('/',uploadOptions.single('image') ,async (req,res)=>{
    const category = await Category.findById(req.body.category);
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    let product = new Product({
        name: req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:`${basePath}${fileName}`,
        images:req.body.images,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured,
        dateCreated:req.body.dateCreated
    })
    
     product = await product.save();

   
    if(!product){
      return  res.status(500).json('PRODUCT NOT FOUNT')
    }else{
       return res.send(product)
    }


})


router.put('/:id',async (req,res)=>{
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(500).send("Invalid Category");

    const product = await Product.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        // description:req.body.description,
        // richDescription:req.body.richDescription,
        // image:req.body.image,
        // images:req.body.images,
        // brand:req.body.brand,
        // price:req.body.price,
        // category:req.body.category,
        countInStock:req.body.countInStock,
        // rating:req.body.rating,
        // numReviews:req.body.numReviews,
        // isFeatured:req.body.isFeatured,
        // dateCreated:req.body.dateCreated
    },{
        new : true
    });

    if(!product){
        res.status(5000).json({success:false})
    }
    res.send(product);
})

router.delete('/:id',(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then((product)=>{
        if(product){
            return res.status(200).send('Product Was Deleted')
        }else{
            return res.status(400).json({success:false,msg:"Product Not Find"})
        }
    }).catch(err=>{
        return res.status(500).json({success:false,err:err})
    })

})

// Get Product Count 
router.get('/get/count',async(req,res)=>{
    const productCount = await Product.countDocuments();

    res.send({
        productCount: productCount
    });
})

// router.get('/get/c',async(req,res)=>{
//         const productCount= await Product.countDocuments((count) => count);
    
//         res.send(productCount);
//     })
    
    router.get('/get/f',async (req,res)=>{
        const productList = await Product.find({isFeatured: true});
        res.send(productList);
    })
    
module.exports = router;  