import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.DEV
        ? import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:3001/api'
        : import.meta.env.VITE_API_URL,
    withCredentials: true,
})

export default instance