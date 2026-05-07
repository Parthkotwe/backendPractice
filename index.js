const express = require("express");
const app = express();
const Port = 3000;
const mongoose = require("mongoose");
const {database} = require("./database/schema");

async function connectToDatabase(){
    try{
        await mongoose.connect("mongodb+srv://parthkotwe73:Parth02@cluster0.aj7snor.mongodb.net/CoursesSelling");
        console.log("Connected to the database successfully");
        app.listen(Port, ()=>{
            console.log(`Server is running on port ${Port}`);
        });
    }
    catch(error){
        console.error("Error connecting to the databse: ",error);
    }
}

connectToDatabase();
