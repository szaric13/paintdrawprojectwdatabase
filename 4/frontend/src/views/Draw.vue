<template>
  <div>
    <h1>Draw</h1>
    <div class="toolbar">
      <input type="color" v-model="selectedColor" />
      <div class="canvas-size">
        <button @click="resizeCanvas('up')" class="resize-button">&#x25B2;</button> 
        <input
          type="number"
          v-model.number="canvasSize"
          @change="resizeCanvas('input')"
          min="1"
          max="24"
          class="canvas-size-input"
        />
        <button @click="resizeCanvas('down')" class="resize-button">&#x25BC;</button> 
      </div>
      <button @click="clearCanvas">Clear</button>
    </div>

    <div
      class="canvas"
      @mousedown="startDrawing"
      @mousemove="drawPixel"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
    >
      <div
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
        class="row"
      >
        <div
          v-for="(pixel, colIndex) in row"
          :key="colIndex"
          :style="{ backgroundColor: pixel }"
          class="pixel"
          @click="paintPixel(rowIndex, colIndex)"
          :data-row="rowIndex"
          :data-col="colIndex"
        ></div>
      </div>
    </div>

    <div class="save-container">
      <input
        v-model="drawingName"
        type="text"
        placeholder="Enter drawing name"
        class="drawing-name-input"
        required
      />
      <button @click="showConfirmPopup" class="save-button" :disabled="!drawingName">Save Drawing</button>
    </div>

    <p v-if="saveStatus" :class="saveStatus === 'success' ? 'success' : 'error'">
      {{ saveMessage }}
    </p>

    <ConfirmPopup
      :visible="showConfirm"
      :onConfirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import ConfirmPopup from './ConfirmPopup.vue'; 

export default defineComponent({
  name: 'Draw',
  components: {
    ConfirmPopup, 
  },
  setup() {
    const authStore = useAuthStore();
    const grid = ref(Array.from({ length: 24 }, () => Array(24).fill('#ffffff')));
    const selectedColor = ref('#000000');
    const canvasSize = ref(24);
    const drawingName = ref('');
    const isDrawing = ref(false);
    const saveStatus = ref<string | null>(null);
    const saveMessage = ref<string>('');
    const showConfirm = ref(false);

    const paintPixel = (row: number, col: number) => {
      grid.value[row][col] = selectedColor.value;
    };

    const clearCanvas = () => {
      grid.value = grid.value.map(row => row.map(() => '#ffffff'));
    };

    const resizeCanvas = (action: string) => {
      if (action === 'up' && canvasSize.value < 24) {
        canvasSize.value++;
      } else if (action === 'down' && canvasSize.value > 1) {
        canvasSize.value--;
      }

      const newGrid = Array.from({ length: canvasSize.value }, () => 
        Array(canvasSize.value).fill('#ffffff')
      );

      for (let i = 0; i < Math.min(grid.value.length, newGrid.length); i++) {
        for (let j = 0; j < Math.min(grid.value[i].length, newGrid[i].length); j++) {
          newGrid[i][j] = grid.value[i][j];
        }
      }

      grid.value = newGrid;
    };

    const startDrawing = (event: MouseEvent) => {
      isDrawing.value = true;
      const pixel = (event.target as HTMLElement).closest('.pixel');
      if (pixel) {
        const rowIndex = parseInt(pixel.getAttribute('data-row') || '0');
        const colIndex = parseInt(pixel.getAttribute('data-col') || '0');
        paintPixel(rowIndex, colIndex);
      }
    };

    const drawPixel = (event: MouseEvent) => {
      if (!isDrawing.value) return;
      const pixel = (event.target as HTMLElement).closest('.pixel');
      if (pixel) {
        const rowIndex = parseInt(pixel.getAttribute('data-row') || '0');
        const colIndex = parseInt(pixel.getAttribute('data-col') || '0');
        paintPixel(rowIndex, colIndex);
      }
    };

    const stopDrawing = () => {
      isDrawing.value = false;
    };

    
    const showConfirmPopup = () => {
      showConfirm.value = true;
    };

    
    const handleConfirm = (confirmed: boolean) => {
      if (confirmed) {
        saveDrawing(); 
      }
      showConfirm.value = false; 
    };

    
    const saveDrawing = async () => {
      if (!authStore.token) {
        saveStatus.value = 'error';
        saveMessage.value = 'You must be logged in to save drawings.';
        return;
      }

      const drawingData = grid.value;

      try {
        const response = await fetch('https://raf-pixeldraw.aarsen.me/api/pictures', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({
            name: drawingName.value,
            picture_data: drawingData,
          }),
        });

        const result = await response.json();

        if (!result.failed) {
          saveStatus.value = 'success';
          saveMessage.value = 'Drawing saved successfully!';
        } else {
          saveStatus.value = 'error';
          saveMessage.value = `Failed to save drawing: ${result.code}`;
        }
      } catch (error) {
        saveStatus.value = 'error';
        saveMessage.value = 'An error occurred while saving.';
      }
    };

    return {
      grid,
      selectedColor,
      canvasSize,
      drawingName,
      paintPixel,
      clearCanvas,
      resizeCanvas,
      startDrawing,
      drawPixel,
      stopDrawing,
      saveDrawing,
      saveStatus,
      saveMessage,
      showConfirm,
      showConfirmPopup,
      handleConfirm,
    };
  },
});
</script>


<style scoped>

.canvas {
  display: grid;
  gap: 1px;
  background-color: #ccc;
  cursor: crosshair;
}

.row {
  display: flex;
}

.pixel {
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
}


.toolbar {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #333;
}

.toolbar input[type="color"] {
  width: 40px;
  height: 40px;
}

.toolbar button {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.toolbar button:hover {
  background-color: #0056b3;
}

.toolbar button:active {
  background-color: #004085;
}


.canvas-size {
  display: flex;
  align-items: center;
}

.canvas-size-input {
  width: 60px;
  padding: 5px;
  font-size: 16px;
  text-align: center;
}

.resize-button {
  background-color: #4CAF50;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 4px;
}

.resize-button:hover {
  background-color: #45a049;
}

.resize-button:active {
  background-color: #388e3c;
}


.save-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.drawing-name-input {
  padding: 10px;
  font-size: 1rem;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 250px;
}

.save-button {
  padding: 10px;
  font-size: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:disabled {
  background-color: #b0d5f5;
  cursor: not-allowed;
}

.save-button:hover {
  background-color: #218838;
}

.save-button:active {
  background-color: #1e7e34;
}


.success {
  color: green;
  text-align: center;
}

.error {
  color: red;
  text-align: center;
}
</style>
