const Expense = require('../models/expense.model')
const Vencimiento = require('../models/vencimiento.model')

const normalizeDate = (value) => {
    if (!value) return value

    if (value instanceof Date) {
        return value
    }

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return new Date(`${value}T12:00:00`)
    }

    return new Date(value)
}

const getExpenses=async(req,res)=>{
    const expenses=await Expense.find({user:req.user.id}).populate('user')
    res.json(expenses) 
}

const getExpense=async(req,res)=>{
    const expense= await Expense.findById(req.params.id)
    if(!expense) return res.status(404).json({message:'Gasto no existe'})
    res.json(Expense)
}
 
const createExpense=async(req,res)=>{
    const{category,amount,description,date}=req.body
    const newExpense= new Expense({
        category,
        amount,
        description,
        date: normalizeDate(date),
        user:req.user.id
    })
    const savedExpense=await newExpense.save()
    res.json(savedExpense)
}
 
const deleteExpense=async(req,res)=>{
    const expense= await Expense.findByIdAndDelete(req.params.id)
    if(!expense) return res.status(404).json({message:'Gasto no existe'})
    
    // Si el gasto está asociado a una obligación, eliminar también la obligación
    if (expense._id) {
        await Vencimiento.deleteOne({ expenseId: expense._id })
    }
    
    res.json(expense)
}
 
const updateExpense=async(req,res)=>{
    const payload = {
        ...req.body,
        ...(req.body.date ? { date: normalizeDate(req.body.date) } : {})
    }

    const expense= await Expense.findByIdAndUpdate(req.params.id, payload, {new:true})
    if(!expense) return res.status(404).json({message:'Gasto no existe'})
    res.json(expense)
}

module.exports={getExpense,getExpenses,createExpense,deleteExpense,updateExpense}