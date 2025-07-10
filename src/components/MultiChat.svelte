<script>
  import { onMount, onDestroy } from 'svelte';
  import { backendUser, user } from '../stores/auth.js';
  import { chatService, apiClient } from '../lib/api.js';
  import { API_ENDPOINTS } from '../lib/config.js';
  import { createLogger } from '../lib/logger.js';
  import ConversationList from './ConversationList.svelte';
  import { signInWithGoogle, logout } from '../lib/auth.js';
  import { joinBetaTest, leaveBetaTest } from '../lib/betaTest.js';
  import { addToast } from '../stores/toast.js';
  import { userPreferences, loadUserPreferences } from '../stores/preferences.js';
  import './MultiChat.css';

  const logger = createLogger('MultiChat');

  let selectedConversation = null;
  let chatMessages = [];
  let userInput = '';
  let chatContainer;
  let isLoading = false;
  let currentUser = null;
  let showSidebar = true;
  let showUserMenu = false;

  // Subscribe to user store
  const unsubscribeUser = backendUser.subscribe(async user => {
    currentUser = user;
    await loadUserPreferences(user);
    if (user && !selectedConversation) {
      // Auto-select the most recent conversation for logged-in users
      await loadMostRecentConversation();
    }
    if (user) {
      updateWelcomeMessage();
    }
  });

  onMount(() => {
    // Start with a new chat for anonymous users
    if (!currentUser) {
      startNewChat();
    }
  });

  async function loadMostRecentConversation() {
    if (!currentUser) return;
    
    try {
      const conversations = await chatService.getConversations(1, 0);
      if (conversations.length > 0) {
        await selectConversation(conversations[0]);
      } else {
        startNewChat();
      }
    } catch (error) {
      logger.error('Failed to load recent conversation:', error);
      startNewChat();
    }
  }

  async function selectConversation(conversation) {
    // Clear current state first
    chatMessages = [];
    isLoading = true;
    
    // Clear the force new conversation flag when selecting an existing conversation
    window.forceNewConversation = false;
    
    selectedConversation = conversation;
    logger.debug('Selecting conversation:', conversation.id);
    
    try {
      // Load messages for this conversation
      const messages = await chatService.getConversationMessages(conversation.id);
      
      // Convert to chat format
      chatMessages = messages.map(msg => ({
        sender: msg.role === 'user' ? 'user' : 'elys',
        text: msg.content,
        timestamp: msg.created_at
      }));
      
      // Add welcome message if no messages
      if (chatMessages.length === 0) {
        addWelcomeMessage();
      }
      
      scrollToBottom();
    } catch (error) {
      logger.error('Failed to load conversation messages:', error);
      chatMessages = [];
      addWelcomeMessage();
    } finally {
      isLoading = false;
    }
  }

  function startNewChat() {
    selectedConversation = null;
    chatMessages = [];
    addWelcomeMessage();
    userInput = '';
    
    // Set a flag to force new conversation on next message
    window.forceNewConversation = true;
    
    // Force refresh of conversation list to show the new conversation will appear
    // after the first message is sent
    logger.debug('Starting new chat - cleared conversation state');
  }

  function addWelcomeMessage() {
    const welcomeMessage = getPersonalizedWelcomeMessage();
    chatMessages = [{
      sender: 'elys',
      text: welcomeMessage
    }];
  }

  function updateWelcomeMessage() {
    if (chatMessages.length > 0 && chatMessages[0].sender === 'elys') {
      const welcomeMessage = getPersonalizedWelcomeMessage();
      chatMessages[0] = {
        sender: 'elys',
        text: welcomeMessage
      };
      chatMessages = [...chatMessages]; // Trigger reactivity
    }
  }

  function getPersonalizedWelcomeMessage() {
    if (!currentUser) {
      return 'Hello! I\'m Elys, your AI assistant. What can I help you with today?';
    }
    
    const firstName = currentUser.display_name ? currentUser.display_name.split(' ')[0] : 'there';
    
    // Check if user is new
    const createdAt = new Date(currentUser.created_at);
    const lastLogin = currentUser.last_login ? new Date(currentUser.last_login) : null;
    const now = new Date();
    
    const isNewUser = !lastLogin ||
      (now - createdAt < 5 * 60 * 1000 && lastLogin && Math.abs(lastLogin - createdAt) < 2 * 60 * 1000);
    
    if (isNewUser) {
      return `Welcome to Elys, ${firstName}! I'm excited to help you get started. What can I do for you?`;
    } else {
      return `Hi ${firstName}, nice to see you again! What can I help you with today?`;
    }
  }

  async function sendMessage() {
    if (!userInput.trim()) return;
    
    // Add user message to chat
    chatMessages = [
      ...chatMessages,
      {
        sender: 'user',
        text: userInput
      }
    ];
    
    const message = userInput;
    userInput = '';
    
    scrollToBottom();
    isLoading = true;
    
    try {
      // Check if we should force a new conversation
      const forceNew = window.forceNewConversation || false;
      if (forceNew) {
        window.forceNewConversation = false; // Reset the flag
      }
      
      // Send message with conversation ID if available and force_new flag
      const data = await chatService.sendMessage(message, selectedConversation?.id, forceNew);
      
      // Update selected conversation ID if this was a new chat
      if (!selectedConversation && data.conversation_id) {
        // Create a temporary conversation object
        selectedConversation = {
          id: data.conversation_id,
          title: null,
          is_active: true,
          message_count: 2, // user + assistant message
          created_at: new Date().toISOString(),
          last_message_at: new Date().toISOString()
        };
        
        // Trigger conversation list refresh for authenticated users
        if (currentUser) {
          // Force the ConversationList component to refresh by triggering a reactive update
          setTimeout(() => {
            // This will cause the ConversationList to reload conversations
            const conversationListComponent = document.querySelector('.conversation-list');
            if (conversationListComponent) {
              conversationListComponent.dispatchEvent(new CustomEvent('refresh-conversations'));
            }
          }, 100);
        }
      }
      
      // Add Elys response to chat
      chatMessages = [
        ...chatMessages,
        {
          sender: 'elys',
          text: data.response || 'I\'m sorry, I couldn\'t process your request at the moment.'
        }
      ];
      
    } catch (error) {
      logger.error('Error sending message:', error);
      
      let errorMessage = 'I\'m sorry, I couldn\'t process your request at the moment. Please try again.';
      
      if (error.name === 'TypeError' || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        errorMessage = '🔧 We\'re currently developing Elys, you may experience delays. The backend is not available at the moment.';
      }
      
      chatMessages = [
        ...chatMessages,
        {
          sender: 'elys',
          text: errorMessage
        }
      ];
    } finally {
      isLoading = false;
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  async function handleLogin() {
    try {
      await signInWithGoogle();
    } catch (error) {
      logger.error('Login failed:', error);
    }
  }

  function toggleSidebar() {
    showSidebar = !showSidebar;
  }

  // User menu functions
  async function handleLogout() {
    try {
      await logout();
      showUserMenu = false;
    } catch (error) {
      logger.error('Logout failed:', error);
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
      logger.error('Error joining beta test:', error);
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
      logger.error('Error leaving beta test:', error);
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

<svelte:window on:click={handleClickOutside} />

<div class="multi-chat">
  <!-- Sidebar -->
  <div class="sidebar" class:hidden={!showSidebar}>
    <ConversationList
      selectedConversationId={selectedConversation?.id}
      onConversationSelect={selectConversation}
      onNewChat={startNewChat}
      onLogin={handleLogin}
    />
  </div>

  <!-- Main Chat Area -->
  <div class="chat-area">
    <!-- Chat Header -->
    <div class="chat-header">
      <div class="header-left">
        <button class="sidebar-toggle" on:click={toggleSidebar} class:active={showSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="chat-title">
          <img src="/placeholder-logo.svg" alt="Elys Logo" />
          <span>Elys AI</span>
          <span class="beta-label">beta</span>
        </div>
      </div>
      
      <div class="header-right">
        {#if currentUser}
          <div class="user-menu-container">
            <button class="user-info" on:click={toggleUserMenu} aria-expanded={showUserMenu} aria-haspopup="true">
              <img src={currentUser.photo_url || '/placeholder-logo.svg'} alt="Profile" class="user-avatar" />
              <span class="user-name">{currentUser.display_name || 'User'}</span>
              <svg class="dropdown-arrow" class:rotated={showUserMenu} width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            {#if showUserMenu}
              <div class="user-dropdown">
                <div class="dropdown-header">
                  <img src={currentUser.photo_url || '/placeholder-logo.svg'} alt="Profile" class="dropdown-profile-pic" />
                  <div class="dropdown-user-info">
                    <div class="dropdown-user-name">{currentUser.display_name || 'User'}</div>
                    <div class="dropdown-user-email">{currentUser.email || ''}</div>
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
          <button class="google-login-btn" on:click={handleLogin}>
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

    <!-- Chat Messages -->
    <div class="chat-messages" bind:this={chatContainer}>
      {#each chatMessages as message}
        <div class="message {message.sender}">
          <div class="message-content">
            {@html message.text}
          </div>
        </div>
      {/each}
      
      {#if isLoading}
        <div class="message elys">
          <div class="message-content loading">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Chat Input -->
    <div class="chat-input">
      <input
        type="text"
        placeholder="Type your message..."
        bind:value={userInput}
        on:keypress={handleKeyPress}
        disabled={isLoading}
      />
      <button class="send-button" on:click={sendMessage} disabled={!userInput.trim() || isLoading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  </div>
</div>
