// navbar.js — shared navbar injected into all customer pages
// Now reads cart count from API.cart and shows correct auth state
(function () {
  const links = [
    { href: 'homepage.html',  label: 'Home' },
    { href: 'browse.html',    label: 'Shop' },
    { href: 'about.html',     label: 'About Us' },
    { href: 'profile.html',   label: 'My Account' },
  ];
  const current = window.location.pathname.split('/').pop();

  // Cart count — reads from localStorage via API.cart if available
  function cartCount() {
    try {
      const items = JSON.parse(localStorage.getItem('sd_cart') || '[]');
      return items.reduce((s, i) => s + (i.qty || 0), 0);
    } catch { return 0; }
  }

  const count = cartCount();
  const isLoggedIn = !!sessionStorage.getItem('sd_token');
  const user = (() => { try { return JSON.parse(sessionStorage.getItem('sd_user')); } catch { return null; } })();

  document.body.insertAdjacentHTML('afterbegin', `
  <nav class="navbar">
    <div class="container">
      <a href="homepage.html" class="navbar-brand">Street<span class="dot">Doko</span></a>
      <ul class="navbar-nav">
        ${links.map(l => `<li><a href="${l.href}" class="nav-link ${current === l.href ? 'active' : ''}">${l.label}</a></li>`).join('')}
      </ul>
      <div class="navbar-actions">
        <button class="cart-btn" onclick="window.location.href='checkout.html'">
          🛒 Cart <span class="cart-badge">${count}</span>
        </button>
        ${isLoggedIn
          ? `<span class="text-sm" style="color:var(--ink-muted);font-size:13px;">${user ? user.first_name : ''}</span>
             <button class="btn btn-outline btn-sm" onclick="handleSignOut()">Sign Out</button>`
          : `<a href="login.html" class="btn btn-outline btn-sm">Sign In</a>`
        }
      </div>
    </div>
  </nav>`);

  // Sign-out handler
  window.handleSignOut = async function() {
    try {
      if (window.API) await API.logout();
      else { sessionStorage.removeItem('sd_token'); sessionStorage.removeItem('sd_user'); }
    } catch {}
    window.location.href = 'signin-landing.html';
  };
})();
