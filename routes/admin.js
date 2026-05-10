const {Router} = require('express');
const {creatorModel, purchaseModel,courseModel} = require("../database/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {jwtAdminSecret} = require("../config");

const adminRouter = Router();

adminRouter.post("/signup",async (req,res)=>{
    try {
        const {email,password,firstName,lastName} = req.body;
        if(!email || !password || !firstName || !lastName){
            return res.status(400).json({message: "All fields are required"});
        }
        
        const existingUser = await creatorModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Admin Already exits"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await creatorModel.create({
            email,hashedPassword,firstName,lastName
        })
        return res.status(201).json({message: "Admin Registerd successfully"});
    } catch (error) {
        console.error("Error creating Admin: ", error);
        return res.status(500).json({message: "Internal server error"});
    }
})


adminRouter.post("/login",async (req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        const findUser = await creatorModel.findOne({email,}).select("+password");
        if(!findUser){
            return res.status(400).json({message: "Invalid email"});
        }

        const isPasswordValid = await bcrypt.compare(password, findUser.password);
        console.log(isPasswordValid);

        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid password"});
        }

        if(findUser && isPasswordValid){
            const token = jwt.sign({ adminId: findUser._id,},jwtAdminSecret);
            res.cookie("adminToken", token,{
                httpOnly: true,
                secure:false, //// set true only when using https
                sameSite:'Strict',
            });
            return res.status(200).json({message:"Login successfull"});
        }
    } catch (error) {
        console.error("Error logging in admin: ", error);
        return res.status(500).json({message: "Internal server error"});
    }
})

adminRouter.get("/logout",(req,res)=>{
    res.clearCookie("adminToken");
    return res.status(200).json({message: "Logout sucessfull"});
})

adminRouter.post("/AddCourse",async (req,res)=>{
    try{
        const adminId = req.adminId;
        const {title,description,price,imgUrl} = req.body;

        if(!title || !description || !price || !imgUrl){
            return res.status(400).json({message: "All fields are required"});
        }

        const existingCourse = await courseModel.findOne({title});
        if(existingCourse){
            return res.status(400).json({message: "course with this title already exists"});
        }

        const newCourse = await courseModel.create({
            title:title,
            description:description,
            price:price,
            imgUrl:imgUrl
        })
        return res.status(201).json({message: "Course added successfully"});
    }
    catch(error){
        console.error("Error adding course: ", error);
        return res.status(500).json({message: "Internal server error"});
    }
})

adminRouter.put("/updateCourse/:courseId", async (req,res)=>{
    try{
        const adminId = req.adminId;
        const {courseId} = req.params;
        const {title,description,price,imgUrl} = req.body;

        const Course = await courseModel.findById(courseId);
        if(!Course){
            return res.status(404).json({message: "Course not found"});
        }
        if(Course.adminId.toString() !== adminId){
            return res.status(403).json({message:"Unauthorized to update this course"});
        }

        const updatedCourse = await courseModel.findByIdAndUpdate({__id:courseId, adminId:adminId},{
            title:title,
            description:description,
            price:price,
            imgUrl:imgUrl
        })
        res.status(200).json({message:"Course updated successfully"});
    }
    catch(error){
        console.error("Error updating course: ", error);
        return res.status(500).json({message: "Internal server error"});
    }
})

adminRouter.get("/allCourses",async (req,res)=>{
    try {
        const adminId = req.adminId;
        const AllCourses = await courseModel.find({adminId:adminId});
        return res.status(200).json({AllCourses:AllCourses});
    } catch (error) {
        console.error("Error fetching all courses: ", error);
        return res.status(500).json({message: "Internal server error"});
    }
})

module.exports = {
    adminRouter: adminRouter
}