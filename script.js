// HYBRIDX Main Script

// Email validation and referral code generation
function generateReferrallink(email) {
  const hash = email.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return 'HYBX' + Math.abs(hash).toString(36).toUpperCase().slice(0, 6);
}

// Store user data in localStorage
function storeUserData(email, referralCode) {
  const userData = {
    email: email,
    referralCode: referralCode,
    timestamp: new Date().toISOString(),
    depositCompleted: false,
    walletAddress: null
  };
  localStorage.setItem('hybridx_user', JSON.stringify(userData));
}

// Get user data from localStorage
function getUserData() {
  const data = localStorage.getItem('hybridx_user');
  return data ? JSON.parse(data) : null;
}

// Update user data
function updateUserData(updates) {
  const userData = getUserData() || {};
  const updatedData = { ...userData, ...updates };
  localStorage.setItem('hybridx_user', JSON.stringify(updatedData));
}

// Email validation
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Copy to clipboard function
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

// Fallback copy method
function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showNotification('Copied to clipboard!', 'success');
  } catch (err) {
    showNotification('Failed to copy', 'error');
  }
  document.body.removeChild(textArea);
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#667eea'};
    color: white;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Track referrals
function trackReferral(referralCode) {
  const referrals = JSON.parse(localStorage.getItem('hybridx_referrals') || '{}');
  if (!referrals[referralCode]) {
    referrals[referralCode] = [];
  }
  localStorage.setItem('hybridx_referrals', JSON.stringify(referrals));
}

// Add referral
function addReferral(referralCode, newUserEmail) {
  const referrals = JSON.parse(localStorage.getItem('hybridx_referrals') || '{}');
  if (!referrals[referralCode]) {
    referrals[referralCode] = [];
  }
  referrals[referralCode].push({
    email: newUserEmail,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('hybridx_referrals', JSON.stringify(referrals));
  return referrals[referralCode].length;
}

// Get referral count
function getReferralCount(referralCode) {
  const referrals = JSON.parse(localStorage.getItem('hybridx_referrals') || '{}');
  return referrals[referralCode] ? referrals[referralCode].length : 0;
}

// Calculate bonus BNB
function calculateBonusBNB(referralCount) {
  return Math.floor(referralCount / 10) * 5;
}

// Wallet validation
function isValidBSCAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Format BNB amount
function formatBNB(amount) {
  return parseFloat(amount).toFixed(4) + ' BNB';
}

// Countdown timer
function startCountdown(targetDate, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
      element.textContent = 'LIVE NOW!';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('HYBRIDX initialized');
  
  // Check if user data exists
  const userData = getUserData();
  if (userData) {
    console.log('User data found:', userData.email);
  }
  
  // Add smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Add scroll reveal animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
});
