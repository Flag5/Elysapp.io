<script>
  import { onMount } from 'svelte';
  import { chatService } from '../lib/api.js';
  import { backendUser, user } from '../stores/auth.js';
  import { createLogger } from '../lib/logger.js';

  const logger = createLogger('ConversationList');

  export let selectedConversationId = null;
  export let onConversationSelect = () => {};
  export let onNewChat = () => {};
  export let onLogin = () => {};

  let conversations = [];
  let loading = false;
  let error = null;

  onMount(async () => {
    await loadConversations();
    
    // Listen for refresh events from the chat component
    const handleRefresh = () => {
      setTimeout(() => loadConversations(), 500); // Small delay to ensure backend has processed
    };
    
    // Listen for placeholder conversation events
    const handleAddPlaceholder = (event) => {
      const placeholderConversation = event.detail;
      // Add placeholder at the beginning of the list
      conversations = [placeholderConversation, ...conversations];
    };
    
    const handleReplacePlaceholder = (event) => {
      const { oldId, newConversation } = event.detail;
      // Replace the placeholder with the real conversation
      conversations = conversations.map(conv => 
        conv.id === oldId ? newConversation : conv
      );
    };
    
    document.addEventListener('refresh-conversations', handleRefresh);
    document.addEventListener('add-placeholder-conversation', handleAddPlaceholder);
    document.addEventListener('replace-placeholder-conversation', handleReplacePlaceholder);
    
    return () => {
      document.removeEventListener('refresh-conversations', handleRefresh);
      document.removeEventListener('add-placeholder-conversation', handleAddPlaceholder);
      document.removeEventListener('replace-placeholder-conversation', handleReplacePlaceholder);
    };
  });

  async function loadConversations() {
    // Only load conversations for authenticated users
    if (!$backendUser) {
      conversations = [];
      return;
    }
    
    loading = true;
    error = null;
    
    try {
      conversations = await chatService.getConversations();
      logger.debug('Loaded conversations:', conversations);
    } catch (err) {
      logger.error('Failed to load conversations:', err);
      error = 'Failed to load conversations';
    } finally {
      loading = false;
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  function getConversationTitle(conversation) {
    // Handle placeholder conversations
    if (conversation.isPlaceholder) {
      return '...';
    }
    
    // Use the generated title if available and conversation is postprocessed
    if (conversation.title && conversation.postprocessed) {
      return conversation.title;
    }
    
    // If we have a title but conversation is not yet postprocessed,
    // it might be a temporary title, so use it
    if (conversation.title) {
      return conversation.title;
    }
    
    // Fallback: try to get first few words from the first user message
    if (conversation.first_user_message) {
      const words = conversation.first_user_message.trim().split(/\s+/);
      if (words.length > 0) {
        const preview = words.slice(0, 4).join(' ');
        return preview.length < conversation.first_user_message.length ? `${preview}...` : preview;
      }
    }
    
    // Final fallback: generate title from date
    const date = new Date(conversation.created_at);
    return `Chat ${date.toLocaleDateString()}`;
  }

  function handleConversationClick(conversation) {
    // Don't allow clicking on placeholder conversations
    if (conversation.isPlaceholder) {
      return;
    }
    onConversationSelect(conversation);
  }

  function handleNewChatClick() {
    onNewChat();
  }

  // Refresh conversations when user changes
  $: if ($backendUser) {
    loadConversations();
  }
</script>

<div class="conversation-list">
  <div class="conversation-header">
    <h3>Conversations</h3>
    <button class="new-chat-btn" on:click={handleNewChatClick} title="Start new chat">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>

  {#if !$backendUser}
    <div class="login-prompt">
      <div class="login-content">
        <div class="login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h4>Save Your Conversations</h4>
        <p>Log in to save your chat history and access it from any device.</p>
        <button class="login-btn" on:click={onLogin}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 12l2 2 4-4"></path>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
          </svg>
          Sign in with Google
        </button>
        <div class="anonymous-note">
          <p>You can still chat anonymously below</p>
        </div>
      </div>
    </div>
  {:else if loading}
    <div class="loading">
      <div class="loading-spinner"></div>
      <span>Loading conversations...</span>
    </div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
      <button on:click={loadConversations}>Retry</button>
    </div>
  {:else if conversations.length === 0}
    <div class="empty-state">
      <p>No conversations yet</p>
      <button on:click={handleNewChatClick}>Start your first chat</button>
    </div>
  {:else}
    <div class="conversations">
      {#each conversations as conversation (conversation.id)}
        <button
          class="conversation-item"
          class:active={selectedConversationId === conversation.id}
          on:click={() => handleConversationClick(conversation)}
        >
          <div class="conversation-content">
            <div class="conversation-title">
              {getConversationTitle(conversation)}
            </div>
            <div class="conversation-meta">
              <span class="message-count">{conversation.message_count} messages</span>
              <span class="last-message-time">{formatDate(conversation.last_message_at)}</span>
            </div>
          </div>
          {#if conversation.is_active}
            <div class="active-indicator"></div>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .conversation-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f8f9fa;
    border-right: 1px solid #e9ecef;
  }

  .conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    background-color: white;
  }

  .conversation-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }

  .new-chat-btn {
    background: #4361ee;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .new-chat-btn:hover {
    background: #3a56d4;
  }

  .login-prompt {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .login-content {
    text-align: center;
    max-width: 280px;
  }

  .login-icon {
    color: #4361ee;
    margin-bottom: 1rem;
  }

  .login-content h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }

  .login-content p {
    margin: 0 0 1.5rem 0;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }

  .login-btn {
    background: #4361ee;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    transition: background-color 0.2s ease;
  }

  .login-btn:hover {
    background: #3a56d4;
  }

  .anonymous-note {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
  }

  .anonymous-note p {
    font-size: 0.8rem;
    color: #888;
    margin: 0;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #666;
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #e9ecef;
    border-top: 2px solid #4361ee;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 0.5rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error {
    padding: 1rem;
    text-align: center;
    color: #dc3545;
  }

  .error button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .empty-state {
    padding: 2rem 1rem;
    text-align: center;
    color: #666;
  }

  .empty-state button {
    background: #4361ee;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;
    font-size: 0.9rem;
  }

  .conversations {
    flex: 1;
    overflow-y: auto;
  }

  .conversation-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;
    position: relative;
    text-align: left;
  }

  .conversation-item:hover {
    background-color: #f0f0f0;
  }

  .conversation-item.active {
    background-color: #e3f2fd;
    border-right: 3px solid #4361ee;
  }

  .conversation-content {
    flex: 1;
  }

  .conversation-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  .conversation-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: #666;
  }

  .active-indicator {
    width: 8px;
    height: 8px;
    background-color: #28a745;
    border-radius: 50%;
    margin-left: 0.5rem;
  }

  @media (max-width: 768px) {
    .conversation-header {
      padding: 0.75rem;
    }
    
    .conversation-item {
      padding: 1rem 0.75rem;
    }
    
    .conversation-title {
      font-size: 0.85rem;
    }
    
    .conversation-meta {
      font-size: 0.7rem;
    }
  }
</style>