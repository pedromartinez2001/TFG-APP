import axios from "./axios";



const getAll=async()=>{
    const request= await axios.get(`/expense`)
    return request.data
}
const create=async(expense)=>{
    const request= await axios.post('/expense',expense)
    return request.data
}
const deleteData= async(expense)=>{
    const request = await axios.delete(`/expense/${expense}`)
    return request.data
}



export default {getAll,create,deleteData,}