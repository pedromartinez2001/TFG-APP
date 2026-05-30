const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectDB = async()=>{
    try{
        await mongoose.connect('mongodb+srv://pmms:Az147415@cluster0.32lby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Connected');
    }catch(error){
        console.error(error)
    }    
}

module.exports= connectDB
