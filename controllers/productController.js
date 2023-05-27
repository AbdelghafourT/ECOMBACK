const Product = require('./../models/product');
const mongoose = require('mongoose');
const Joi = require('joi');
require('dotenv/config')
exports.index = async (req, res, next) =>{
    try {
        const products = await Product.find().populate('category','_id')
        res.json({ 
            products,
            success: true,
         });
    } catch (error) {
        res.status(500).json({ success: false});
    }
}

exports.store = (req, res) =>{
    let {title,discription,content,brand,countStock,price,rating,isFeatured,category} = JSON.parse(req.body.product);
    let {filename} = req.file;
    let thumbnail = ""
    if(filename){
        const domaine = process.env.DOMAIN_NAME
        const port = process.env.PORT
        thumbnail = `${domaine}/images/${filename}`
    }
    // let images = req.files.filename;
    const myProduct = new Product({
        title,
        discription,
        content,
        brand,
        countStock,
        price,
        thumbnail,
        rating,
        isFeatured,
        category
    })
     myProduct.save()
     .then(insertedProduct => {
        res.status(201).json({
            product:insertedProduct,
            success:true
        })
     })
     .catch(err => {
        res.status(500).json({
            error: err,
            success:false
        })
     })
}
exports.destroy = (req, res) => {
    let {id} = req.params;
    Product.findByIdAndRemove(id)
    .then(deletedProduct => {
        res.status(201).json({
            products:deletedProduct,
            success:true
        })
     })
     .catch(err => {
        res.status(500).json({
            error: err,
            success:false
        })
     })

}
exports.update = async (req, res, next) => {
    let {id} = req.params;
    let thumbnail = ''
    if(!mongoose.isValidObjectId(id)){
        return res.status(404).json({
            success: false,
            message:'id is not valid'
        })
    }
    if (req.file) {
        let { filename } = req.file
        const domaine = process.env.DOMAIN_NAME
        const port = process.env.PORT
        thumbnail = `${domaine}/images/${filename}`
    } else {
        thumbnail = Product.findById(id, 'thumbnail')
    }
    try {
        const product = await Product.findOneAndReplace({'_id':id},{...JSON.parse(req.body.product), thumbnail },{new:true});
        if(!product){
            return res.status(404).json({success: false, message:"Product not found"})
        }
        res.json({ 
            product,
            success: true,
         });
    } catch (error) {
        res.status(500).json({ success: false});
    }
  };
  
  exports.patch = async (req, res, next) => {
    let {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(404).json({
            success: false,
            message:'id is not valid'
        })
    }
    try {
        const product = await Product.findOneAndUpdate({'_id':id},req.body,{new:true});
        if(!product){
            return res.status(404).json({success: false, message:"Product not found"})
        }
        res.json({ 
            product,
            success: true,
         });
    } catch (error) {
        res.status(500).json({ success: false});
    }
  };

exports.show = async (req, res, next) =>{
    let {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(404).json({
            success: false,
            message:'id is not valid'
        })
    }
    try {
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({success: false, message:"Product not found"})
        }
        res.json({ 
            product,
            success: true,
         });
    } catch (error) {
        res.status(500).json({ success: false});
    }
  }
exports.search = async (req, res) => {
    // let segment = req.params.segment;
    let {search,fields}  = req.query; 
    if(search){
        try {
            const  product = await Product.find({$or:
                [
                    {title: { '$regex' : search, '$options':'i'}},
                    {content: { '$regex' : search, '$options':'i'}},
                    {discription: { '$regex' : search, '$options':'i'}}
                ]
            })
            .select(fields)
            .sort({'created_at':-1})
            if(!product.length){
                return res.status(404).json({success: false, message:"Product(s) not found !"})
            }
            res.json({
                product,
                success:true
            }) 
        } catch (error) {
            res.status(500).json({
                success:false,
            })
        }
    }
   
}

exports.uplodeImages = async (req, res) => {
    let id = req.params.id
    //return res.json(id)
    const domaine = process.env.DOMAIN_NAME
    const images = req.files.map(file => `${domaine}/images/${file.filename}`)
    try {
        const updateProduct = await Product.findByIdAndUpdate(id ,{images: images},{new: true})
        if(!updateProduct){
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }
        res.json({
            success: true,
            product:updateProduct
        })
    } catch (error) {
        res.status(505).json({
            success: false,
            error
        })
    }
    
}