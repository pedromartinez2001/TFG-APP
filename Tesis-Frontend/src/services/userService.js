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

const loginWithGoogle = async (credential) => {
    try {
        return await axios.post(`/login-google`, credential)
    } catch (error) {
        console.error("Error en loginWithGoogle:", error)
        throw error
    }
}

const profileUser = async () => {
    return await axios.get(`/profile`)
}

const logoutUser = async () => {
    return await axios.post(`/logout`)
}

export default {registerUser,loginUser,loginWithGoogle,profileUser,logoutUser}