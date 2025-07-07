<script>
  import { onMount, onDestroy } from 'svelte';
  import MultiChat from './components/MultiChat.svelte';
  import ToastContainer from './components/ToastContainer.svelte';
  import { initAuthStore, destroyAuthStore } from './stores/auth.js';

  onMount(() => {
    initAuthStore();
  });

  onDestroy(() => {
    destroyAuthStore();
  });
</script>

<main class="chat-app">
  <MultiChat />
</main>

<ToastContainer />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    color: #333;
    background-color: #fafafa;
    overflow: hidden;
  }
  
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }
  
  :global(h1, h2, h3, h4, h5, h6) {
    margin-top: 0;
    line-height: 1.2;
  }
  
  :global(p) {
    line-height: 1.6;
  }
  
  :global(a) {
    color: #4361ee;
    text-decoration: none;
  }
  
  :global(a:hover) {
    text-decoration: underline;
  }
  
  :global(button) {
    cursor: pointer;
  }

  .chat-app {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
</style>