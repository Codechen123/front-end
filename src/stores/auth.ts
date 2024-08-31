import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<any>(null);
  const router = useRouter();

  const login = async (userPhoneNumber: string, password: string) => {
    try {
      const response = await axios.post('http://192.168.69.10:5000/start/login', { userPhoneNumber, password });
      if (response.data.code === 0) {
        // token.value = response.data.token;
        // localStorage.setItem('token', response.data.token);
        // await fetchUser();
        router.push('/home');
      } else {
        throw new Error(response.data.message || '登录失败');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    router.push('/login');
  };

  const fetchUser = async () => {
    if (!token.value) return;
    try {
      const response = await axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      user.value = response.data;
    } catch (error) {
      console.error('获取用户信息失败', error);
      logout();
    }
  };

  return { token, user, login, logout, fetchUser };
});
