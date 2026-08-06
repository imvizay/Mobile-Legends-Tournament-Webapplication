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

        console.log("Interceptor Reached")
        
        console.log("URL:", originalRequest.url);
        console.log("Is Refresh:", isRefreshRequest);

       if(error.response?.status === 404){
        console.log(`ERROR 404 NOT FOUND AT ${originalRequest.url}`)
        return
       }

        // network error
        if(!error.response){
            console.log("Network Error")
            return Promise.reject(error)
        }

        // retry when token 401 error comes in reponse while avoid retries on refresh token endpoint
        if(error.response.status === 401 && !originalRequest._retry && !isRefreshRequest ){

            console.log("Token Error")
            console.log(error.code);
            console.log(error.message);
            console.log(error.response);
            console.log(error.request);

            originalRequest._retry = true

            try{
                await axiosClient.post("/auth/refresh")
                return axiosClient(originalRequest)
            }
            catch(refreshError){
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error);

    }
)


