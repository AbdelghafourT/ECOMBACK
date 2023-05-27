const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL,{
    dbName:process.env.DB_NAMES
})
.then(() => console.log('App Connected With MongoDB ...'))
.catch( err => {
    console.log(err)
})