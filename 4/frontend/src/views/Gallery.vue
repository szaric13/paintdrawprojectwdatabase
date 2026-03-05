<template>
  <div class="gallery">
    <h1>Gallery</h1>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="!loading && pictures.length === 0" class="no-pictures">
      No drawings available.
    </div>

    <div v-else class="pictures">
      <div
        v-for="picture in pictures"
        :key="picture.picture_id"
        class="picture-card"
      >
        <div class="picture-display" @click="goToDrawPage(picture.picture_id)">
          <div class="picture-grid">
            <div
              v-for="(row, rowIndex) in picture.picture_data"
              :key="rowIndex"
              class="picture-row"
            >
              <div
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                :style="{ backgroundColor: cell }"
                class="picture-cell"
              ></div>
            </div>
          </div>
        </div>
        <div class="picture-info">
          <h3>{{ picture.name }}</h3>
          <p>
            By: 
            <span @click.stop="filterByAuthor(picture.author.username)">
              {{ picture.author.username }}
            </span>
          </p>
          <p>Created at: {{ new Date(picture.created_at).toLocaleString() }}</p>
        </div>
      </div>
    </div>

    
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }}</span>
      <button @click="nextPage" :disabled="pictures.length < limit">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Gallery',
  setup() {
    const authStore = useAuthStore();
    const pictures = ref([]);
    const currentPage = ref(1);
    const limit = ref(10); 
    const loading = ref(false);
    const router = useRouter();

    const fetchPictures = async () => {
      try {
        loading.value = true;
        const response = await authStore.getPictures(currentPage.value, limit.value);
        if (response) {
          pictures.value = response.pictures;
        }
      } catch (err) {
        console.error('Error fetching pictures:', err);
      } finally {
        loading.value = false;
      }
    };

    const nextPage = () => {
      currentPage.value++;
      fetchPictures();
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchPictures();
      }
    };

    const goToDrawPage = (pictureId: number) => {
      router.push({ name: 'Draw', params: { pictureId } });
    };

    const filterByAuthor = (author: string) => {
      router.push({ name: 'Gallery', query: { author } });
    };

    onMounted(() => {
      fetchPictures();
    });

    return {
      pictures,
      currentPage,
      limit,
      nextPage,
      previousPage,
      loading,
      goToDrawPage,
      filterByAuthor,
    };
  },
});
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  padding: 20px;
}

.gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #444;
  margin-bottom: 20px;
}


.pictures {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.picture-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.picture-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}


.picture-display {
  width: 100%;
  padding: 10px;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.picture-display:hover {
  transform: scale(1.05);
}

.picture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20px, 1fr));
  gap: 1px;
  padding: 0;
}

.picture-row {
  display: flex;
}

.picture-cell {
  width: 20px;
  height: 20px;
  transition: background-color 0.3s ease;
}


.picture-info {
  padding: 15px;
  background-color: #f9f9f9;
  text-align: center;
  font-size: 0.9rem;
}

.picture-info h3 {
  font-size: 1.2rem;
  margin: 0 0 10px;
  color: #444;
}

.picture-info p {
  color: #777;
  margin: 5px 0;
}


.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin: 0 10px;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination span {
  font-size: 1rem;
  color: #555;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #007bff;
  padding: 20px 0;
}

.loading::after {
  content: '...';
  animation: loading 1s infinite steps(1, end);
}

@keyframes loading {
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
}

.no-pictures {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
}
</style>
