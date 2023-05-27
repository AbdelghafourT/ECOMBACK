const User = require('./../models/user')
const Order = require('./../models/order')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');



exports.index = async (req, res, next) =>{
    try {
      const result = await User.find()
      if(!result){
        return res.status(404).json({success: false, message:"no user found"})
    }
      res.status(201).json({
        success:true,
        user:result
      })
    } catch (error) {
      res.status(500).json({
        success:false,
        message:error
      })
    }
  }

exports.register = async (req, res) =>{
  let { name, email, passeword, address, city, country, phone,isAdmin} = req.body;
  const user = new User({
    name,
    email,
    passeword:bcrypt.hashSync(passeword,10),
    address,
    city,
    country,
    phone,
    isAdmin
  })
  try {
    const result = await user.save();
    res.status(201).json({
      success:true,
      user:result
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error
    })
  }
}

exports.login = async (req, res) => {
  const { email,passeword } = req.body;
  const user = await User.findOne({email: email},'name email passeword isAdmin')
  if(!user){
    return res.status(404).json({
      success:false,
      message: "email or password is incorrect"
    })
  }
  if(user && bcrypt.compareSync(passeword, user.passeword)){
    const secret = process.env.SECRET_KEY
    const token =  jwt.sign({
      userId:user.id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin
    },secret,{ expiresIn: '1h' })
    return res.status(200).json({
      success:true,
      message: "User is Authenticated",
      user:user.name,
      token
    })
  }
  res.status(404).json({
    success: false,
    message: "email or password is incorrect"
  })
}

exports.destroy = async (req, res, next) => {
  
  let {id} = req.params;
  if(!mongoose.isValidObjectId(id)){
    return res.status(400).json({
      success:false,
      message:`The product with id = ${id} has been deleted`
    })
  }
  try {
    const user = await User.findOneAndDelete({'_id':id},req.body);
    if(!User){
      return res.status(404).json({
        success: false,
        message: `no Product found with id = ${id}`,
      })
    }
    res.json({ user, success:true });

  } catch(error){
    res.status(500).json({ success:false })
  }

}
// exports.validateToken = async(req, res, next) =>{
  
//   const secret = process.env.SECRET_KEY;
//   return (req, res, next) => {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).send('Access denied. No token provided.');
//     }
//     try {
//       const decoded = jwt.verify(token, secret);
//       req.user = decoded;
//       console.log(decoded);
//       next();
//     } catch (ex) {
//       res.status(400).send('Invalid token.');
//     }
// };
  

// }
exports.patchUser = async (req, res, next) => {
  let {id} = req.params;
  if(!mongoose.isValidObjectId(id)){
      return res.status(404).json({
          success: false,
          message:'id is not valid'
      })
  }
  try {
      const user = await User.findOneAndUpdate({'_id':id},req.body,{new:true});
      if(!user){
          return res.status(404).json({success: false, message:"User not found"})
      }
      res.json({ 
          user,
          success: true,
       });
  } catch (error) {
      res.status(500).json({ success: false});
  }
}

