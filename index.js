const express = require("express");
const app = express();
const Port = 3000;
const mongoose = require("mongoose");
const {database} = require("./database/schema");

app.listen(Port, ()=>{
    console.log("Server is running on port 3000"+ Port);
})