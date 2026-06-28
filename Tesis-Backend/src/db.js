const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected');
    }catch(error){
        console.error(error)
    }    
}

module.exports= connectDB
