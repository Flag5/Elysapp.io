<section id="features" class="features">
  <div class="container">
    <div class="section-header">
      <h2>What Elys Does</h2>
      <p>Elys is an intelligent companion that helps you navigate everyday life with more peace of mind.</p>
    </div>
    
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>
          </svg>
        </div>
        <h3>Battery Awareness</h3>
        <p>"Your phone may not have enough battery for the coming trip!" Elys notices when a routine breaks and nudges you before it becomes a problem.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
        </div>
        <h3>Device Tracking</h3>
        <p>"You left home without your earbuds again." It learns what devices usually travel with you and alerts you when one's missing.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <h3>Calendar Awareness</h3>
        <p>"You usually leave for your meeting by now." It connects dots — like calendar events, your usual habits, and local conditions — to offer timely suggestions.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <h3>Location Intelligence</h3>
        <p>"You're at the airport. Your suitcase beacon hasn't moved." If paired with smart tags, it can alert you when something's left behind or misplaced.</p>
      </div>
    </div>
    
    <div class="features-highlight">
      <div class="highlight-content">
        <h3>Why It Matters</h3>
        <p>Phones today can do everything — except <em>notice the obvious</em>. Elys fills that gap.</p>
        <p>Most apps focus on <em>where</em> you are. Elys focuses on <em>what's normal for you</em>. It brings context and awareness into your digital life, quietly in the background.</p>
        <p>No need to set 12 reminders. No need to obsess over trackers. Elys becomes your invisible AI guardian.</p>
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
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .feature-card {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background-color: #4361ee;
    color: white;
    border-radius: 50%;
    margin-bottom: 1.5rem;
  }
  
  .feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .feature-card p {
    color: #666;
    line-height: 1.6;
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
  
  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
    
    .features-highlight {
      padding: 2rem;
    }
  }
</style>