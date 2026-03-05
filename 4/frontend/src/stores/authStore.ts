import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'vue-router';

const API_BASE_URL = 'http://localhost:3000/api';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const token = ref<string | null>(localStorage.getItem('token') || null);
  const username = ref<string | null>(localStorage.getItem('username') || null);
  const userId = ref<string | null>(localStorage.getItem('user_id') || null);
  const error = ref<string | null>(null);

  const setAuthDetails = (authToken: string, user: string, id: string) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('username', user);
    localStorage.setItem('user_id', id);
    token.value = authToken;
    username.value = user;
    userId.value = id;
  };

  const login = async (user: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: user,
        password,
      });

      setAuthDetails(response.data.token, response.data.username, response.data.user_id);
      router.push('/'); // Redirect after successful login
    } catch (err) {
      handleError(err);
    }
  };

  const createPicture = async (name: string, pictureData: string[][]) => {
    try {
      if (!name || !Array.isArray(pictureData) || pictureData.length === 0) {
        throw new Error('Invalid picture data format.');
      }

      const response = await axios.post(
        `${API_BASE_URL}/pictures/`,
        { name, picture_data: pictureData },
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
      console.log('Picture saved successfully:', response.data);
      return response.data.picture_id;
    } catch (err) {
      handleError(err);
    }
  };

  const getPictures = async (page = 1, limit = 10, authorId?: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pictures/`, {
        params: { page, limit, author: authorId || undefined },
      });
      return response.data;
    } catch (err) {
      handleError(err);
    }
  };

  const register = async (user: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username: user,
        password,
      });
      alert('Registration successful!');
    } catch (err) {
      handleError(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    token.value = null;
    username.value = null;
    userId.value = null;
    router.push('/login'); 
  };

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    const savedUserId = localStorage.getItem('user_id');

    if (savedToken && savedUsername && savedUserId) {
      token.value = savedToken;
      username.value = savedUsername;
      userId.value = savedUserId;
    } else {
      logout();
    }
  };

  const isAuthenticated = computed(() => !!token.value);

  const handleError = (err: unknown) => {
    if (err instanceof AxiosError && err.response) {
      const errorCode = err.response.data.code;
      switch (errorCode) {
        case 'INCORRECT_CREDENTIALS':
          alert('Incorrect username or password!');
          break;
        case 'DUPLICATE_USERNAME':
          alert('Username is already taken!');
          break;
        case 'NOT_AUTHENTICATED':
          alert('You must be logged in to perform this action.');
          break;
        case 'INVALID_DATA':
          alert('Invalid data provided.');
          break;
        case 'BAD_PICTURE_DATA':
          alert('Picture data format is invalid.');
          break;
        default:
          alert('An unknown error occurred.');
          break;
      }
    } else {
      console.error('Unhandled error:', err);
    }
  };

  return {
    token,
    username,
    userId,
    error,
    login,
    register,
    logout,
    initializeAuth,
    isAuthenticated,
    createPicture,
    getPictures,
  };
});
