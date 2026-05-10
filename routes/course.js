const Router = require('express');
const courseRouter = Router();
const {courseModel, purchaseModel} = require("../database/schema");

courseRouter.get("/AllCourses", async (req,res)=>{
    try {
        const Allcourses = await courseModel.find();
        return res.status(200).json({message: "Courses fetched successfully", courses: Allcourses});
    } catch (error) {
        console.error("Error fetching courses: ",error);
        return res.status(500).json({message: "Internal server error"});
    }
})

courseRouter.post("/purchasedCourses",async (req,res)=>{
    try {
        const userId = req.userId;
        const courseId = req.body.courseId;

        const AlreadyPurchasred = await purchaseModel.findOne({userId,courseId});
        if(AlreadyPurchasred){
            return res.status(400).json({message: "Course already purchased"});
        }

        const newPurchase = await purchaseModel.create({
            userId,
            courseId
        })
        return res.status(200).json({message: "Course purchased successfully"});

    } catch (error) {
        console.error("Error purchasing course: ",error);
        return res.status(500).json({message: "Internal server error"});
    }
})

module.exports = {
    courseRouter: courseRouter
}