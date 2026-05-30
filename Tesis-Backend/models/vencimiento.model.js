const mongoose = require('mongoose');

const vencimientoSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true
    },
    fechaVencimiento: {
        type: String, // o Date, pero como es string en frontend
        required: true
    },
    esCuotaFija: {
        type: Boolean,
        default: false
    },
    cantidadTotalCuotas: {
        type: Number,
        default: null
    },
    montoCuota: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        enum: ['necesidades', 'deseos', 'ahorro_deudas'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expenseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
        default: null
    },
    completado: {
        type: Boolean,
        default: false
    },
    pagosRealizados: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vencimiento', vencimientoSchema);