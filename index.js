require("dotenv").config();

const express = require("express");
const app = express();
const Port = 3000;
const mongoose = require("mongoose");
const {database} = require("./database/schema");
const {userRouter} = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

app.use('/user/',userRouter);
app.use('/admin/',adminRouter);

async function connectToDatabase(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
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
