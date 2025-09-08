<section id="features" class="features">
  <div class="container">
    <div class="section-header">
      <h2>What Elys Does</h2>
      <p>Elys is an AI for everyday use, privacy-first. Powered by state-of-the-art models while keeping your data yours.</p>
    </div>
    
    <div class="features-grid">
      
      <div class="adaptive-card">
        <div class="adaptive-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7v10c0 5.55 3.84 12 9 12s9-6.45 9-12V7l-10-5z"></path>
          </svg>
        </div>
        <h4>Privacy-First</h4>
        <p>All data encrypted and stored in Switzerland/EU. GDPR compliant. Never used for training.</p>
      </div>
      
      <div class="adaptive-card">
        <div class="adaptive-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="m15.5 3.5-3 3-3-3"></path>
            <path d="m15.5 20.5-3-3-3 3"></path>
          </svg>
        </div>
        <h4>Adaptive Intelligence</h4>
        <p>Seamlessly blends different AI capabilities during your conversation to deliver the best possible results for each task.</p>
      </div>
      
      <div class="adaptive-card">
        <div class="adaptive-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
        </div>
        <h4>Unified Memory</h4>
        <p>One consistent experience that remembers your context and preferences across all interactions.</p>
      </div>
      
      <div class="adaptive-card">
        <div class="adaptive-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <h4>Secure Orchestration</h4>
        <p>For businesses: access multiple LLMs securely without exposing sensitive data to vendors.</p>
      </div>
    </div>
    
    <div class="features-highlight">
      <div class="highlight-content">
        <h3>Why It Matters</h3>
        <p>Most AI services harvest your data and use it for training. <em>Your conversations become their product</em>. Elys changes that.</p>
        <p>Elys automatically gives you the <em>best AI response for every question</em> while keeping your data encrypted and private.</p>
        <p>One AI. Any model. Your data stays yours.</p>
      </div>
    </div>
  </div>
</section>

<style>
  .features {
    background-color: #f5f7ff;
    padding: 6rem 2rem;
  }
  
  .section-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 4rem;
  }
  
  .section-header h2 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
  }
  
  .section-header p {
    font-size: 1.2rem;
    color: #666;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  
  .features-highlight {
    background-color: #4361ee;
    color: white;
    border-radius: 8px;
    padding: 3rem;
    margin-top: 3rem;
  }
  
  .highlight-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .highlight-content h3 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .highlight-content p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }
  
  .adaptive-card {
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .adaptive-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .adaptive-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #f3f4f6;
    color: #4361ee;
    border-radius: 50%;
    margin-bottom: 1rem;
  }
  
  .adaptive-card h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .adaptive-card p {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }
  
  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
    
    
    .features-highlight {
      padding: 2rem;
    }
  }
  
  @media (max-width: 1024px) {
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
  }
</style>