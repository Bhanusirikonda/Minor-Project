const exp=require('express')
const adminApp=exp.Router()
const bcryptjs =require('bcryptjs')
const expressAsyncHandler= require('express-async-handler')


let ownerCollection
let empCollection
adminApp.use((req,res,next)=>{
    ownerCollection = req.app.get('ownerCollection')
    empCollection=req.app.get('empCollection')
    next()
})

adminApp.use(exp.json())

adminApp.post('/ownerregistration',expressAsyncHandler(async(req,res)=>{
    const newOwner=req.body;

    const dbowner = await ownerCollection.findOne({id :newOwner.id})

    if(dbowner!==null){
        res.send({message :" owner exists"})
    }else{
        const hashedPassword=await bcryptjs.hash(newOwner.password,6)
        newOwner.password = hashedPassword
        await ownerCollection.insertOne(newOwner)
        res.send({message :"owner created"})
    }
}))


adminApp.get('/owners',expressAsyncHandler(async(req,res)=>{

    const ownerList = await ownerCollection.find().toArray();

    res.send({message :"All owners are", payload:ownerList})
}))

adminApp.post('/employees', expressAsyncHandler(async (req, res) => {
    try {
        const employees = req.body;

        // Process employees using map() and Promise.all()
        const results = await Promise.all(employees.map(async (employee) => {
            const existingEmployee = await empCollection.findOne({ id: employee.id });

            if (!existingEmployee) {
                await empCollection.insertOne(employee);
                return "inserted";
            } else {
                return "ignored";
            }
        }));

        // Count inserted and ignored employees
        const insertedCount = results.filter(status => status === "inserted").length;
        const ignoredCount = results.filter(status => status === "ignored").length;

        res.status(201).send({
            message: "Employee data processed successfully ",
            inserted: insertedCount,
            ignored: ignoredCount,
        });

    } catch (error) {
        console.error("Error processing employees:", error);
        res.status(500).send({ message: "Internal server error", error: error.message });
    }
}));


module.exports=adminApp