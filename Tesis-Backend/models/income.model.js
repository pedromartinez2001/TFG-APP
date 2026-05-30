const mongoose=require('mongoose')

const incomeSchema= new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    description:{
        type:String,
      
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{
    timestamps:true
})

module.exports= mongoose.model('Income', incomeSchema)