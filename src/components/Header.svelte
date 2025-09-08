<script>
  import { onDestroy } from 'svelte';
  import { user, loading, backendUser } from '../stores/auth.js';
  import { signInWithGoogle, logout } from '../lib/auth.js';
  import { userService } from '../lib/api.js';
  import { addToast } from '../stores/toast.js';
  
  let scrolled = false;
  let showUserMenu = false;
  let currentUser = null;
  
  // Subscribe to backend user for preferences
  const unsubscribeUser = backendUser.subscribe(async user => {
    currentUser = user;
    // User preferences removed
  });
  
  function handleScroll() {
    scrolled = window.scrollY > 20;
  }

  async function handleGoogleSignIn() {
    try {
      console.log('🔘 Login button clicked');
      await signInWithGoogle();
      // Redirect to chat after successful login
      window.location.href = '/chat.html';
    } catch (error) {
      console.error('Sign in failed:', error);
      alert('Sign in failed. Please try again.');
    }
  }

  async function handleLogout() {
    try {
      await logout();
      showUserMenu = false;
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  
  function toggleUserMenu() {
    showUserMenu = !showUserMenu;
  }
  
  function closeUserMenu() {
    showUserMenu = false;
  }
  
  // Beta test functionality removed since preferences system was removed

  // Close menu when clicking outside
  function handleClickOutside(event) {
    if (showUserMenu && !event.target.closest('.user-menu-container')) {
      closeUserMenu();
    }
  }
  
  // Clean up subscription on component destroy
  onDestroy(() => {
    unsubscribeUser();
  });
</script>

<svelte:window on:scroll={handleScroll} on:click={handleClickOutside} />

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
        <li><a href="/chat.html" class="chat-link">Chat</a></li>
      </ul>
    </nav>

    <div class="auth-section">
      {#if $loading}
        <div class="loading">Loading...</div>
      {:else if $user}
        <div class="user-menu-container">
          <button class="user-info" on:click={toggleUserMenu} aria-expanded={showUserMenu} aria-haspopup="true">
            <img src={$user.photoURL} alt="Profile" class="profile-pic" />
            <span class="user-name">{$user.displayName}</span>
            <svg class="dropdown-arrow" class:rotated={showUserMenu} width="12" height="12" viewBox="0 0 12 12">
              <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          {#if showUserMenu}
            <div class="user-dropdown">
              <div class="dropdown-header">
                <img src={$user.photoURL} alt="Profile" class="dropdown-profile-pic" />
                <div class="dropdown-user-info">
                  <div class="dropdown-user-name">{$user.displayName}</div>
                  <div class="dropdown-user-email">{$user.email}</div>
                </div>
              </div>
              
              <div class="dropdown-divider"></div>
              
              <div class="dropdown-menu">
                <!-- Beta test functionality removed -->
                
                <a href="/chat.html" class="dropdown-item chat-dropdown-item" on:click={closeUserMenu}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414L2 14.586V3a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 7h6M5 9h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Chat</span>
                </a>
                
                <button class="dropdown-item" on:click={() => {closeUserMenu(); /* Add profile functionality later */}}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="currentColor"/>
                    <path d="M8 10C3.58172 10 0 13.5817 0 18H16C16 13.5817 12.4183 10 8 10Z" fill="currentColor"/>
                  </svg>
                  <span>Profile Settings</span>
                </button>
                
                <div class="dropdown-divider"></div>
                
                <button class="dropdown-item logout-item" on:click={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2H2V14H6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11 5L14 8L11 11" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 8H6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          {/if}
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
  
  nav a.chat-link {
    background: linear-gradient(135deg, #4361ee, #7209b7);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  nav a.chat-link:hover {
    background: linear-gradient(135deg, #3651d4, #6108a3);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
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

  .user-menu-container {
    position: relative;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }
  
  .user-info:hover {
    background-color: rgba(67, 97, 238, 0.1);
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
  
  .dropdown-arrow {
    color: #666;
    transition: transform 0.2s ease;
  }
  
  .dropdown-arrow.rotated {
    transform: rotate(180deg);
  }

  .user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 280px;
    z-index: 1000;
    margin-top: 0.5rem;
  }
  
  .dropdown-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .dropdown-profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .dropdown-user-info {
    flex: 1;
    min-width: 0;
  }
  
  .dropdown-user-name {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .dropdown-user-email {
    color: #666;
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .dropdown-divider {
    height: 1px;
    background-color: #f0f0f0;
    margin: 0.5rem 0;
  }
  
  .dropdown-menu {
    padding: 0.5rem 0;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 0.9rem;
    color: #333;
  }
  
  .dropdown-item:hover {
    background-color: #f8f9fa;
  }
  
  /* Beta test CSS removed */
  
  .dropdown-item.logout-item {
    color: #dc3545;
  }
  
  .dropdown-item.logout-item:hover {
    background-color: #fff5f5;
  }
  
  .dropdown-item.chat-dropdown-item {
    color: #4361ee;
    font-weight: 500;
    text-decoration: none;
  }
  
  .dropdown-item.chat-dropdown-item:hover {
    background-color: rgba(67, 97, 238, 0.1);
    color: #4361ee;
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
  }
</style>