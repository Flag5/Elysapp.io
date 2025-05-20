<script>
  import { onMount, onDestroy } from 'svelte';
  
  export let embedded = false;
  
  let chatMessages = [];
  let userInput = '';
  let chatContainer;
  let isLoading = false;
  
  onMount(() => {
    // Add a welcome message
    chatMessages = [
      {
        sender: 'elys',
        text: 'Hello! I\'m Elys, what can I do for you?'
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
      const response = await fetch('https://api.elysapp.io/webchat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
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
      
      // Add error message
      chatMessages = [
        ...chatMessages,
        {
          sender: 'elys',
          text: 'I\'m sorry, there was an error processing your request. Please try again later.'
        }
      ];
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
      </div>
    </div>
    
    <div class="chat-messages" bind:this={chatContainer}>
      {#each chatMessages as message}
        <div class="message {message.sender}">
          <div class="message-content">
            {message.text}
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
        placeholder="Type your message..."
        bind:value={userInput}
        on:keypress={handleKeyPress}
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
              {message.text}
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
          placeholder="Type your message..."
          bind:value={userInput}
          on:keypress={handleKeyPress}
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
    max-width: 500px;
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