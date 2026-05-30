const Vencimiento = require('../models/vencimiento.model')
const Expense = require('../models/expense.model')

const crearExpenseDesdeVencimiento = async ({ categoria, montoCuota, descripcion, fechaVencimiento, user }) => {
    const newExpense = new Expense({
        category: categoria,
        amount: montoCuota,
        description: `${descripcion} (Cuota)`,
        date: new Date(fechaVencimiento),
        user
    })

    return await newExpense.save()
}

const sumarUnMes = (fechaVencimiento) => {
    const fecha = new Date(fechaVencimiento)
    fecha.setMonth(fecha.getMonth() + 1)
    return fecha.toISOString().split('T')[0]
}

const getVencimientos = async (req, res) => {
    const vencimientos = await Vencimiento.find({ user: req.user.id }).populate('user')
    res.json(vencimientos)
}

const getVencimiento = async (req, res) => {
    const vencimiento = await Vencimiento.findById(req.params.id)
    if (!vencimiento) return res.status(404).json({ message: 'Vencimiento no existe' })
    res.json(vencimiento)
}

const createVencimiento = async (req, res) => {
    const { descripcion, fechaVencimiento, esCuotaFija, cantidadTotalCuotas, montoCuota, categoria } = req.body

    const savedExpense = await crearExpenseDesdeVencimiento({
        categoria,
        montoCuota,
        descripcion,
        fechaVencimiento,
        user: req.user.id
    })
    
    const newVencimiento = new Vencimiento({
        descripcion,
        fechaVencimiento,
        esCuotaFija,
        cantidadTotalCuotas,
        montoCuota,
        categoria,
        user: req.user.id,
        expenseId: savedExpense._id
    })
    const savedVencimiento = await newVencimiento.save()
    res.json(savedVencimiento)
}

const deleteVencimiento = async (req, res) => {
    const vencimiento = await Vencimiento.findByIdAndDelete(req.params.id)
    if (!vencimiento) return res.status(404).json({ message: 'Vencimiento no existe' })
    
    // Eliminar gasto asociado si existe
    if (vencimiento.expenseId) {
        await Expense.findByIdAndDelete(vencimiento.expenseId)
    }
    res.json(vencimiento)
}

const updateVencimiento = async (req, res) => {
    const vencimiento = await Vencimiento.findById(req.params.id)
    if (!vencimiento) return res.status(404).json({ message: 'Vencimiento no existe' })

    if (req.body.pagado) {
        vencimiento.pagosRealizados += 1

        if (vencimiento.esCuotaFija) {
            vencimiento.fechaVencimiento = sumarUnMes(vencimiento.fechaVencimiento)
            const savedExpense = await crearExpenseDesdeVencimiento({
                categoria: vencimiento.categoria,
                montoCuota: vencimiento.montoCuota,
                descripcion: vencimiento.descripcion,
                fechaVencimiento: vencimiento.fechaVencimiento,
                user: vencimiento.user
            })
            vencimiento.expenseId = savedExpense._id
        } else {
            vencimiento.cantidadTotalCuotas -= 1
            vencimiento.fechaVencimiento = sumarUnMes(vencimiento.fechaVencimiento)

            if (vencimiento.cantidadTotalCuotas <= 0) {
                vencimiento.completado = true
            } else {
                const savedExpense = await crearExpenseDesdeVencimiento({
                    categoria: vencimiento.categoria,
                    montoCuota: vencimiento.montoCuota,
                    descripcion: vencimiento.descripcion,
                    fechaVencimiento: vencimiento.fechaVencimiento,
                    user: vencimiento.user
                })
                vencimiento.expenseId = savedExpense._id
            }
        }
    } else {
        const camposPermitidos = [
            'descripcion',
            'fechaVencimiento',
            'esCuotaFija',
            'cantidadTotalCuotas',
            'montoCuota',
            'categoria',
            'completado'
        ]

        camposPermitidos.forEach((campo) => {
            if (req.body[campo] !== undefined) {
                vencimiento[campo] = req.body[campo]
            }
        })
    }

    const updatedVencimiento = await vencimiento.save()
    res.json(updatedVencimiento)
}

module.exports = { getVencimiento, getVencimientos, createVencimiento, deleteVencimiento, updateVencimiento }