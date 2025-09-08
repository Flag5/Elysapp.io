<script>
  import Chat from './Chat.svelte';
  
  function scrollToFeatures() {
    document.querySelector('#features').scrollIntoView({
      behavior: 'smooth'
    });
  }
  
  function joinWaitingList() {
    // In a real implementation, this would open a modal or form
    alert('Thank you for your interest! We\'ve added you to our waiting list.');
  }
</script>

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <div class="hero-badge">Privacy First</div>
      <h1>The Most Powerful AI. Privacy First.</h1>
      <p class="subtitle">
        Elys gives you the power of the world's most advanced AI, while ensuring your data stays yours. 
        An AI that knows you, learns from your conversations, and grows with you over time.
      </p>
      
      <div class="cta-buttons">
        <button class="primary-button" on:click={joinWaitingList}>
          Join Waiting List
        </button>
        <button class="secondary-button" on:click={scrollToFeatures}>
          Learn More
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 5px; vertical-align: middle;">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="embedded-chat">
      <div class="chat-connector"></div>
      <Chat embedded={true} />
    </div>
  </div>
  
  <div class="wave">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="#f5f7ff" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding: 8rem 2rem 10rem;
    background: linear-gradient(135deg, #4361ee 0%, #3a56d4 100%);
    color: white;
    overflow: hidden;
  }
  
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    position: relative;
    z-index: 5;
  }
  
  .hero-content {
    flex: 1;
    max-width: 500px;
  }
  
  .hero-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 30px;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(5px);
  }
  
  .embedded-chat {
    flex: 1;
    max-width: 480px;
    height: 450px;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    z-index: 5;
    position: relative;
    border: 2px solid rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    transform: perspective(1000px) rotateY(-5deg);
    transition: transform 0.3s ease;
  }
  
  .embedded-chat:hover {
    transform: perspective(1000px) rotateY(0deg);
  }
  
  .embedded-chat::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    width: 60px;
    height: 60px;
    background-color: rgba(67, 97, 238, 0.3);
    border-radius: 50%;
    z-index: -1;
  }
  
  .embedded-chat::after {
    content: '';
    position: absolute;
    bottom: -30px;
    right: -20px;
    width: 80px;
    height: 80px;
    background-color: rgba(67, 97, 238, 0.2);
    border-radius: 50%;
    z-index: -1;
  }
  
  .chat-connector {
    position: absolute;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8));
    top: 50%;
    left: -100px;
    z-index: 4;
  }
  
  .chat-connector::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    right: 0;
    top: -4px;
  }
  
  
  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .subtitle {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
    opacity: 0.9;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .primary-button {
    background-color: white;
    color: #4361ee;
    border: none;
    border-radius: 4px;
    padding: 0.8rem 1.8rem;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .primary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  .secondary-button {
    background-color: white;
    color: #4361ee;
    border: none;
    border-radius: 4px;
    padding: 0.8rem 1.8rem;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .secondary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  
  .wave {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    z-index: 1;
    pointer-events: none;
  }
  
  .hero-content {
    position: relative;
    z-index: 5;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  @media (max-width: 992px) {
    .container {
      flex-direction: column;
      text-align: center;
    }
    
    .hero-content {
      max-width: 100%;
      margin-bottom: 2rem;
    }
    
    .embedded-chat {
      max-width: 100%;
      height: 400px;
      transform: none;
    }
    
    .embedded-chat:hover {
      transform: none;
    }
    
    .chat-connector {
      display: none;
    }
    
    .cta-buttons {
      justify-content: center;
    }
    
    h1 {
      font-size: 2.5rem;
    }
    
    .hero-badge {
      margin: 0 auto 1rem;
    }
  }
  
  @media (max-width: 576px) {
    .hero {
      padding: 7rem 1rem 8rem;
    }
    
    .embedded-chat {
      height: 350px;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .subtitle {
      font-size: 1rem;
    }
    
    .cta-buttons {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .primary-button, .secondary-button {
      width: 100%;
    }
  }
</style>