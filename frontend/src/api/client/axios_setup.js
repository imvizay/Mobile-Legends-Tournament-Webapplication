import axios from "axios";

/* ---------------------- 
    AXIOS INSTANCE
 -------------------- */
export const axiosClient = axios.create({
    baseURL:'http://127.0.0.1:8000/api',
    timeout:1000,
    withCredentials:true
})


/* -------------------------------
    REQ AND RES INTERCEPTORS
----------------------------------- */

axiosClient.interceptors.response.use(
    
    (response) => {
        return response.data
    }
)


