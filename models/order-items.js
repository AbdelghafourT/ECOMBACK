const { Schema,model } = require('mongoose')

const SchemaOrderItem = new Schema({
    product:{
        type:Schema.Types.ObjectId,'ref':'Product',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
   price:Number

})
module.exports = model('OrderItem',SchemaOrderItem)
