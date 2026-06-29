import axios from "./axios";


const getAll=async()=>{

        const request= await axios.get(`/income`)
        return request.data

}
const create=async(income)=>{
        const request= await axios.post('/income',income)
        return request.data

}
const deleteData= async(income)=>{
        const request = await axios.delete(`/income/${income}`)
        return request.data
}


export default {getAll,create,deleteData,}