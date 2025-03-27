import * as authService from '@/service/authService';
import { useToastStore } from '@/store/useToastStore';
import { useUserStore } from '@/store/useUserStore';

export const useAuth = () => {
    const { setUserInfo } = useUserStore();
    const { addToast } = useToastStore();

    const handleLogin = async ( email: string, password: string ) => {
        try {
            const data = await authService.login( email, password );
            setUserInfo( {
                token: data.token,
                tokenExpiresAt: data.expiresAt,
                userDetails: data.user,
            } );
            addToast( 'success', '로그인 성공!' );
        } catch ( err ) {
            //
        }
    };

    const handleRegister = async ( email: string, password: string ) => {
        try {
            await authService.register( email, password );
            addToast( 'success', '회원가입 성공!' );
        } catch ( err ) {
            //
        }
    };

    return {
        handleLogin,
        handleRegister,
    };
};
