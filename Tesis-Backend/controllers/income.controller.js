const Income = require('../models/income.model')

const getIncomes=async(req,res)=>{
    const incomes=await Income.find({user:req.user.id}).populate('user')
    res.json(incomes) 
}

const getIncome=async(req,res)=>{
    const income= await Income.findById(req.params.id)
    if(!income) return res.status(404).json({message:'Ingreso no existe'})
    res.json(income)
}
 
const createIncome=async(req,res)=>{
    const{category,amount,description,date}=req.body
    const newIncome= new Income({
        category,
        amount,
        description,
        date,
        user:req.user.id
    })
    const savedIncome=await newIncome.save()
    res.json(savedIncome)
}
 
const deleteIncome=async(req,res)=>{
    const income= await Income.findByIdAndDelete(req.params.id)
    if(!income) return res.status(404).json({message:'Ingreso no existe'})
    res.json(income)
}
 
const updateIncome=async(req,res)=>{
    const income= await Income.findByIdAndUpdate(req.params.id, req.body, {new:true})
    if(!income) return res.status(404).json({message:'Ingreso no existe'})
    res.json(income)
}

module.exports={getIncome,getIncomes,createIncome,deleteIncome,updateIncome}