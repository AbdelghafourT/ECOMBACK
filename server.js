const server = require('./app')
require('./config/db')

const port = process.env.PORT || 5000;

server.listen(port,() => {
    console.log(`listening on port on ${port} Port ...`)
})

