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

adminApp.post('/employees',expressAsyncHandler(async(req,res)=>{
    let obj=req.body
    let result = await empCollection.insertMany(obj)
    console.log(result)
    if(result.acknowledged===true){
        res.send({message:"Employees data Insertion Successful"});
    }else{
        res.send({message:"Error in uploading details"})
    }
}))
module.exports=adminApp