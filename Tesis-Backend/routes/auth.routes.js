const router =require('express').Router()
const {register,login,logout,profile}=require('../controllers/auth.controller')
const authRequired= require('../middlewares/validateToken')

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/profile',authRequired,profile)

module.exports=router
