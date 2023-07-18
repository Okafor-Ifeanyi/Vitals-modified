const createServer = require("./src/utils/server.utils")
const connect = require("./src/utils/connect.utils")
require('dotenv').config()

const app = createServer()
 
// Import Port from env and connect(listen)
const port = process.env.PORT || 3838
app.listen(port, async () => {
    console.log(`Server is up ${port}`)

    await connect()
})