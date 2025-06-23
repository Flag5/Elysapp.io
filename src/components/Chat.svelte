<script>
  import { onMount, onDestroy } from 'svelte';
  import { backendUser } from '../stores/auth.js';
  import { userService } from '../lib/api.js';
  import { joinBetaTest } from '../lib/betaTest.js';
  import { userPreferences, loadUserPreferences } from '../stores/preferences.js';
  import { API_ENDPOINTS } from '../lib/config.js';
  
  export let embedded = false;
  
  let chatMessages = [];
  let userInput = '';
  let chatContainer;
  let isLoading = false;
  let currentUser = null;
  let isDevelopmentMode = false;
  let isWaitingForBetaResponse = false;
  
  // Subscribe to user store
  const unsubscribeUser = backendUser.subscribe(async user => {
    currentUser = user;
    // Load user preferences when user changes
    await loadUserPreferences(user);
    if (user) {
      updateWelcomeMessage();
    }
  });
  
  function updateWelcomeMessage() {
    if (!currentUser) return;
    
    const welcomeMessage = getPersonalizedWelcomeMessage();
    
    // Update the first message if it exists, otherwise add it
    if (chatMessages.length > 0 && chatMessages[0].sender === 'elys') {
      chatMessages[0] = {
        sender: 'elys',
        text: welcomeMessage
      };
      chatMessages = [...chatMessages]; // Trigger reactivity
    } else {
      chatMessages = [
        {
          sender: 'elys',
          text: welcomeMessage
        },
        ...chatMessages
      ];
    }
  }
  
  function getPersonalizedWelcomeMessage() {
    if (!currentUser) {
      return 'Hello! I\'m Elys, what can I do for you?';
    }
    
    const firstName = currentUser.display_name ? currentUser.display_name.split(' ')[0] : 'there';
    
    // Check if user is new (created recently and no previous login)
    const createdAt = new Date(currentUser.created_at);
    const lastLogin = currentUser.last_login ? new Date(currentUser.last_login) : null;
    const now = new Date();
    
    // Consider user "new" if:
    // 1. No last_login recorded, OR
    // 2. Created within the last 5 minutes and last_login is very close to created_at
    const isNewUser = !lastLogin ||
      (now - createdAt < 5 * 60 * 1000 && lastLogin && Math.abs(lastLogin - createdAt) < 2 * 60 * 1000);
    
    if (isNewUser) {
      return `Welcome to Elys, ${firstName}! I'm excited to help you get started. What can I do for you?`;
    } else {
      return `Hi ${firstName}, nice to see you again! What can I help you with today?`;
    }
  }
  
  onMount(async () => {
    // Load user preferences if user is already logged in
    if (currentUser) {
      await loadUserPreferences();
    }
    
    // Add initial welcome message
    const welcomeMessage = currentUser ? getPersonalizedWelcomeMessage() : 'Hello! I\'m Elys, what can I do for you?';
    chatMessages = [
      {
        sender: 'elys',
        text: welcomeMessage
      }
    ];
    
    // Focus on the input field
    const inputField = document.querySelector('.chat-input input');
    if (inputField) {
      inputField.focus();
    }
    
    // Add event listener for Escape key to close chat if not embedded
    if (!embedded) {
      document.addEventListener('keydown', handleKeyDown);
    }
  });
  
  onDestroy(() => {
    if (!embedded) {
      document.removeEventListener('keydown', handleKeyDown);
    }
    // Unsubscribe from user store
    unsubscribeUser();
  });
  
  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      closeChat();
    }
  }
  
  function closeChat() {
    // This will be handled by the parent component
    dispatch('close');
  }
  
  function dispatch(event) {
    const customEvent = new CustomEvent(event);
    window.dispatchEvent(customEvent);
  }
  
  async function sendMessage() {
    if (!userInput.trim()) return;
    
    // Check if we're waiting for a beta response
    if (isWaitingForBetaResponse) {
      await handleBetaResponse(userInput.trim());
      userInput = '';
      return;
    }
    
    // Add user message to chat
    chatMessages = [
      ...chatMessages,
      {
        sender: 'user',
        text: userInput
      }
    ];
    
    // Clear input
    const message = userInput;
    userInput = '';
    
    // Scroll to bottom
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
    
    // Show loading indicator
    isLoading = true;
    
    try {
      // Send message to API
      const response = await fetch(API_ENDPOINTS.WEBCHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        // Check if it's a network/connectivity issue vs server error
        if (response.status >= 500 || response.status === 0) {
          // Server error or network issue - backend unavailable
          throw new Error('Backend unavailable');
        } else {
          // Client error (4xx) - backend is available but request failed
          const errorData = await response.json().catch(() => ({}));
          chatMessages = [
            ...chatMessages,
            {
              sender: 'elys',
              text: errorData.message || 'I\'m sorry, I couldn\'t process your request at the moment. Please try again.'
            }
          ];
          return;
        }
      }
      
      const data = await response.json();
      
      // Add Elys response to chat
      chatMessages = [
        ...chatMessages,
        {
          sender: 'elys',
          text: data.response || 'I\'m sorry, I couldn\'t process your request at the moment.'
        }
      ];
    } catch (error) {
      console.error('Error sending message:', error);
      // Only show backend unavailable for network errors or server errors
      if (error.message === 'Backend unavailable' || error.name === 'TypeError' || error.message.includes('fetch')) {
        await handleBackendUnavailable();
      } else {
        // For other errors, show a generic error message
        chatMessages = [
          ...chatMessages,
          {
            sender: 'elys',
            text: 'I\'m sorry, something went wrong. Please try again.'
          }
        ];
      }
    } finally {
      isLoading = false;
      
      // Scroll to bottom
      setTimeout(() => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 0);
    }
  }
  
  async function handleBackendUnavailable() {
    isDevelopmentMode = true;
    
    // Show backend unavailable message
    chatMessages = [
      ...chatMessages,
      {
        sender: 'elys',
        text: '🔧 We\'re currently developing Elys, you may experience delays. The backend is not available at the moment.'
      }
    ];
    
    // Scroll to bottom
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }
  
  function showLoginPrompt() {
    chatMessages = [
      ...chatMessages,
      {
        sender: 'elys',
        text: 'To get early access to new features and join our beta testing program, please log in to your account.\n\nAfter logging in, click on your name in the top-right corner and select "Join Beta Program" from the dropdown menu.\n\nBeta testers get free access to new features before they\'re publicly released!'
      }
    ];
    
    scrollToBottom();
  }
  
  async function checkBetaTestStatus() {
    const hasBetaTest = $userPreferences?.betatest === true;
    
    if (hasBetaTest) {
      showBetaUserMessage();
    } else {
      showWaitlistOffer();
    }
  }
  
  function showBetaUserMessage() {
    const userEmail = currentUser?.email || 'your registered email';
    
    chatMessages = [
      ...chatMessages,
      {
        sender: 'elys',
        text: `Great news! You're already signed up for our beta program. We'll notify you at <strong>${userEmail}</strong> as soon as this feature is ready for testing.`
      }
    ];
    
    scrollToBottom();
  }
  
  function showWaitlistOffer() {
    chatMessages = [
      ...chatMessages,
      {
        sender: 'elys',
        text: 'Would you like to join our waiting list for early access to this feature? You\'ll get the beta user experience for free and be among the first to try new features!\n\nWrite <strong>"yes"</strong> to join the waiting list.'
      }
    ];
    
    isWaitingForBetaResponse = true;
    scrollToBottom();
  }
  
  async function handleBetaResponse(response) {
    isWaitingForBetaResponse = false;
    
    // Add user response to chat
    chatMessages = [
      ...chatMessages,
      {
        sender: 'user',
        text: response
      }
    ];
    
    if (response.toLowerCase() === 'yes') {
      await joinBetaWaitlist();
    } else {
      chatMessages = [
        ...chatMessages,
        {
          sender: 'elys',
          text: 'No problem! You can always join the beta program later. Is there anything else I can help you with?'
        }
      ];
    }
    
    scrollToBottom();
  }
  
  async function joinBetaWaitlist() {
    try {
      const updatedPrefs = await joinBetaTest(currentUser, $userPreferences);
      userPreferences.set(updatedPrefs);
      
      const userEmail = currentUser?.email || 'your registered email';
      
      chatMessages = [
        ...chatMessages,
        {
          sender: 'elys',
          text: `🎉 Welcome to the beta program! You've been added to our waiting list and will receive notifications at <strong>${userEmail}</strong> when new features are ready for testing. Thank you for helping us improve the platform!`
        }
      ];
      
    } catch (error) {
      console.error('Error joining beta waitlist:', error);
      
      chatMessages = [
        ...chatMessages,
        {
          sender: 'elys',
          text: 'I\'m sorry, there was an error adding you to the beta program. Please try again later or contact support if the issue persists.'
        }
      ];
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
</script>

{#if embedded}
  <div class="chat-container embedded">
    <div class="chat-header">
      <div class="chat-title">
        <img src="/placeholder-logo.svg" alt="Elys Logo" />
        <span>Ask Elys</span>
        <span class="beta-label">beta</span>
      </div>
    </div>
    
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
    
    <div class="chat-input">
      <input
        type="text"
        placeholder={isWaitingForBetaResponse ? 'Write "yes" to join the beta waitlist...' : 'Type your message...'}
        bind:value={userInput}
        on:keypress={handleKeyPress}
        class:beta-response={isWaitingForBetaResponse}
      />
      <button class="send-button" on:click={sendMessage} disabled={!userInput.trim() || isLoading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  </div>
{:else}
  <div class="chat-overlay">
    <div class="chat-container">
      <div class="chat-header">
        <div class="chat-title">
          <img src="/placeholder-logo.svg" alt="Elys Logo" />
          <span>Ask Elys</span>
          <span class="beta-label">beta</span>
        </div>
        <button class="close-button" on:click={closeChat}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
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
      
      <div class="chat-input">
        <input
          type="text"
          placeholder={isWaitingForBetaResponse ? 'Write "yes" to join the beta waitlist...' : 'Type your message...'}
          bind:value={userInput}
          on:keypress={handleKeyPress}
          class:beta-response={isWaitingForBetaResponse}
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
{/if}

<style>
  .chat-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 1rem;
  }
  
  .chat-container {
    background-color: white;
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    height: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  .chat-container.embedded {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    border-radius: 16px;
    background: transparent;
    display: flex;
    flex-direction: column;
  }
  
  .chat-container.embedded .chat-header {
    background: linear-gradient(135deg, #4361ee 0%, #3a56d4 100%);
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 0.8rem 1rem;
  }
  
  .chat-container.embedded .chat-messages {
    background-color: rgba(255, 255, 255, 0.9);
    flex: 1;
    padding: 1rem;
  }
  
  .chat-container.embedded .chat-input {
    background-color: rgba(255, 255, 255, 0.95);
    border-top: 1px solid rgba(67, 97, 238, 0.2);
    padding: 0.8rem;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }
  
  .chat-container.embedded .chat-input input {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(67, 97, 238, 0.3);
    transition: all 0.2s ease;
  }
  
  .chat-container.embedded .chat-input input:focus {
    background-color: white;
    border-color: #4361ee;
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  }
  
  .chat-container.embedded .send-button {
    background: linear-gradient(135deg, #4361ee 0%, #3a56d4 100%);
  }
  
  .chat-container.embedded .message.elys .message-content {
    background-color: rgba(67, 97, 238, 0.1);
    border-left: 3px solid #4361ee;
  }
  
  .chat-container.embedded .message.user .message-content {
    background-color: rgba(67, 97, 238, 0.2);
    border-right: 3px solid #4361ee;
  }
  
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #4361ee;
    color: white;
  }
  
  .chat-title {
    display: flex;
    align-items: center;
    font-weight: 600;
  }
  
  .chat-title img {
    height: 24px;
    margin-right: 0.5rem;
  }
  
  .beta-label {
    font-size: 0.7rem;
    font-weight: 400;
    opacity: 1;
    margin-left: 0.5rem;
    padding: 0.1rem 0.4rem;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    text-transform: lowercase;
    color: #ffd700;
  }
  
  .close-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }
  
  .close-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .chat-messages {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .message {
    display: flex;
    margin-bottom: 0.5rem;
  }
  
  .message.user {
    justify-content: flex-end;
  }
  
  .message-content {
    padding: 0.75rem 1rem;
    border-radius: 18px;
    max-width: 80%;
    word-break: break-word;
  }
  
  .user .message-content {
    background-color: #4361ee;
    color: white;
    border-bottom-right-radius: 4px;
  }
  
  .elys .message-content {
    background-color: #f1f1f1;
    color: #333;
    border-bottom-left-radius: 4px;
    white-space: pre-line;
  }
  
  .elys .message-content:has-text("🔧") {
    background-color: #fff3cd;
    border-left: 3px solid #ffc107;
    color: #856404;
  }
  
  .elys .message-content:has-text("🎉") {
    background-color: #d1edff;
    border-left: 3px solid #0084ff;
    color: #004085;
  }
  
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 60px;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: #666;
    border-radius: 50%;
    margin: 0 3px;
    animation: bounce 1.5s infinite ease-in-out;
  }
  
  .dot:nth-child(1) {
    animation-delay: 0s;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes bounce {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-5px);
    }
  }
  
  .chat-input {
    display: flex;
    padding: 1rem;
    border-top: 1px solid #eee;
  }
  
  .chat-input input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 24px;
    outline: none;
    font-size: 1rem;
  }
  
  .chat-input input:focus {
    border-color: #4361ee;
  }
  
  .chat-input input.beta-response {
    border-color: #ff6b35;
    background-color: #fff8f5;
  }
  
  .chat-input input.beta-response:focus {
    border-color: #ff6b35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
  }
  
  .send-button {
    background-color: #4361ee;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .send-button:hover {
    background-color: #3a56d4;
  }
  
  .send-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 576px) {
    .chat-container {
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }
    
    .chat-overlay {
      padding: 0;
    }
  }
</style>