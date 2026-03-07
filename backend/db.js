const mongoose = require("mongoose")
require("dotenv").config({ path: '../.env' })

const connection = mongoose.connect(process.env.url)

module.exports={
    connection
}