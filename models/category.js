const {Schema,model} = require('mongoose')

const schemaCategory = new Schema({
    label :String,
    color:String,
    icon:String,
})  
module.exports = model('Category', schemaCategory)