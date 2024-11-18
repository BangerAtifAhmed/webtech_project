const express = require("express");
const cors=require("cors");//react is 3000 and node is 5000 
//so it will show error to overcome 
//this we use module which allow to fetch from any server 
const app=express();
const PORT=5000;//react use 3000
const mongoose=require("mongoose")
const {mongourl}=require("./key.js")//has url 
require('./models/model.js')
app.use(cors())
require('./models/post.js')
app.use(express.json())//use to parse in json 
app.use(require("./routes/auth.js"))// use to run middlware function 
//(jab bhi hemare server par request aati hai to hum middleware ke through  we can do changes )
//jab hum data react se send karthai hai to data tu json formate nai hoga then middleware will come in middle
// convert the data in json 
app.use(require("./routes/create.js"))
app.use(require("./routes/user.js"))
mongoose.connect(mongourl)


mongoose.connection.on("connected",()=>{//write connected only
    console.log("successfully connected to mongo");
    
})

mongoose.connection.on("error",()=>{
    console.log("not connected to mongodb");
    
})
app.listen(PORT,()=>{
console.log("servering is running");
console.log("server" + PORT);

})