<script>
  import { onMount } from 'svelte';
  
  export let message = '';
  export let type = 'success'; // success, error, info
  export let duration = 4000;
  export let onClose = () => {};
  
  let visible = false;
  
  onMount(() => {
    visible = true;
    
    const timer = setTimeout(() => {
      visible = false;
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);
    
    return () => clearTimeout(timer);
  });
</script>

{#if visible}
  <div class="toast toast-{type}" class:visible>
    <div class="toast-content">
      {#if type === 'success'}
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      {:else if type === 'error'}
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      {:else}
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 1.667A8.333 8.333 0 1 0 18.333 10A8.333 8.333 0 0 0 10 1.667zM10 15v-5M10 6.667h.008" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      {/if}
      <span class="toast-message">{message}</span>
    </div>
    <button class="toast-close" on:click={() => { visible = false; setTimeout(onClose, 300); }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e1e5e9;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 300px;
    max-width: 400px;
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  }
  
  .toast.visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  .toast-success {
    border-left: 4px solid #10b981;
  }
  
  .toast-error {
    border-left: 4px solid #ef4444;
  }
  
  .toast-info {
    border-left: 4px solid #3b82f6;
  }
  
  .toast-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }
  
  .toast-icon {
    flex-shrink: 0;
  }
  
  .toast-success .toast-icon {
    color: #10b981;
  }
  
  .toast-error .toast-icon {
    color: #ef4444;
  }
  
  .toast-info .toast-icon {
    color: #3b82f6;
  }
  
  .toast-message {
    color: #374151;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .toast-close {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: color 0.2s ease;
    flex-shrink: 0;
  }
  
  .toast-close:hover {
    color: #6b7280;
  }
  
  @media (max-width: 480px) {
    .toast {
      left: 20px;
      right: 20px;
      min-width: auto;
      max-width: none;
    }
  }
</style>