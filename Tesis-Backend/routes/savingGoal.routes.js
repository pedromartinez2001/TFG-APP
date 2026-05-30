const router = require('express').Router()
const authRequired = require('../middlewares/validateToken')
const {
    getSavingGoals,
    createSavingGoal,
    updateSavingGoal,
    deleteSavingGoal
} = require('../controllers/savingGoal.controller')

router.get('/saving-goal', authRequired, getSavingGoals)
router.post('/saving-goal', authRequired, createSavingGoal)
router.put('/saving-goal/:id', authRequired, updateSavingGoal)
router.delete('/saving-goal/:id', authRequired, deleteSavingGoal)

module.exports = router