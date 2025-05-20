<section id="privacy" class="privacy">
  <div class="container">
    <div class="section-header">
      <h2>Built on Trust</h2>
      <p>We know that to be helpful, we need your trust — not your data.</p>
    </div>
    
    <div class="privacy-content">
      <div class="privacy-image">
        <img src="/privacy-illustration.svg" alt="Privacy and Trust" />
      </div>
      
      <div class="privacy-text">
        <div class="privacy-card">
          <div class="privacy-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div>
            <h3>Your data stays yours</h3>
            <p>Your data is encrypted. You can always download it, delete it, or edit it at any time.</p>
          </div>
        </div>
        
        <div class="privacy-card">
          <div class="privacy-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <h3>No profiling. No ads. No hidden tracking.</h3>
            <p>Unlike conventional tracking apps, Elys does not track you as a person, nor does it sell or misuse your data.</p>
          </div>
        </div>
        
        <div class="privacy-card">
          <div class="privacy-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div>
            <h3>Explicit control over sharing</h3>
            <p>You decide what gets shared and when. Sharing is always opt-in, secure, and limited to trusted contacts or community members.</p>
          </div>
        </div>
        
        <div class="privacy-quote">
          <p>"We're building Elys to be the most <em>privacy-respecting intelligent agent</em> in the world."</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .privacy {
    padding: 6rem 2rem;
    background-color: white;
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
  
  .privacy-content {
    display: flex;
    align-items: center;
    gap: 4rem;
  }
  
  .privacy-image {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  
  .privacy-image img {
    max-width: 100%;
    height: auto;
  }
  
  .privacy-text {
    flex: 1;
  }
  
  .privacy-card {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2rem;
  }
  
  .privacy-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background-color: #4361ee;
    color: white;
    border-radius: 50%;
    margin-right: 1.5rem;
    flex-shrink: 0;
  }
  
  .privacy-card h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .privacy-card p {
    color: #666;
    line-height: 1.6;
  }
  
  .privacy-quote {
    margin-top: 3rem;
    padding: 1.5rem;
    border-left: 4px solid #4361ee;
    background-color: #f5f7ff;
  }
  
  .privacy-quote p {
    font-size: 1.3rem;
    font-style: italic;
    color: #333;
  }
  
  @media (max-width: 992px) {
    .privacy-content {
      flex-direction: column;
      gap: 2rem;
    }
    
    .privacy-image {
      order: -1;
    }
  }
</style>