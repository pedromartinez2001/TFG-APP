import axios from "./axios";

const getAll = async () => {
    const request = await axios.get(`/vencimiento`)
    return request.data
}
const create = async (vencimiento) => {
    const request = await axios.post('/vencimiento', vencimiento)
    return request.data
}
const deleteData = async (id) => {
    const request = await axios.delete(`/vencimiento/${id}`)
    return request.data
}
const update = async (id, data) => {
    const request = await axios.put(`/vencimiento/${id}`, data)
    return request.data
}

export default { getAll, create, deleteData, update }