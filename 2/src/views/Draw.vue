<template>
    <div>
      <h1>Draw</h1>
      <div class="toolbar">
        <input type="color" v-model="selectedColor" />
        <button @click="clearCanvas">Clear</button>
      </div>
      <div class="canvas">
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
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'Draw',
    setup() {
      const grid = ref(Array.from({ length: 30 }, () => Array(30).fill('#ffffff')));
      const selectedColor = ref('#000000');
  
      const paintPixel = (row: number, col: number) => {
        grid.value[row][col] = selectedColor.value;
      };
  
      const clearCanvas = () => {
        grid.value = grid.value.map(row => row.map(() => '#ffffff'));
      };
  
      return {
        grid,
        selectedColor,
        paintPixel,
        clearCanvas,
      };
    },
  });
  </script>
  
  <style>
  .canvas {
    display: grid;
    gap: 1px;
    background-color: #ccc;
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
  }
  
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between; 
    background-color: #333; 
    padding: 10px 20px; 
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  }
  
  .toolbar input[type="color"] {
    border: none;
    width: 40px;
    height: 40px;
    cursor: pointer;
    padding: 0;
    background: none;
    margin-right: 10px;
  }
  
  .toolbar button {
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .toolbar button:hover {
    background-color: #0056b3;
  }
  
  .toolbar button:active {
    background-color: #004085;
  }
  
  
  </style>
  