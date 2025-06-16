<script>
  import { user, loading } from '../stores/auth.js';
  import { signInWithGoogle, logout } from '../lib/auth.js';
  
  let scrolled = false;
  
  function handleScroll() {
    scrolled = window.scrollY > 20;
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed. Please try again.');
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
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

    <div class="auth-section">
      {#if $loading}
        <div class="loading">Loading...</div>
      {:else if $user}
        <div class="user-info">
          <img src={$user.photoURL} alt="Profile" class="profile-pic" />
          <span class="user-name">{$user.displayName}</span>
          <button class="logout-btn" on:click={handleLogout}>Logout</button>
        </div>
      {:else}
        <button class="google-login-btn" on:click={handleGoogleSignIn}>
          <svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      {/if}
    </div>
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
  
  .auth-section {
    display: flex;
    align-items: center;
  }

  .loading {
    color: #666;
    font-size: 0.9rem;
  }

  .google-login-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: white;
    color: #333;
    border: 1px solid #dadce0;
    border-radius: 4px;
    padding: 0.6rem 1.2rem;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .google-login-btn:hover {
    background-color: #f8f9fa;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .google-icon {
    flex-shrink: 0;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .profile-pic {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-name {
    font-weight: 500;
    color: #333;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logout-btn {
    background-color: #f8f9fa;
    color: #333;
    border: 1px solid #dadce0;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .logout-btn:hover {
    background-color: #e8eaed;
  }
  
  @media (max-width: 768px) {
    nav {
      display: none;
    }

    .user-name {
      display: none;
    }

    .google-login-btn {
      padding: 0.5rem 0.8rem;
      font-size: 0.8rem;
    }

    .logout-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }
  }
</style>