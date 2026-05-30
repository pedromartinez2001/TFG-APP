const router = require('express').Router();
const authRequired = require('../middlewares/validateToken');
const {
    getVencimientos,
    createVencimiento,
    deleteVencimiento,
    updateVencimiento
} = require('../controllers/vencimiento.controller');

router.get('/vencimiento', authRequired, getVencimientos);
router.post('/vencimiento', authRequired, createVencimiento);
router.delete('/vencimiento/:id', authRequired, deleteVencimiento);
router.put('/vencimiento/:id', authRequired, updateVencimiento);

module.exports = router;