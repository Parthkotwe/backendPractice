const {Router} = require('express');
const {userModel, purchaseModel} = require("../database/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "100xdevs";

const userRouter = Router();

userRouter.post("/signup",async (req,res)=>{
    try {
        const {email,password,firstName,lastName} = req.body;
        if(!email || !password || !firstName || !lastName){
            return res.status(400).json({message: "All fields are required"});
        }
        
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "user Already exits"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            email,hashedPassword,firstName,lastName
        })
        return res.status(201).json({message: "User created successfully"});
    } catch (error) {
        console.error("Error creating user: ", error);
        return res.status(500).json({message: "Internal server error"});
    }
})


userRouter.post("/login",async (req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        const findUser = await userModel.findOne({email,}).select("+password");
        if(!findUser){
            return res.status(400).json({message: "Invalid email"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid);

        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid password"});
        }

        if(findUser && isPasswordValid){
            const token = jwt.sign({ userId: findUser._id,},jwtSecret);
            res.cookie("userToken", token,{
                httpOnly: true,
                secure:false, //// set true only when using https
                sameSite:'Strict',
            });
            return res.status(200).json({message:"Login successfull"});
        }
    } catch (error) {
        console.error("Error logging in user: ", error);
        return res.status(500).json({message: "Internal server error"});
    }
})

userRouter.get("/logout",(req,res)=>{
    res.clearCookie("userToken");
    return res.status(200).json({message: "Logout sucessfull"});
})

userRouter.get("/userPruchasedCourses",async (req,res)=>{
    try {

        // Get logged in user id from middleware
        const userId = req.userId;

        // Find all purchases of that user
        const userPurchases = await purchaseModel.find({
            userId
        });

        // Extract all purchased course ids
        const courseIds = userPurchases.map((purchase) => {
            return purchase.courseId;
        });

        // Find all course details using course ids
        const coursesData = await courseModel.find({
            _id: {
                $in: courseIds
            }
        });

        // Send response
        res.json({
            message: "User purchased courses",
            userPurchases,
            coursesData
        });

    }

    catch (error) {

        console.log("Error:", error);

        res.status(500).json({
            message: "Internal server error"
        });

    }
})


module.exports = {userRouter : userRouter};