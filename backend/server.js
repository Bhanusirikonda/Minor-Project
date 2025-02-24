
const exp = require('express')
const app=exp()

require('dotenv').config()
const path=require('path')
const mongoClient = require('mongodb').MongoClient
app.use(exp.json())


app.use(exp.static(path.join(__dirname,'../frontend/build')))

mongoClient.connect(process.env.DB_URL)
.then(async(client)=>{
    const ahsrmservices = client.db('ahsrmservicesdb')
    const ownerCollection = ahsrmservices.collection('ownerCollection')
    const empCollection = ahsrmservices.collection('empCollection')
    const employeeAttendance=ahsrmservices.collection('employeeAttendance')
    await employeeAttendance.createIndex(
        {id: 1, month: 1 ,year: 1},
        { unique: true }
      );
    app.set('empCollection',empCollection)
    app.set('ownerCollection',ownerCollection)
    app.set('employeeAttendance',employeeAttendance)
    console.log("Database connection success")
})
.catch(err=>{
    console.log("error in connection of database ",err)
}
)

const ownerApp = require('./APIs/owner-api')
const operatorApp = require('./APIs/operator-api')
const adminApp=require('./APIs/admin-api')




app.use('/owner-api',ownerApp)
app.use('/operator-api',operatorApp)
app.use('/admin-api',adminApp)


app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,"../frontend/build/index.html"))
})

app.use((err,req,res,next)=>{
    res.send({messsage:"error message",payload : err.message})
})

const port = process.env.PORT
app.listen(port, console.log("server is running in port",port))