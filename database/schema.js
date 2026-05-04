const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String}
})

const creatorSchema = new Schema({
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String}
})

const courseSchema = new Schema({
    title: {type: String, required: true ,unique:true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    imageUrl: { type: String, required: true },
    published: { type: Boolean, default: false },
    adminId: {type: ObjectId, ref: "Creators"}
})

const purchaseSchema = new Schema({
    userId: {type: ObjectId, ref:"Users",required:true},
    courseId: {type: ObjectId, ref:"Courses",required:true}
});

const userModel = mongoose.model("Users", userSchema);
const creatorModel = mongoose.model("Creators", creatorSchema);
const courseModel = mongoose.model("Courses", courseSchema);
const purchaseModel = mongoose.model("Purchased-courses", purchaseSchema);

module.exports = { userModel, creatorModel, courseModel, purchaseModel };