/* 
This file contain backend API endpoints 
Account Creation,
Login
Logout
CurrentUser
*/

import { api } from "../api/client/request"
import { AUTH_ENDPOINTS } from "../api/endpoints/authEndpoints"
export const authService = {

    // LOGIN
    login(credentials){
        return api.post(
            AUTH_ENDPOINTS.LOGIN,
            credentials
        )
    },
   

    // REGISTER
    register(payload){
        return api.post(
            AUTH_ENDPOINTS.REGISTER,
            payload
        )
    },

    // REGISTRATION VERIFICATION
    accountVerification(token){
        return api.post(
            `${AUTH_ENDPOINTS.VERIFY_REGISTRATION}?token=${token}`
        )
    },

    // Resend Verification Link
    resendVerificationLink(email){
        return api.post(
            `${AUTH_ENDPOINTS.RESEND_VERIFICATION_LINK}?email=${email}`
        )
    },
    
    // CURRENT USER
    currentUser(){
        return api.get(
            AUTH_ENDPOINTS.ME,
            token
        )
    },

    // LOGOUT
    logoutUser(){
        return api.post(
            AUTH_ENDPOINTS.LOGOUT
        )
    }

}