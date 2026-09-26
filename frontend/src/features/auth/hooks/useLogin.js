import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { authService } from '../../../services/authService'

export const useLogin = () => {
    return useMutation({
        mutationFn: (payload) => authService.login(payload)
    })
}
