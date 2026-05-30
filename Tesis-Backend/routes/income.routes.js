const router= require('express').Router()
const authRequired= require('../middlewares/validateToken')
const {getIncome,getIncomes,createIncome,deleteIncome,updateIncome}= require('../controllers/income.controller')

router.get('/income',authRequired,getIncomes)
router.get('/income/:id',authRequired,getIncome)
router.post('/income',authRequired,createIncome)
router.delete('/income/:id',authRequired,deleteIncome)
router.put('/income/:id',authRequired,updateIncome)


module.exports=router