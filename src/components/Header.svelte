<script>
  import { onDestroy } from 'svelte';
  import { user, loading, backendUser } from '../stores/auth.js';
  import { signInWithGoogle, logout } from '../lib/auth.js';
  import { userService } from '../lib/api.js';
  import { joinBetaTest, leaveBetaTest } from '../lib/betaTest.js';
  import { addToast } from '../stores/toast.js';
  import { userPreferences, loadUserPreferences } from '../stores/preferences.js';
  
  let scrolled = false;
  let showUserMenu = false;
  let currentUser = null;
  
  // Subscribe to backend user for preferences
  const unsubscribeUser = backendUser.subscribe(async user => {
    currentUser = user;
    await loadUserPreferences(user);
  });
  
  function handleScroll() {
    scrolled = window.scrollY > 20;
  }

  async function handleGoogleSignIn() {
    try {
      console.log('🔘 Login button clicked');
      await signInWithGoogle();
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
  
  async function handleJoinBetaTest() {
    if (!currentUser) return;
    
    try {
      const updatedPrefs = await joinBetaTest(currentUser, $userPreferences);
      userPreferences.set(updatedPrefs);
      addToast('🎉 Welcome to the beta program! You\'ll receive notifications when new features are ready for testing.', 'success', 5000);
      closeUserMenu();
    } catch (error) {
      console.error('Error joining beta test:', error);
      addToast('Sorry, there was an error joining the beta program. Please try again later.', 'error');
    }
  }

  async function handleLeaveBetaTest() {
    if (!currentUser) return;
    
    try {
      const updatedPrefs = await leaveBetaTest(currentUser, $userPreferences);
      userPreferences.set(updatedPrefs);
      addToast('You have left the beta program. You can rejoin anytime from this menu.', 'info', 5000);
      closeUserMenu();
    } catch (error) {
      console.error('Error leaving beta test:', error);
      addToast('Sorry, there was an error updating your beta status. Please try again later.', 'error');
    }
  }

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
                {#if $userPreferences?.betatest === true}
                  <div class="dropdown-item beta-status">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z" fill="#4361ee"/>
                    </svg>
                    <span>Beta Member</span>
                  </div>
                  
                  <button class="dropdown-item leave-beta" on:click={handleLeaveBetaTest}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM5.5 5.5L8 8l2.5-2.5L11 6l-2.5 2.5L11 11l-.5.5L8 9l-2.5 2.5L5 11l2.5-2.5L5 6l.5-.5z" fill="currentColor"/>
                    </svg>
                    <span>Leave Beta Program</span>
                  </button>
                {:else}
                  <button class="dropdown-item" on:click={handleJoinBetaTest}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z" fill="currentColor"/>
                    </svg>
                    <span>Join Beta Program</span>
                  </button>
                {/if}
                
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
  
  .dropdown-item.beta-status {
    color: #4361ee;
    cursor: default;
    font-weight: 500;
  }
  
  .dropdown-item.beta-status:hover {
    background-color: rgba(67, 97, 238, 0.05);
  }
  
  .dropdown-item.leave-beta {
    color: #f59e0b;
  }
  
  .dropdown-item.leave-beta:hover {
    background-color: #fffbeb;
  }
  
  .dropdown-item.logout-item {
    color: #dc3545;
  }
  
  .dropdown-item.logout-item:hover {
    background-color: #fff5f5;
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