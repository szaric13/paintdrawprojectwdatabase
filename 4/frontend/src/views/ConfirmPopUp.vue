<template>
  <teleport to="body">
    <div v-if="visible" class="popup-overlay" @click.self="close">
      <div class="popup">
        <h3>Confirm Save</h3>
        <p>Do you sure you want to save this drawing?</p>
        <div class="popup-buttons">
          <button @click="confirmSave" class="confirm-button">Yes</button>
          <button @click="close" class="cancel-button">No</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PopupConfirm',
  props: {
    onConfirm: Function, 
    visible: Boolean, 
  },
  setup(props) {
    const close = () => {
      
      if (props.onConfirm) props.onConfirm(false);
    };

    const confirmSave = () => {
      if (props.onConfirm) props.onConfirm(true);
    };

    return {
      close,
      confirmSave,
    };
  },
});
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; 
}

.popup {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: black; 
}

.popup h3,
.popup p {
  color: black; 
}

.popup-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.popup button {
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  color: black; 
}

.confirm-button {
  background-color: #28a745;
  color: white;
}

.confirm-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}
</style>
