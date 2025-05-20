<script>
  let scrolled = false;
  
  function handleScroll() {
    scrolled = window.scrollY > 20;
  }
</script>

<svelte:window on:scroll={handleScroll} />

<header class:scrolled>
  <div class="container">
    <div class="logo">
      <img src="/placeholder-logo.svg" alt="Elys Logo" />
      <span>Elys</span>
    </div>
    
    <nav>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#privacy">Privacy</a></li>
        <li><a href="#security">Security</a></li>
      </ul>
    </nav>
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 1rem 0;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  
  header.scrolled {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 0.7rem 0;
  }
  
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 1.5rem;
    color: #4361ee;
  }
  
  .logo img {
    height: 40px;
    margin-right: 0.5rem;
  }
  
  nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  nav li {
    margin: 0 1rem;
  }
  
  nav a {
    color: #333;
    font-weight: 500;
    transition: color 0.2s ease;
  }
  
  nav a:hover {
    color: #4361ee;
    text-decoration: none;
  }
  
  .actions {
    display: flex;
    align-items: center;
  }
  
  .chat-button {
    background-color: #4361ee;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.6rem 1.2rem;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }
  
  .chat-button:hover {
    background-color: #3a56d4;
  }
  
  @media (max-width: 768px) {
    nav {
      display: none;
    }
  }
</style>