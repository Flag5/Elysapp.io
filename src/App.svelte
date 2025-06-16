<script>
  import { onMount, onDestroy } from 'svelte';
  import Header from './components/Header.svelte';
  import Hero from './components/Hero.svelte';
  import Features from './components/Features.svelte';
  import Privacy from './components/Privacy.svelte';
  import Security from './components/Security.svelte';
  import Footer from './components/Footer.svelte';
  import Chat from './components/Chat.svelte';
  import { initAuthStore, destroyAuthStore } from './stores/auth.js';

  onMount(() => {
    initAuthStore();
  });

  onDestroy(() => {
    destroyAuthStore();
  });
</script>

<main>
  <Header />
  <Hero />
  <Features />
  <Privacy />
  <Security />
  <Footer />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    color: #333;
    background-color: #fafafa;
    overflow-x: hidden;
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
  
  :global(section) {
    padding: 5rem 2rem;
  }
  
  :global(.container) {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  main {
    position: relative;
  }
</style>