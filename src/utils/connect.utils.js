const mongoose = require('mongoose');
require('dotenv').config()


async function connect () {
    // Database Connection 
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        family: 4,
    })
    .then(() => {
        console.log("DB Connected !!")
    })
    .catch((err) => {
        console.log("There is an issue trying to connect to your database")
    })
}

module.exports = connect