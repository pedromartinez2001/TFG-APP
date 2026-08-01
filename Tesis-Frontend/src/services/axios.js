import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.DEV
        ? 'http://localhost:3000/api'
        : import.meta.env.VITE_API_URL,
    withCredentials: true,
})

export default instance