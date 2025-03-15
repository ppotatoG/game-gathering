import {getUsers, registerUser} from '@/services/userService';
import {useUserStore} from '@/store/user';

export const useUser = () => {
  const { setUser } = useUserStore();

  const register = async (email: string, password: string, nickname: string) => {
    try {
      const user = await registerUser();
      setUser({ id: user.uid, email, nickname });
    } catch (error) {
      console.log(error)
      throw new Error(error as string);
    }
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
      return await getUsers();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return { register, fetchUsers };
};
