import axios from './axios'


const registerUser =async(user)=>{
    try {
        return await axios.post(`/register`,user)
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
const loginUser =async(user)=>{
    try {
        return await axios.post(`/login`,user)
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error; 
    }
}

const profileUser = async () => {
    try {
        return await axios.get(`/profile`)
    } catch (error) {
        throw error;
    }
}

const logoutUser = async () => {
    try {
        return await axios.post(`/logout`)
    } catch (error) {
        throw error;
    }
}

export default {registerUser,loginUser,profileUser,logoutUser}