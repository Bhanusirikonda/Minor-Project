
const exp=require('express')
const ownerApp=exp.Router()
const jwt=require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const expressAsyncHandler= require('express-async-handler')

const verifyToken = require('../Middlewares/verifyToken')
require('dotenv').config()

let empCollection
let ownerCollection
let employeeAttendance
ownerApp.use((req,res,next)=>{
    empCollection = req.app.get('empCollection')
    ownerCollection = req.app.get('ownerCollection')
    employeeAttendance = req.app.get('employeeAttendance')

    next()
})

ownerApp.use(exp.json())


ownerApp.post('/login',expressAsyncHandler(async(req,res)=>{
    const ownerCred = req.body;

    const dbowner=await ownerCollection.findOne({id :ownerCred.id})
    if(dbowner===null){
        res.send({message:"Invalid owner id"})
    }else{
        let status= await bcryptjs.compare(ownerCred.password,dbowner.password)
        if(!status){
            res.send({message:"Invalid password"})
        }else{
            const signedToken=jwt.sign({id:dbowner.id},process.env.SECRET_KEY
                , {expiresIn:'1d'})
            res.send({message:"Login success",token:signedToken,owner:dbowner})
        }
        
    }
}))


ownerApp.post('/employeesalarydetails/', async(req,res)=>{
    let params=req.body
    let cluster=params.cluster
    let serviceCenter=params.serviceCenter
    let type=params.type

    let query = {};

    if (cluster) query.cluster = cluster;
    if (serviceCenter) query.serviceCenter = serviceCenter;
    if (type) query.type = type;
    query.status="Active"

    let month=params.month
    let year=params.year
    const empList = await empCollection.find(query).toArray();
    // Extract employee IDs
    const empIds = empList.map(emp => emp.id);

    // Fetch attendance records for the given month and year
    const attendanceRecords = await employeeAttendance.find({
        id: { $in: empIds },
        month: parseInt(month, 10),
        year: parseInt(year, 10)
    }).toArray();
        // Create a map of employee attendance
    const attendanceMap = new Map(attendanceRecords.map(att => [att.id, parseInt(att.noOfPresentDays, 10) || 0]));
    // Merge attendance data into employee list
    const mergedEmpList = empList.map(emp => ({
        ...emp,
        daysPresent: attendanceMap.get(emp.id) ?? 0  // Default to 0 if no record found
    }));
    
    res.send({message : "All the employees ",payload : mergedEmpList}) 

})

ownerApp.post('/addemployee',async(req,res)=>{
    const newEmployee = req.body;
    console.log(newEmployee)
    const emp=await empCollection.findOne({id :newEmployee.id})
    if(emp!==null){
        res.send({message:"employee already existed"})
    }else{
        newEmployee.status="Active"
        await empCollection.insertOne(newEmployee)
        res.send({message:"Employee registration success"})
    }
    
})


ownerApp.put('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from request params
        const updatedEmployee = req.body; // Extract updated data
        
        delete updatedEmployee._id;
        // Ensure we use the correct field name (`id`)
        const result = await empCollection.findOneAndUpdate(
            {id: id },  // Match using the custom `id` field
            { $set: updatedEmployee }, // ✅ Use `$set` to update only specific fields
            { returnDocument: "after" } // ✅ Return the updated document
        );

        if (!result) {
            return res.status(404).send({ error: "Employee not found" });
        }

        res.send({ success: true, message: "Employee updated successfully", updatedEmployee: result });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).send({ error: "Failed to update employee" });
    }
});

  
ownerApp.post('/employeedetails',async(req,res)=>{
    let params=req.body
    let cluster=params.cluster
    let serviceCenter=params.serviceCenter
    let type=params.type
    let status=params.status
    let query = {};

    if (cluster) query.cluster = cluster;
    if (serviceCenter) query.serviceCenter = serviceCenter;
    if (type) query.type = type;
    if (status!="all") query.status = status;
    let month=params.month
    let year=params.year
    const empList = await empCollection.find(query).toArray();
    res.send({message : "employee details ",payload : empList})
})



module.exports = ownerApp