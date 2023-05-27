const Category = require('./../models/category');
const mongoose = require('mongoose');

exports.index = async (req, res, next) =>{
    try {
        const categorys = await Category.find();
        res.json({ 
            categorys,
            success: true,
         });
    } catch (error) {
        res.status(500).json({ success: false});
    }
}

exports.store = (req, res) =>{

    let {label,color,icon} = req.body;
    const myCategory = new Category({
        label: label,
        color: color,
        icon: icon
    })
    myCategory.save()
     .then(insertedProduct => {
        res.status(201).json({
            category:insertedProduct,
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
    Category.findByIdAndRemove(id)
    .then(deletedCategory => {
        res.status(201).json({
            category:deletedCategory,
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
    if(!mongoose.isValidObjectId(id)){
        return res.status(404).json({
            success: false,
            message:'id is not valid'
        })
    }
    try {
        const category = await Category.findOneAndReplace({'_id':id},req.body,{new:true});
        if(!category){
            return res.status(404).json({success: false, message:"Category not found"})
        }
        res.json({ 
            category,
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
        const category = await Category.findOneAndUpdate({'_id':id},req.body,{new:true});
        if(!category){
            return res.status(404).json({success: false, message:"Category not found"})
        }
        res.json({ 
            category,
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
        const category = await Category.findById(id);
        if(!category){
            return res.status(404).json({success: false, message:"Category not found"})
        }
        res.json({ 
            category,
            success: true,
         });
    } catch (error) {
        res.status(500).json({ success: false});
    }
  }