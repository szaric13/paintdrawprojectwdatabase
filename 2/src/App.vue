<template>
  <div id="app">
    <nav class="navbar">
      <h1 class="app-title">Pixel Art Editor</h1>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/gallery">Gallery</router-link></li>
        <li><router-link to="/draw">Draw</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
      </ul>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>

</script>

<style>


#app {
  font-family: Arial, sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center; 
  min-height: inherit;
  min-width: 1920px;
  background-color: #f4f4f9;
  margin: 0;
  padding: 0;
  width: 100%;
}


.navbar {
  width: 100%;
  max-width: 1920px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #333;
  padding: 15px 20px;
  color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto; 
}


.app-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #ffcc00;
}


.nav-links {
  list-style: none;
  display: flex;
  gap: 15px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 4px;
}

.nav-links a:hover {
  background-color: #444;
  color: #ffcc00;
}


.main-content {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin: 20px auto;
}


</style>
