import axios from "axios";

// axios instance
export const axiosClient = axios.create({
    baseURL:'http://127.0.0.1:8000/api',
    timeout:1000,
    withCredentials:true
})



axiosClient.interceptors.response.use(
    (response) => {
        return response.data
    },
    async (error) => {
        const originalRequest = error.config;
        const isRefreshRequest = originalRequest.url === "/auth/refresh"

        // network error
        if(!error.response){
            console.log("Network Error")
            return Promise.reject(error)
        }

        // retry when token 401 error comes in reponse while avoid retries on refresh token endpoint
        if(error.response.state === 401 && !originalReq._retry && !isRefreshRequest ){
            originalReq._retry = true

            try{
                await axiosClient.post("/auth/refresh")
                return axiosClient(originalReq)
            }
            catch(refreshError){
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error);
    }
)


