const SavingGoal = require('../models/savingGoal.model')

const getSavingGoals = async (req, res) => {
    const savingGoals = await SavingGoal.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(savingGoals)
}

const createSavingGoal = async (req, res) => {
    const { nombre, montoObjetivo, plazoMeses } = req.body

    const newSavingGoal = new SavingGoal({
        nombre,
        montoObjetivo,
        plazoMeses,
        user: req.user.id
    })

    const savedSavingGoal = await newSavingGoal.save()
    res.json(savedSavingGoal)
}

const updateSavingGoal = async (req, res) => {
    const savingGoal = await SavingGoal.findOne({ _id: req.params.id, user: req.user.id })
    if (!savingGoal) return res.status(404).json({ message: 'Meta de ahorro no existe' })

    if (req.body.amountToAdd !== undefined) {
        savingGoal.montoAhorrado += Number(req.body.amountToAdd)
    }

    if (req.body.nombre !== undefined) savingGoal.nombre = req.body.nombre
    if (req.body.montoObjetivo !== undefined) savingGoal.montoObjetivo = Number(req.body.montoObjetivo)
    if (req.body.plazoMeses !== undefined) savingGoal.plazoMeses = Number(req.body.plazoMeses)
    if (req.body.fechaInicio !== undefined) savingGoal.fechaInicio = req.body.fechaInicio

    if (savingGoal.montoAhorrado < 0) {
        savingGoal.montoAhorrado = 0
    }

    savingGoal.completada = savingGoal.montoAhorrado >= savingGoal.montoObjetivo

    const updatedSavingGoal = await savingGoal.save()
    res.json(updatedSavingGoal)
}

const deleteSavingGoal = async (req, res) => {
    const savingGoal = await SavingGoal.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!savingGoal) return res.status(404).json({ message: 'Meta de ahorro no existe' })
    res.json(savingGoal)
}

module.exports = { getSavingGoals, createSavingGoal, updateSavingGoal, deleteSavingGoal }