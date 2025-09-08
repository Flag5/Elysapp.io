<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-logo">
        <img src="/placeholder-logo.svg" alt="Elys Logo" />
        <span>Elys</span>
      </div>
      
      <div class="footer-links">
        <div class="footer-column">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="/pricing">Pricing</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>Resources</h4>
          <ul>
            <li><a href="/docs">Documentation</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/community">Community</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/cookie-policy">Cookie Policy</a></li>
            <li><a href="/gdpr">GDPR</a></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Elys. All rights reserved. Developed by Flag5.</p>
      <div class="social-links">
        <a href="https://twitter.com/elysapp" aria-label="Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
        </a>
        <a href="https://linkedin.com/company/elysapp" aria-label="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
        <a href="https://github.com/Flag5" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer {
    background-color: #1a1a2e;
    color: #fff;
    padding: 4rem 2rem 2rem;
  }
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 3rem;
  }
  
  .footer-logo {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .footer-logo img {
    height: 40px;
    margin-right: 0.5rem;
  }
  
  .footer-logo span {
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
  }
  
  .footer-column h4 {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: #fff;
  }
  
  .footer-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-column li {
    margin-bottom: 0.8rem;
  }
  
  .footer-column a {
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.2s ease;
  }
  
  .footer-column a:hover {
    color: #fff;
    text-decoration: none;
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .footer-bottom p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .social-links {
    display: flex;
    gap: 1rem;
  }
  
  .social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    transition: background-color 0.2s ease;
  }
  
  .social-links a:hover {
    background-color: #4361ee;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
    }
    
    .footer-links {
      flex-direction: column;
      gap: 2rem;
    }
    
    .footer-bottom {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
</style>