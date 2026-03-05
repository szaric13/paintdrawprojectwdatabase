<template>
  <nav class="navigation">
    <ul>
   
      <li v-if="!isAuthenticated">
        <router-link to="/login">Login</router-link>
      </li>
      <li v-if="!isAuthenticated">
        <router-link to="/register">Register</router-link>
      </li>


      <li v-if="isAuthenticated">
        <router-link to="/">Home</router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link to="/gallery">My Gallery</router-link>
      </li>
      <li v-if="isAuthenticated">
        <router-link to="/draw">Draw</router-link>
      </li>
      <li v-if="isAuthenticated">
        <button @click="logout">Logout</button>
      </li>
    </ul>
  </nav>
</template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'Navigation',
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
  
      const isAuthenticated = authStore.isAuthenticated;
      const username = authStore.username;
      const userId = authStore.userId;
  
      const logout = async () => {
        await authStore.logout();
        router.push({ name: 'Login' });  
      };
  
      return {
        isAuthenticated,
        username,
        userId,
        logout,
      };
    },
  });
  </script>
  
  <style scoped>
  .navigation {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #2c3e50;
  }
  
  .navigation ul {
    display: flex;
    list-style-type: none;
    padding: 0;
  }
  
  .navigation li {
    margin: 0 10px;
  }
  
  .navigation a {
    color: white;
    text-decoration: none;
  }
  
  .navigation button {
    background-color: #e74c3c;
    border: none;
    color: white;
    padding: 8px 16px;
    cursor: pointer;
  }
  
  .navigation button:hover {
    background-color: #c0392b;
  }
  </style>
  