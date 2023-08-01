const mongoose = require("mongoose")
require('dotenv').config()

async function connect () {
    // Database Connection 
    await mongoose.connect(process.env.MONGODB_URI_testing, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        family: 4,
    })
    .then(() => {
        console.log("Test DB Connected !!")
    })
    .catch((err) => {
        console.log("There is an issue trying to connect to your database") })
}

async function closeConnection () {
    await mongoose.connection.close()
}

module.exports = { connect, closeConnection }

