const mongoose = require('mongoose')

const savingGoalSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    montoObjetivo: {
        type: Number,
        required: true,
        min: 1
    },
    plazoMeses: {
        type: Number,
        required: true,
        min: 1
    },
    montoAhorrado: {
        type: Number,
        default: 0,
        min: 0
    },
    fechaInicio: {
        type: Date,
        default: Date.now
    },
    completada: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('SavingGoal', savingGoalSchema)