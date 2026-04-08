// navbar.js — shared navbar injected into all customer pages
(function () {
  const links = [
    { href: 'homepage.html',  label: 'Home' },
    { href: 'browse.html',    label: 'Shop' },
    { href: 'about.html',     label: 'About Us' },
    { href: 'profile.html',   label: 'My Account' },
  ];

  const current = window.location.pathname.split('/').pop();

  const navHTML = `
  <nav class="navbar">
    <div class="container">
      <a href="homepage.html" class="navbar-brand">Street<span class="dot">Doko</span></a>
      <ul class="navbar-nav">
        ${links.map(l => `
          <li><a href="${l.href}" class="nav-link ${current === l.href ? 'active' : ''}">${l.label}</a></li>
        `).join('')}
      </ul>
      <div class="navbar-actions">
        <button class="cart-btn" onclick="window.location.href='checkout.html'">
          🛒 Cart
          <span class="cart-badge">2</span>
        </button>
        <a href="login.html" class="btn btn-outline btn-sm">Sign Out</a>
      </div>
    </div>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', navHTML);
})();
