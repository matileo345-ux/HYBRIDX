function showStep(n) {
  document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.getElementById('step'+n).classList.add('active');
  document.querySelectorAll('.tab')[n-1].classList.add('active');
}
function goToStep2() {
  const email = document.getElementById('emailInput').value;
  if (!email.includes('@')) return alert('Please enter a valid email');
  alert('Your referral code: HYB' + Math.random().toString(36).substr(2,6).toUpperCase());
  showStep(2);
}
function goToStep3() { showStep(3); }
function copyAddress() {
  navigator.clipboard.writeText('0x1a5a2291398c10ac24b6ddfe1d0a0215587c65ac');
  alert('Address copied to clipboard!');
}
function complete() {
  const wallet = document.getElementById('walletInput').value;
  if (!wallet.startsWith('0x') || wallet.length !== 42) return alert('Enter valid wallet');
  alert('Success! You are now on the HYBRIDX waitlist! Welcome to the future!');
}
