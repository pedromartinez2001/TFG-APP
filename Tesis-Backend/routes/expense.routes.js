const router= require('express').Router()
const authRequired= require('../middlewares/validateToken')
const {getExpense,getExpenses,createExpense,deleteExpense,updateExpense}= require('../controllers/expense.controller')

router.get('/expense',authRequired,getExpenses)
router.get('/expense/id',authRequired,getExpense)
router.post('/expense',authRequired,createExpense)
router.delete('/expense/:id',authRequired,deleteExpense)
router.put('/expense/:id',authRequired,updateExpense)


module.exports=router