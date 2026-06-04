import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';

export const useRegisterMutation = (payload) => {
   
    return useMutation({
   
        mutationFn : (payload) => authService.register(payload)
   
    })
}