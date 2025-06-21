<script>
  import { toasts, removeToast } from '../stores/toast.js';
  import Toast from './Toast.svelte';
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <Toast 
      message={toast.message} 
      type={toast.type} 
      duration={toast.duration}
      onClose={() => removeToast(toast.id)}
    />
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: none;
  }
  
  .toast-container :global(.toast) {
    pointer-events: auto;
  }
  
  @media (max-width: 480px) {
    .toast-container {
      left: 20px;
      right: 20px;
    }
  }
</style>