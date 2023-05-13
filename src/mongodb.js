const mongoose = require("mongoose");


const databaseStr = process.env.DATABASECONNECTIVITY;

mongoose.connect(databaseStr)
    .then(() => {
        console.log("successfull connected");
    })
    .catch((err) => {
    console.log(err)
    })


const Registration = new mongoose.Schema({
    firstName: {
        type: String,
        required:true
        },
    lastName: {
        type: String,
        required:true
        },
    Email: {
        type: String,
        required:true
        },
    Password: {
        type: String,
        required:true
        },
    Phone: {
        type: Number,
        required:true
        },
    Gender: {
        type: String
        }
})
    
const collection = new mongoose.model("Collections", Registration)

module.exports = collection;