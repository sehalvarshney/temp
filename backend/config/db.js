const mongoose = require('mongoose');

const connectDb = async (req ,res) =>{
    try{
        mongoose.connect("mongodb://localhost:27017/testdb");
        console.log("Database connect sucessfully");
    }
    catch{
        console.log("mongodb connection error" , error);
    }
}

module.exports = connectDb ;