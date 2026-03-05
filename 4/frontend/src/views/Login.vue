<template>
  <div class="auth-container">
    <h1 class="auth-title">Login</h1>
    <form @submit.prevent="submitLogin" class="auth-form">
      <div class="input-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Enter your username"
          required
          minlength="2"
          maxlength="32"
        />
        <span v-if="username && username.length < 2" class="error">Username must be between 2 and 32 characters.</span>
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          required
          minlength="8"
          maxlength="128"
        />
        <span v-if="password && password.length < 8" class="error">Password must be between 8 and 128 characters.</span>
      </div>
      <button type="submit" class="auth-button" :disabled="!isFormValid">Login</button>
      <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
    </form>
    <p class="auth-switch">
      Don't have an account? <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const isFormValid = computed(() => {
      return (
        username.value.length >= 2 &&
        username.value.length <= 32 &&
        password.value.length >= 8 &&
        password.value.length <= 128
      );
    });

    const submitLogin = async () => {
      errorMessage.value = '';
      try {
   
        authStore.login(username.value, password.value);

        router.push('/');
      } catch (error: any) {

        errorMessage.value = error.message || 'Login failed';
      }
    };

    return {
      username,
      password,
      errorMessage,
      isFormValid,
      submitLogin,
    };
  },
});
</script>

<style scoped>

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f7fa;
}

.auth-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  font-size: 1rem;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
  background-color: #f9f9f9;
}

.error {
  font-size: 0.875rem;
  color: #e74c3c;
  margin-top: 5px;
}

.auth-button {
  width: 100%;
  padding: 12px;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #0056b3;
}

.auth-button:active {
  background-color: #003f7f;
}

.auth-button:disabled {
  background-color: #b0d5f5;
  cursor: not-allowed;
}

.auth-switch {
  text-align: center;
  margin-top: 15px;
}

.auth-switch a {
  color: #007bff;
  text-decoration: none;
}

.auth-switch a:hover {
  text-decoration: underline;
}
</style>
