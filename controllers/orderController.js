const Order = require('../models/order')
const Product = require('../models/product')
const OrderItem = require('../models/order-items')
const mongoose = require('mongoose');


// exports.index = async (req, res, next) =>{
//       try {
//         const myOrders = await Order.find()
//                                       .populate('user','name','email')
//                                       .populate({path:'orderItems',populate:{
//                                         path:'product',select:'title description',populate:{
//                                           path:'category',
//                                           select:'label'
//                                         }
//                                       }})
        
//         res.json({ 
//           orders:myOrders,
//           success: true,
//         });                              
//       } catch (error) {
//         res.status(500).json({
//           success:false,
//           message:error
//         })
//     }
//   }

exports.index = async (req, res, next) => {
  try {     
     const myOrders = await Order.find()
                                 .populate('user', 'name email')
                                 .populate({ path: 'orderItems', populate: {
                                  path: 'product', select: 'title discription price', populate: {
                                      path: 'category',
                                      select: 'label'
                                  }
                                 }})
     res.json({
      success: true,
      orders: myOrders
     })
  } catch (error) {
      res.status(500).json({ success: false });
  }
}

//   exports.store = async (req, res) =>{
//     let {shippingAddress,invoiceAddress,city,country,phone,items} = req.body
//     const user = "6455229da4628ac68207a819" 
//     // 643e951f055f411ba1c76b84
//     let total = 0
//     console.log('items',items)
    
//     const orderItemsIds = await Promise.all(items.map(async item => {
//       const {price}  = await Product.findById(item.product,'price')
//       total += (item.quantity * price)
//       const myOrderItem = await OrderItem.create({...item,price:price})
//       return myOrderItem._id
//     }))
//   //  return res.json(orderItemsIds)
//   const myOrder = new Order({shippingAddress,invoiceAddress,city,country,phone,orderItems:orderItemsIds,user,total})
//     myOrder.save()
//      .then(insertedOrder => {
//         res.status(201).json({
//             order:insertedOrder,
//             success:true
//         })
//      })
//      .catch(err => {
//         res.status(500).json({
//             error: err,
//             success:false
//         })
//      })
// }

exports.store = async (req, res) =>{
  let {shippingAddress,invoiceAddress,city,country,phone,items} = req.body
  const user = "6457c68fb6ff85288a6728ab" 
  // 643e951f055f411ba1c76b84
  let total = 0
  console.log('items',items)
  
  const orderItemsIds = await Promise.all(items.map(async item => {
    const {price, countStock}  = await Product.findById(item.product,'price countStock')
    total += (item.quantity * price)
    const myOrderItem = await OrderItem.create({...item,price:price})
    await Product.findByIdAndUpdate(item.product, {countStock: countStock - item.quantity})
    return myOrderItem._id
  }))
  const myOrder = new Order({shippingAddress,invoiceAddress,city,country,phone,orderItems:orderItemsIds,user,total})
  myOrder.save()
   .then(insertedOrder => {
      res.status(201).json({
          order:insertedOrder,
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


exports.userOrder = async (req,res) =>{
  const id = req.params.id;
  try {
    const orders = await Order.find({ user: id },'-user')
                                        .populate({ path: 'orderItems', populate: {
                                          path: 'product', select: 'title discription', populate: {
                                              path: 'category',
                                              select: 'label'
                                          }
                                         }})
    // let total = 0;
    // orders.forEach(order =>{
    //   total+= order.total
    // })   
    const total = orders.reduce((cumul,order)=> cumul + order.total,0);                                 
    res.json({
      total,
      success: true,
      orders: orders
     })
  } catch (err) {
    res.status(500).json({
      error: err,
      success:false
  })
  }
}

//Original code

exports.patchOrder = async (req, res, next) => {
  let {id} = req.params;
  if(!mongoose.isValidObjectId(id)){
      return res.status(404).json({
          success: false,
          message:'id is not valid'
      })
  }
  try {
      const orders = await Order.findOneAndReplace({'_id':id},req.body,{new:true});
      if(!orders){
          return res.status(404).json({success: false, message:"Order not found"})
      }
      res.json({ 
          orders,
          success: true,
       });
  } catch (error) {
      res.status(500).json({ success: false});
  }
};


exports.destroy = async (req, res, next) => {
  let {id} = req.params;

  if(!mongoose.isValidObjectId(id)){
    return res.status(400).json({
      success:false,
      message:`The order with id = ${id} has been deleted`
    })
  }
  try {
    const orders = await Order.findOneAndDelete({'_id':id},req.body);
    if(!Order){
      return res.status(404).json({
        success: false,
        message: `no order found with id = ${id}`,
      })
    }
    res.json({ orders, success:true });

  } catch(error){
    res.status(500).json({ success:false })
  }

}


//testing code for countSock and status
// exports.patchOrder = async (req, res, next) => {
//   let { id } = req.params;
//   if (!mongoose.isValidObjectId(id)) {
//     return res.status(404).json({
//       success: false,
//       message: 'id is not valid'
//     })
//   }
//   try {
//     const order = await Order.findOneAndUpdate(
//       { _id: id },
//       {
//         ...req.body,
//         status: 'cancled'
//       },
//       { new: true }
//     );
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }
//     // update product countStock here
//     const { items } = req.body;
//     for (const item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res.status(404).json({ success: false, message: "Product not found" });
//       }
//       const countStock = product.countStock + item.quantity;
//       await Product.findByIdAndUpdate(item.product, { countStock });
//     }
//     res.json({ order, success: true });
//   } catch (error) {
//     res.status(500).json({ success: false });
//   }
// };

// Scond Code for Testing (this code work)
// exports.patchOrder = async (req, res, next) => {
//   const { id } = req.params;
  
//   if (!mongoose.isValidObjectId(id)) {
//     return res.status(404).json({
//       success: false,
//       message: 'id is not valid'
//     });
//   }

//   try {
//     const order = await Order.findOne({ _id: id });
    
//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     // If order is cancled, increase countstock
//     if (order.status === 'cancled') {
//       const { products } = order;

//       products.forEach(async (product) => {
//         const { productId, quantity } = product;
        
//         const existingProduct = await Product.findById(productId);
        
//         if (existingProduct) {
//           existingProduct.countStock += quantity;
//           await existingProduct.save();
//         }
//       });
//     }

//     // Replace order with new data
//     const updatedOrder = await Order.findOneAndReplace({ _id: id }, req.body, { new: true });

//     res.json({ 
//       orders: updatedOrder,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// };

// 3 code for testing

// exports.patchOrder = async (req, res, next) => {
//   const { id } = req.params;
  
//   if (!mongoose.isValidObjectId(id)) {
//     return res.status(404).json({
//       success: false,
//       message: 'id is not valid'
//     });
//   }

//   try {
//     const order = await Order.findOne({ _id: id });
    
//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     // If order is cancled, increase countstock
//     if (order.status === 'cancled') {
//       const { products } = order;

//       await Promise.all(products.map(async (product) => {
//         const { productId, quantity } = product;
        
//         const existingProduct = await Product.findById(productId);
        
//         if (existingProduct) {
//           existingProduct.countStock += quantity;
//           await existingProduct.save();
//         }
//       }));
//     }

//     // Replace order with new data
//     const updatedOrder = await Order.findOneAndReplace({ _id: id }, req.body, { new: true });

//     res.json({ 
//       orders: updatedOrder,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// };

// exports.patchOrder = async (req, res, next) => {
//   const { id } = req.params;
  
//   if (!mongoose.isValidObjectId(id)) {
//     return res.status(404).json({
//       success: false,
//       message: 'id is not valid'
//     });
//   }

//   try {
//     const order = await Order.findOne({ _id: id });
    
//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     // If order is canceled, increase countstock
//     if (order.status === 'cancled') {
//       const { orderItems } = order;

//       await Promise.all(orderItems.map(async (orderItem) => {
//         const { product, quantity } = orderItem;
        
//         const existingProduct = await Product.findById(product);
        
//         if (existingProduct) {
//           existingProduct.countStock += quantity;
//           await existingProduct.save();
//         }
//       }));
//     }

//     // Replace order with new data
//     const updatedOrder = await Order.findOneAndReplace({ _id: id }, req.body, { new: true });

//     res.json({ 
//       orders: updatedOrder,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// };

exports.cancelOrder = async  (req, res,next) => {
  try {
    const {id} = req.params;
    const orders = await Order.findById(id).populate('orderItems');
    
    // Increase the countStock for each product in the cancelled order
    for (const orderItem of orders.orderItems) {
      const productId = orderItem.product;
      const quantity = orderItem.quantity;
      await Product.findByIdAndUpdate(productId, {$inc: {countStock: quantity}});
    }
    
    // Update the order status to "cancelled"
    await Order.findByIdAndUpdate(id, {status: 'cancled'});
    // res.status(200).send('Order cancelled successfully');
    res.json({ orders, success:true });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while cancelling the order');
  }
}










