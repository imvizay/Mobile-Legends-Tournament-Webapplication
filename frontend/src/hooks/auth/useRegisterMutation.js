import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn : (payload) => authService.register(payload)
    })
}


export const useRegistrationVerification = () => {
    return useMutation({
        mutationFn : (token) => authService.accountVerification(token)
    })
}

export const useResendVerification =  () =>{
    return useMutation({
        mutationFn: (email) => authService.resendVerificationLink(email)
    })
}