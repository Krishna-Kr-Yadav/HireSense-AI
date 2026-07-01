import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})

  export async function register({username,email,password}){
    try{
        const response =await api.post("/api/auth/register",{
            username, email, password
        })
        return response.data
    }catch(err){
        console.error("Registration error:", err.response?.data || err.message)
        throw err
    }

  }

  export async function login({email,password}) {
    try{
        const response = await api.post("/api/auth/login",{
            email, password
        })

        return response.data
    }catch(err){
        console.log("Status:", err.response?.status)
        console.log("Data:", err.response?.data)
        throw err
        // console.log(err)
    }


  }

  export async function logout(){
    try{
        const response = await api.get("/api/auth/logout")
        return response.data
    }catch(err){
        console.error("Logout error:", err.response?.data || err.message)
        throw err
    }
  }

  export async function getMe() {
    try{
        const response = await api.get("/api/auth/get-me")
        return response.data
    }catch(err){
        // If not authenticated (401), return null instead of throwing
        if(err.response?.status === 401){
            console.log("User not authenticated")
            return { user: null }
        }
        console.error("GetMe error:", err.response?.data || err.message)
        throw err
    }
  }