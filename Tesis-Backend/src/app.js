const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const authRoutes=require('../routes/auth.routes')
const incomeRoutes=require('../routes/income.routes')
const expenseRoutes=require('../routes/expense.routes')
const vencimientoRoutes=require('../routes/vencimiento.routes')
const savingGoalRoutes=require('../routes/savingGoal.routes')
const cookiesParser= require('cookie-parser')
const cors=require('cors')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(cors({origin: process.env.FRONTEND_URL,credentials:true, methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization']}))
app.use(cookiesParser())
app.use('/api',authRoutes)
app.use('/api',incomeRoutes)
app.use('/api',expenseRoutes)
app.use('/api',vencimientoRoutes)
app.use('/api',savingGoalRoutes)

module.exports = app