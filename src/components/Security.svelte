<section id="security" class="security">
  <div class="container">
    <div class="section-header">
      <h2>Security First</h2>
      <p>Elys is designed with security at its core, protecting your digital life.</p>
    </div>
    
    <div class="security-grid">
      <div class="security-card">
        <div class="security-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M8 11l3 3 6-6"></path>
          </svg>
        </div>
        <h3>End-to-End Encryption</h3>
        <p>All your data is encrypted end-to-end, ensuring that only you can access your information. Your privacy is guaranteed through strong cryptographic protocols.</p>
      </div>
      
      <div class="security-card">
        <div class="security-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h3>Minimal Data Collection</h3>
        <p>Elys collects only what's necessary to provide its services. We use privacy-preserving techniques like hashing and anonymization to protect your identity.</p>
      </div>
      
      <div class="security-card">
        <div class="security-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <circle cx="12" cy="11" r="3"></circle>
          </svg>
        </div>
        <h3>Device Protection</h3>
        <p>Elys helps you keep track of your devices and can alert you when something seems off, helping to prevent theft or loss before it happens.</p>
      </div>
      
      <div class="security-card">
        <div class="security-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h3>User Control</h3>
        <p>You have complete control over your data. View, download, or delete your information at any time through an intuitive dashboard.</p>
      </div>
      
      <div class="security-card">
        <div class="security-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3>Transparent Policies</h3>
        <p>We believe in complete transparency about how your data is used. Our policies are written in clear, understandable language, not legal jargon designed to confuse.</p>
      </div>
      
      <div class="security-card">
        <div class="security-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3>Regular Audits</h3>
        <p>Our security practices are regularly audited by independent third parties to ensure we maintain the highest standards of data protection and privacy compliance.</p>
      </div>
    </div>
  </div>
</section>

<style>
  .security {
    padding: 6rem 2rem;
    background-color: #f5f7ff;
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
  
  .security-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .security-card {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .security-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .security-icon {
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
  
  .security-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .security-card p {
    color: #666;
    line-height: 1.6;
  }
  
  @media (max-width: 768px) {
    .security-grid {
      grid-template-columns: 1fr;
    }
  }
</style>