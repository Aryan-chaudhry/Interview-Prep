import axios from 'axios'

export const  axiosInstance = await axios.create({
    baseURL:"http://localhost:8080/api",
    withCredentials:true
})