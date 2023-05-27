const {Schema,model} = require('mongoose')
const schemaUser = new Schema({
    name:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    passeword:{
        type: String,
        required:true,
    },
    adresse: String,
    city: String,
    country: String,
    phone: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
})
module.exports = model('User',schemaUser)