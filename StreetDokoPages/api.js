/**
 * api.js — StreetDoko Oracle REST API Layer
 * 
 * HOW TO USE:
 *   1. Set BASE_URL below to your Oracle REST Data Services (ORDS) base URL
 *      e.g. "https://your-oracle-host/ords/streetdoko"
 *   2. All functions return Promises. Use await or .then()
 *   3. On error, functions throw an Error with a user-friendly message
 * 
 * ORACLE ORDS ENDPOINT CONVENTION:
 *   GET    /ords/streetdoko/<module>/          → list
 *   GET    /ords/streetdoko/<module>/:id       → single record
 *   POST   /ords/streetdoko/<module>/          → create
 *   PUT    /ords/streetdoko/<module>/:id       → update
 *   DELETE /ords/streetdoko/<module>/:id       → delete
 */

const API = (() => {

  // ─── CONFIG ────────────────────────────────────────────────────────────────
  const BASE_URL = 'https://your-oracle-host/ords/streetdoko'; // ← CHANGE THIS

  // Set to true to use mock data instead of real API calls (for development)
  const USE_MOCK = true;

  // ─── CORE FETCH HELPER ─────────────────────────────────────────────────────
  async function request(method, path, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${path}`, opts);

    if (!res.ok) {
      let msg = `API error ${res.status}`;
      try { const e = await res.json(); msg = e.message || e.error || msg; } catch {}
      throw new Error(msg);
    }
    return res.json();
  }

  // Token helpers (stored in sessionStorage)
  function getToken() { return sessionStorage.getItem('sd_token'); }
  function setToken(t) { sessionStorage.setItem('sd_token', t); }
  function clearToken() { sessionStorage.removeItem('sd_token'); sessionStorage.removeItem('sd_user'); }
  function setUser(u) { sessionStorage.setItem('sd_user', JSON.stringify(u)); }
  function getUser() {
    try { return JSON.parse(sessionStorage.getItem('sd_user')); } catch { return null; }
  }
  function isLoggedIn() { return !!getToken(); }
  function requireLogin() {
    if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
  }

  // ─── MOCK DATA ─────────────────────────────────────────────────────────────
  // Populated from StreetDoko Oracle DB seed (message.txt)
  const MOCK = {
    products: [
      // ── Harrison Butchers (trader_id: 1) ──────────────────────────────────
      { product_id: 1,  name: 'Beef Mince 500g',         trader_id: 1, trader_name: 'Harrison Butchers',      category: 'Beef',       price: 4.99, original_price: null, stock_qty: 80, description: 'Freshly minced lean beef, locally sourced from Yorkshire farms.',                              allergens: 'None',                        image_url: null },
      { product_id: 2,  name: 'Sirloin Steak 250g',      trader_id: 1, trader_name: 'Harrison Butchers',      category: 'Beef',       price: 9.50, original_price: null, stock_qty: 30, description: 'Prime Yorkshire sirloin steak, dry-aged for 21 days.',                                        allergens: 'None',                        image_url: null },
      { product_id: 3,  name: 'Pork Sausages 400g',      trader_id: 1, trader_name: 'Harrison Butchers',      category: 'Pork',       price: 3.80, original_price: null, stock_qty: 60, description: 'Traditional thick pork sausages, hand-made with herbs and seasoning.',                        allergens: 'Gluten, Wheat',               image_url: null },
      { product_id: 4,  name: 'Chicken Breast 2pk',      trader_id: 1, trader_name: 'Harrison Butchers',      category: 'Poultry',    price: 5.20, original_price: null, stock_qty: 50, description: 'Free-range British chicken breasts, approximately 400g per pack.',                           allergens: 'None',                        image_url: null },
      { product_id: 5,  name: 'Lamb Mince 500g',         trader_id: 1, trader_name: 'Harrison Butchers',      category: 'Lamb',       price: 5.60, original_price: null, stock_qty: 40, description: 'Freshly minced lamb, great for shepherd\'s pie and koftas.',                                 allergens: 'None',                        image_url: null },
      { product_id: 6,  name: 'Diced Lamb 400g',         trader_id: 1, trader_name: 'Harrison Butchers',      category: 'Lamb',       price: 6.40, original_price: null, stock_qty: 30, description: 'Lean diced leg of lamb, perfect for curries and casseroles.',                                 allergens: 'None',                        image_url: null },
      { product_id: 7,  name: 'Pork Chops 2pk',          trader_id: 1, trader_name: 'Harrison Butchers',      category: 'Pork',       price: 4.20, original_price: null, stock_qty: 45, description: 'Thick cut loin pork chops with bone, locally reared.',                                       allergens: 'None',                        image_url: null },
      { product_id: 8,  name: 'Beef Burger Patties 4pk', trader_id: 1, trader_name: 'Harrison Butchers',      category: 'Beef',       price: 5.50, original_price: null, stock_qty: 60, description: 'Handmade 100% beef burger patties, seasoned lightly.',                                        allergens: 'None',                        image_url: null },
      { product_id: 9,  name: 'Turkey Breast 600g',      trader_id: 1, trader_name: 'Harrison Butchers',      category: 'Poultry',    price: 7.20, original_price: null, stock_qty: 20, description: 'British turkey breast joint, skinless and boned.',                                            allergens: 'None',                        image_url: null },

      // ── Greenwood Greengrocers (trader_id: 2) ─────────────────────────────
      { product_id: 10, name: 'Carrots 1kg',              trader_id: 2, trader_name: 'Greenwood Greengrocers', category: 'Vegetables', price: 1.20, original_price: null, stock_qty: 150, description: 'Fresh locally grown Chantenay carrots, unwashed.',                                           allergens: 'None',                        image_url: null },
      { product_id: 11, name: 'Broccoli Head',            trader_id: 2, trader_name: 'Greenwood Greengrocers', category: 'Vegetables', price: 1.00, original_price: null, stock_qty: 100, description: 'Fresh broccoli head, approximately 400g, locally grown.',                                   allergens: 'None',                        image_url: null },
      { product_id: 12, name: 'New Potatoes 1kg',         trader_id: 2, trader_name: 'Greenwood Greengrocers', category: 'Vegetables', price: 1.50, original_price: null, stock_qty: 180, description: 'Fresh Yorkshire new potatoes, unwashed, in season.',                                        allergens: 'None',                        image_url: null },
      { product_id: 13, name: 'Baking Potatoes 4pk',      trader_id: 2, trader_name: 'Greenwood Greengrocers', category: 'Vegetables', price: 2.00, original_price: null, stock_qty: 120, description: 'Large Maris Piper baking potatoes, ideal for jacket potatoes.',                             allergens: 'None',                        image_url: null },
      { product_id: 14, name: 'Cherry Tomatoes 300g',     trader_id: 2, trader_name: 'Greenwood Greengrocers', category: 'Vegetables', price: 1.80, original_price: null, stock_qty: 90,  description: 'Sweet vine-ripened cherry tomatoes on the stem.',                                           allergens: 'None',                        image_url: null },
      { product_id: 15, name: 'Red Apples 1kg',           trader_id: 2, trader_name: 'Greenwood Greengrocers', category: 'Fruit',      price: 2.00, original_price: null, stock_qty: 130, description: 'Crisp seasonal Braeburn red apples, locally sourced.',                                      allergens: 'None',                        image_url: null },
      { product_id: 16, name: 'Strawberries 400g',        trader_id: 2, trader_name: 'Greenwood Greengrocers', category: 'Fruit',      price: 2.50, original_price: null, stock_qty: 60,  description: 'Fresh British strawberries, in season from local growers.',                                  allergens: 'None',                        image_url: null },
      { product_id: 17, name: 'Seasonal Veg Box',         trader_id: 2, trader_name: 'Greenwood Greengrocers', category: 'Vegetables', price: 4.50, original_price: null, stock_qty: 40,  description: 'Mixed seasonal vegetables from local Yorkshire farms, approx 1.5kg.',                       allergens: 'None',                        image_url: null },

      // ── Fisher Fishmongers (trader_id: 3) ────────────────────────────────
      { product_id: 18, name: 'Cod Fillet 300g',          trader_id: 3, trader_name: 'Fisher Fishmongers',     category: 'White Fish', price: 5.80, original_price: null, stock_qty: 45,  description: 'Fresh thick-cut cod fillet, sustainably sourced from North Sea.',                           allergens: 'Fish',                        image_url: null },
      { product_id: 19, name: 'Haddock Fillet 300g',      trader_id: 3, trader_name: 'Fisher Fishmongers',     category: 'White Fish', price: 5.40, original_price: null, stock_qty: 40,  description: 'Fresh haddock fillet, caught daily from local waters.',                                     allergens: 'Fish',                        image_url: null },
      { product_id: 20, name: 'Sea Bass Fillet 250g',     trader_id: 3, trader_name: 'Fisher Fishmongers',     category: 'White Fish', price: 7.50, original_price: null, stock_qty: 25,  description: 'Premium fresh sea bass fillet, skin on.',                                                   allergens: 'Fish',                        image_url: null },
      { product_id: 21, name: 'Salmon Fillet 300g',       trader_id: 3, trader_name: 'Fisher Fishmongers',     category: 'Oily Fish',  price: 6.50, original_price: null, stock_qty: 50,  description: 'Fresh Atlantic salmon fillet, skin on, pin-boned.',                                         allergens: 'Fish',                        image_url: null },
      { product_id: 22, name: 'Smoked Salmon 100g',       trader_id: 3, trader_name: 'Fisher Fishmongers',     category: 'Oily Fish',  price: 5.50, original_price: null, stock_qty: 45,  description: 'Scottish smoked salmon slices, cold smoked.',                                               allergens: 'Fish',                        image_url: null },
      { product_id: 23, name: 'King Prawns 200g',         trader_id: 3, trader_name: 'Fisher Fishmongers',     category: 'Seafood',    price: 7.20, original_price: null, stock_qty: 30,  description: 'Raw shell-off king prawns, fresh not frozen.',                                               allergens: 'Crustaceans',                 image_url: null },
      { product_id: 24, name: 'Mussels 500g',             trader_id: 3, trader_name: 'Fisher Fishmongers',     category: 'Seafood',    price: 4.80, original_price: null, stock_qty: 25,  description: 'Fresh rope-grown mussels, cleaned and de-bearded.',                                         allergens: 'Molluscs',                    image_url: null },
      { product_id: 25, name: 'Scallops 6pk',             trader_id: 3, trader_name: 'Fisher Fishmongers',     category: 'Seafood',    price: 9.80, original_price: null, stock_qty: 20,  description: 'Hand-dived king scallops, in half shell, approximately 300g.',                              allergens: 'Molluscs',                    image_url: null },

      // ── Cleckhuddersfax Bakery (trader_id: 4) ────────────────────────────
      { product_id: 26, name: 'White Bloomer Loaf',       trader_id: 4, trader_name: 'Cleckhuddersfax Bakery', category: 'Bread',      price: 1.80, original_price: null, stock_qty: 60,  description: 'Large freshly baked white bloomer, crusty outside soft inside.',                            allergens: 'Gluten, Wheat',               image_url: null },
      { product_id: 27, name: 'Wholemeal Loaf',           trader_id: 4, trader_name: 'Cleckhuddersfax Bakery', category: 'Bread',      price: 2.00, original_price: null, stock_qty: 55,  description: 'Freshly baked wholemeal loaf, made with stoneground flour.',                               allergens: 'Gluten, Wheat',               image_url: null },
      { product_id: 28, name: 'Sourdough Loaf',           trader_id: 4, trader_name: 'Cleckhuddersfax Bakery', category: 'Bread',      price: 3.50, original_price: null, stock_qty: 30,  description: 'Authentic sourdough made with 24-hour proved starter, tangy flavour.',                      allergens: 'Gluten, Wheat',               image_url: null },
      { product_id: 29, name: 'Crusty Rolls 4pk',         trader_id: 4, trader_name: 'Cleckhuddersfax Bakery', category: 'Bread',      price: 1.60, original_price: null, stock_qty: 80,  description: 'Freshly baked crusty white rolls, perfect for sandwiches.',                                allergens: 'Gluten, Wheat',               image_url: null },
      { product_id: 30, name: 'Victoria Sponge Slice',    trader_id: 4, trader_name: 'Cleckhuddersfax Bakery', category: 'Cakes',      price: 2.80, original_price: null, stock_qty: 25,  description: 'Classic Victoria sponge with strawberry jam and fresh cream.',                             allergens: 'Gluten, Dairy, Eggs, Wheat',  image_url: null },
      { product_id: 31, name: 'Chocolate Fudge Cake Slice', trader_id: 4, trader_name: 'Cleckhuddersfax Bakery', category: 'Cakes',   price: 3.20, original_price: null, stock_qty: 20,  description: 'Rich dark chocolate sponge with fudge buttercream frosting.',                              allergens: 'Gluten, Dairy, Eggs, Wheat',  image_url: null },
      { product_id: 32, name: 'Sausage Roll',             trader_id: 4, trader_name: 'Cleckhuddersfax Bakery', category: 'Pastries',   price: 1.50, original_price: null, stock_qty: 50,  description: 'Freshly baked large pork sausage roll with flaky shortcrust pastry.',                      allergens: 'Gluten, Wheat',               image_url: null },
      { product_id: 33, name: 'Almond Croissant',         trader_id: 4, trader_name: 'Cleckhuddersfax Bakery', category: 'Pastries',   price: 2.50, original_price: null, stock_qty: 25,  description: 'Buttery croissant filled with almond frangipane and flaked almonds.',                      allergens: 'Gluten, Dairy, Eggs, Nuts',   image_url: null },

      // ── Cooper's Delicatessen (trader_id: 5) ─────────────────────────────
      { product_id: 34, name: 'Mature Yorkshire Cheddar 200g', trader_id: 5, trader_name: "Cooper's Delicatessen", category: 'Cheese',     price: 4.50, original_price: null, stock_qty: 55, description: 'Aged 18-month Yorkshire cheddar, strong and crumbly.',                             allergens: 'Dairy, Milk',                 image_url: null },
      { product_id: 35, name: 'Wensleydale with Cranberries 150g', trader_id: 5, trader_name: "Cooper's Delicatessen", category: 'Cheese', price: 3.80, original_price: null, stock_qty: 40, description: 'Classic Yorkshire Wensleydale blended with sweet cranberries.',                   allergens: 'Dairy, Milk',                 image_url: null },
      { product_id: 36, name: 'Manchego 150g',            trader_id: 5, trader_name: "Cooper's Delicatessen", category: 'Cheese',     price: 5.00, original_price: null, stock_qty: 25,  description: 'Spanish sheep milk Manchego cheese, firm and nutty flavour.',                              allergens: 'Dairy, Milk',                 image_url: null },
      { product_id: 37, name: 'Italian Prosciutto 80g',   trader_id: 5, trader_name: "Cooper's Delicatessen", category: 'Deli Meats', price: 4.80, original_price: null, stock_qty: 40,  description: 'Thinly sliced Italian Prosciutto di Parma, air-dried ham.',                                allergens: 'None',                        image_url: null },
      { product_id: 38, name: 'Honey Roast Ham 150g',     trader_id: 5, trader_name: "Cooper's Delicatessen", category: 'Deli Meats', price: 3.60, original_price: null, stock_qty: 50,  description: 'Carved honey roast British ham, hand sliced.',                                              allergens: 'None',                        image_url: null },
      { product_id: 39, name: 'Kalamata Olives 150g',     trader_id: 5, trader_name: "Cooper's Delicatessen", category: 'Deli Extras',price: 2.80, original_price: null, stock_qty: 60,  description: 'Greek Kalamata olives marinated in herbs and olive oil.',                                  allergens: 'None',                        image_url: null },
      { product_id: 40, name: 'Hummus 200g',              trader_id: 5, trader_name: "Cooper's Delicatessen", category: 'Deli Extras',price: 2.40, original_price: null, stock_qty: 50,  description: 'Freshly made classic hummus with extra virgin olive oil drizzle.',                         allergens: 'Sesame',                      image_url: null },
    ],
    traders: [
      { trader_id: 1, slug: 'harrison-butchers',        name: 'Harrison Butchers',        description: 'Traditional family butcher in Cleckhuddersfax since 1987. Locally sourced meats.',                       item_count: 9  },
      { trader_id: 2, slug: 'greenwood-greengrocers',   name: 'Greenwood Greengrocers',   description: 'Fresh seasonal fruit and vegetables sourced daily from local Yorkshire farms.',                           item_count: 8  },
      { trader_id: 3, slug: 'fisher-fishmongers',       name: 'Fisher Fishmongers',       description: 'Fresh fish and seafood delivered every morning from the Yorkshire coast.',                                item_count: 8  },
      { trader_id: 4, slug: 'cleckhuddersfax-bakery',  name: 'Cleckhuddersfax Bakery',   description: 'Freshly baked breads, cakes and pastries made from scratch every morning.',                              item_count: 8  },
      { trader_id: 5, slug: 'coopers-delicatessen',     name: "Cooper's Delicatessen",    description: 'Speciality cheeses, cured meats and continental products from across Europe.',                           item_count: 7  },
    ],
    orders: [
      // From SQL seed: ORDER 1 — Customer_ID 7 (Alice Booth), Slot 1 (08-Apr-2026 10:00–13:00)
      { order_id: 1, order_ref: 'ORD-0001', created_at: '2026-04-08', slot_date: '2026-04-08', slot_time: '10:00 – 13:00', slot_ref: 'SLOT-001', subtotal: 6.40, discount: 0, total: 6.40, status: 'collected',
        items: [
          { product_id: 16, name: 'Strawberries 400g', trader_name: 'Greenwood Greengrocers', qty: 2, unit_price: 2.50, subtotal: 5.00 },
          { product_id: 17, name: 'Seasonal Veg Box',  trader_name: 'Greenwood Greengrocers', qty: 4, unit_price: 1.00, subtotal: 4.00 },
        ]
      },
      // ORDER 2 — Customer_ID 8 (Robert Shaw), Slot 2 (08-Apr-2026 13:00–16:00)
      { order_id: 2, order_ref: 'ORD-0002', created_at: '2026-04-07', slot_date: '2026-04-08', slot_time: '13:00 – 16:00', slot_ref: 'SLOT-002', subtotal: 4.80, discount: 0, total: 4.80, status: 'collected',
        items: [
          { product_id: 10, name: 'Carrots 1kg',       trader_name: 'Greenwood Greengrocers', qty: 2, unit_price: 1.20, subtotal: 2.40 },
          { product_id: 11, name: 'Broccoli Head',     trader_name: 'Greenwood Greengrocers', qty: 2, unit_price: 0.90, subtotal: 1.80 },
        ]
      },
      // ORDER 3 — Customer_ID 9 (Janet Wood), Slot 3 (08-Apr-2026 16:00–19:00)
      { order_id: 3, order_ref: 'ORD-0003', created_at: '2026-04-06', slot_date: '2026-04-08', slot_time: '16:00 – 19:00', slot_ref: 'SLOT-003', subtotal: 6.60, discount: 0, total: 6.60, status: 'collected',
        items: [
          { product_id: 21, name: 'Salmon Fillet 300g', trader_name: 'Fisher Fishmongers',    qty: 3, unit_price: 1.40, subtotal: 4.20 },
          { product_id: 24, name: 'Mussels 500g',        trader_name: 'Fisher Fishmongers',    qty: 2, unit_price: 1.20, subtotal: 2.40 },
        ]
      },
    ],
    // Collection slots from DB seed: Wed/Thu/Fri across two weeks, 3 time bands each, capacity 20
    slots: [
      { date: '2026-04-08', day: 'Wednesday', times: [
        { slot_id: 1, time: '10:00 – 13:00', orders: 0,  cap: 20 },
        { slot_id: 2, time: '13:00 – 16:00', orders: 0,  cap: 20 },
        { slot_id: 3, time: '16:00 – 19:00', orders: 0,  cap: 20 },
      ]},
      { date: '2026-04-09', day: 'Thursday',  times: [
        { slot_id: 4, time: '10:00 – 13:00', orders: 0,  cap: 20 },
        { slot_id: 5, time: '13:00 – 16:00', orders: 0,  cap: 20 },
        { slot_id: 6, time: '16:00 – 19:00', orders: 0,  cap: 20 },
      ]},
      { date: '2026-04-10', day: 'Friday',    times: [
        { slot_id: 7, time: '10:00 – 13:00', orders: 0,  cap: 20 },
        { slot_id: 8, time: '13:00 – 16:00', orders: 0,  cap: 20 },
        { slot_id: 9, time: '16:00 – 19:00', orders: 0,  cap: 20 },
      ]},
      { date: '2026-04-15', day: 'Wednesday', times: [
        { slot_id: 10, time: '10:00 – 13:00', orders: 0, cap: 20 },
        { slot_id: 11, time: '13:00 – 16:00', orders: 0, cap: 20 },
        { slot_id: 12, time: '16:00 – 19:00', orders: 0, cap: 20 },
      ]},
      { date: '2026-04-16', day: 'Thursday',  times: [
        { slot_id: 13, time: '10:00 – 13:00', orders: 0, cap: 20 },
        { slot_id: 14, time: '13:00 – 16:00', orders: 0, cap: 20 },
        { slot_id: 15, time: '16:00 – 19:00', orders: 0, cap: 20 },
      ]},
      { date: '2026-04-17', day: 'Friday',    times: [
        { slot_id: 16, time: '10:00 – 13:00', orders: 0, cap: 20 },
        { slot_id: 17, time: '13:00 – 16:00', orders: 0, cap: 20 },
        { slot_id: 18, time: '16:00 – 19:00', orders: 0, cap: 20 },
      ]},
    ],
    reviews: [
      { review_id: 1, product_id: 2,  user_name: 'Alice B.',   location: 'Cleckhuddersfax', rating: 5, comment: 'Incredible sirloin — you can really taste the difference with the dry-aging. Worth every penny.' },
      { review_id: 2, product_id: 21, user_name: 'Robert S.',  location: 'Cleckhuddersfax', rating: 5, comment: 'The salmon was so fresh. Much better than anything from the supermarket.' },
      { review_id: 3, product_id: 28, user_name: 'Janet W.',   location: 'Cleckhuddersfax', rating: 5, comment: 'Best sourdough I\'ve had outside of a proper bakery in London. Amazing crust.' },
      { review_id: 4, product_id: 36, user_name: 'Peter H.',   location: 'Cleckhuddersfax', rating: 4, comment: 'The Manchego is excellent — firm, nutty, exactly what you\'d hope for. Great with the olives too.' },
      { review_id: 5, product_id: 16, user_name: 'Susan B.',   location: 'Cleckhuddersfax', rating: 5, comment: 'Strawberries were perfectly ripe. You can really tell they\'re locally grown.' },
    ],
  };

  // ─── MOCK REQUEST SIMULATOR ────────────────────────────────────────────────
  async function mockRequest(method, path, body = null) {
    await new Promise(r => setTimeout(r, 180 + Math.random() * 150)); // simulate latency

    // AUTH
    if (method === 'POST' && path === '/auth/login') {
      if (!body.email || !body.password) throw new Error('Email and password required');
      const fakeToken = 'mock_jwt_' + Math.random().toString(36).slice(2);
      const user = { user_id: 1, first_name: 'Jane', last_name: 'Smith', email: body.email, phone: '+44 7700 900142', role: body.is_trader ? 'trader' : 'customer', created_at: '2025-01-15' };
      return { token: fakeToken, user };
    }
    if (method === 'POST' && path === '/auth/register') {
      if (!body.email || !body.password) throw new Error('Email and password required');
      const fakeToken = 'mock_jwt_' + Math.random().toString(36).slice(2);
      const user = { user_id: 99, first_name: body.first_name, last_name: body.last_name, email: body.email, phone: body.phone || '', role: body.role || 'customer', created_at: new Date().toISOString().slice(0,10) };
      return { token: fakeToken, user };
    }
    if (method === 'POST' && path === '/auth/logout') return { success: true };

    // PRODUCTS
    if (method === 'GET' && path.startsWith('/products')) {
      const url = new URL('http://x' + path);
      const trader = url.searchParams.get('trader');
      const search = url.searchParams.get('q');
      const cat = url.searchParams.get('category');
      const productId = path.match(/\/products\/(\d+)/)?.[1];
      if (productId) {
        const p = MOCK.products.find(p => p.product_id == productId);
        if (!p) throw new Error('Product not found');
        return { product: p, reviews: MOCK.reviews.filter(r => r.product_id == productId) };
      }
      let list = [...MOCK.products];
      if (trader) {
        const matchedTrader = MOCK.traders.find(t => t.slug === trader);
        list = list.filter(p => matchedTrader ? p.trader_id === matchedTrader.trader_id : p.trader_name.toLowerCase().replace(/\s+/g,'').includes(trader.toLowerCase().replace(/\s+/g,'')));
      }
      if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
      if (cat) list = list.filter(p => p.category.toLowerCase() === cat.toLowerCase());
      return { items: list, total: list.length };
    }

    // TRADERS
    if (method === 'GET' && path.startsWith('/traders')) {
      const slug = path.match(/\/traders\/([^?]+)/)?.[1];
      if (slug && slug !== 'traders') {
        const t = MOCK.traders.find(t => t.slug === slug);
        if (!t) throw new Error('Trader not found');
        return { trader: t };
      }
      return { items: MOCK.traders };
    }

    // ORDERS
    if (method === 'GET' && path.startsWith('/orders')) {
      const orderId = path.match(/\/orders\/(\d+)/)?.[1];
      if (orderId) {
        const o = MOCK.orders.find(o => o.order_id == orderId);
        if (!o) throw new Error('Order not found');
        return { order: o };
      }
      return { items: MOCK.orders, total_spend: 214.60 };
    }
    if (method === 'POST' && path === '/orders') {
      const newId = Math.floor(Math.random() * 1000);
      return { order: { order_id: newId, order_ref: `ORD-${String(newId).padStart(4,'0')}`, ...body, status: 'pending', created_at: new Date().toISOString().slice(0,10) } };
    }

    // SLOTS
    if (method === 'GET' && path.startsWith('/slots')) {
      return { items: MOCK.slots };
    }
    if (method === 'POST' && path === '/slots/book') {
      return { booking: { slot_ref: 'BOO-' + Math.floor(Math.random()*9000+1000), ...body } };
    }

    // COUPONS
    if (method === 'POST' && path === '/coupons/validate') {
      if (body.code === 'FRESH10') return { valid: true, discount_type: 'percent', discount_value: 10, label: 'FRESH10 — 10% off' };
      throw new Error('Invalid coupon code');
    }

    // USER PROFILE
    if (method === 'GET' && path === '/user/profile') {
      return { user: { user_id: 1, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', phone: '+44 7700 900142', role: 'customer', created_at: '2025-01-15' } };
    }
    if (method === 'PUT' && path === '/user/profile') {
      return { user: { ...body }, success: true };
    }
    if (method === 'PUT' && path === '/user/password') {
      if (!body.current_password || !body.new_password) throw new Error('All password fields required');
      return { success: true };
    }
    if (method === 'DELETE' && path === '/user/account') {
      return { success: true };
    }

    throw new Error(`No mock handler for ${method} ${path}`);
  }

  // ─── DISPATCHER ────────────────────────────────────────────────────────────
  async function call(method, path, body = null) {
    if (USE_MOCK) return mockRequest(method, path, body);
    return request(method, path, body, getToken());
  }

  // ─── PUBLIC API ────────────────────────────────────────────────────────────
  return {
    // ── Config helpers ──────────────────────────────────────────────────────
    getToken, setToken, clearToken,
    getUser, setUser,
    isLoggedIn, requireLogin,

    // ── Auth ────────────────────────────────────────────────────────────────
    /** POST /auth/login */
    async login(email, password, is_trader = false) {
      const data = await call('POST', '/auth/login', { email, password, is_trader });
      setToken(data.token);
      setUser(data.user);
      return data;
    },

    /** POST /auth/register */
    async register(payload) {
      const data = await call('POST', '/auth/register', payload);
      setToken(data.token);
      setUser(data.user);
      return data;
    },

    /** POST /auth/logout */
    async logout() {
      await call('POST', '/auth/logout');
      clearToken();
    },

    // ── Products ────────────────────────────────────────────────────────────
    /** GET /products?trader=&q=&category= */
    async getProducts(params = {}) {
      const qs = new URLSearchParams(params).toString();
      return call('GET', `/products${qs ? '?' + qs : ''}`);
    },

    /** GET /products/:id  (includes reviews) */
    async getProduct(id) {
      return call('GET', `/products/${id}`);
    },

    // ── Traders ─────────────────────────────────────────────────────────────
    /** GET /traders */
    async getTraders() {
      return call('GET', '/traders');
    },

    /** GET /traders/:slug */
    async getTrader(slug) {
      return call('GET', `/traders/${slug}`);
    },

    // ── Orders ──────────────────────────────────────────────────────────────
    /** GET /orders  (current user's orders) */
    async getOrders() {
      return call('GET', '/orders');
    },

    /** GET /orders/:id */
    async getOrder(id) {
      return call('GET', `/orders/${id}`);
    },

    /** POST /orders */
    async createOrder(payload) {
      return call('POST', '/orders', payload);
    },

    // ── Slots ────────────────────────────────────────────────────────────────
    /** GET /slots?year=&month= */
    async getSlots(year, month) {
      return call('GET', `/slots?year=${year}&month=${month}`);
    },

    /** POST /slots/book */
    async bookSlot(payload) {
      return call('POST', '/slots/book', payload);
    },

    // ── Coupons ──────────────────────────────────────────────────────────────
    /** POST /coupons/validate  { code } */
    async validateCoupon(code) {
      return call('POST', '/coupons/validate', { code });
    },

    // ── User Profile ─────────────────────────────────────────────────────────
    /** GET /user/profile */
    async getProfile() {
      return call('GET', '/user/profile');
    },

    /** PUT /user/profile */
    async updateProfile(payload) {
      return call('PUT', '/user/profile', payload);
    },

    /** PUT /user/password  { current_password, new_password } */
    async changePassword(current_password, new_password) {
      return call('PUT', '/user/password', { current_password, new_password });
    },

    /** DELETE /user/account */
    async deleteAccount() {
      await call('DELETE', '/user/account');
      clearToken();
    },

    // ── Cart (client-side, stored in localStorage) ───────────────────────────
    cart: {
      get() {
        try { return JSON.parse(localStorage.getItem('sd_cart') || '[]'); } catch { return []; }
      },
      save(items) {
        localStorage.setItem('sd_cart', JSON.stringify(items));
        document.querySelectorAll('.cart-badge').forEach(b => b.textContent = items.reduce((s, i) => s + i.qty, 0));
      },
      add(product, qty = 1) {
        const items = this.get();
        const existing = items.find(i => i.product_id === product.product_id);
        if (existing) existing.qty = Math.min(6, existing.qty + qty);
        else items.push({ product_id: product.product_id, name: product.name, trader_name: product.trader_name, price: product.price, qty, sku: product.sku });
        this.save(items);
      },
      remove(product_id) {
        this.save(this.get().filter(i => i.product_id !== product_id));
      },
      update(product_id, qty) {
        const items = this.get();
        const item = items.find(i => i.product_id === product_id);
        if (item) { item.qty = Math.max(1, Math.min(6, qty)); this.save(items); }
      },
      clear() { this.save([]); },
      total() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },
      count() { return this.get().reduce((s, i) => s + i.qty, 0); },
    },

    // ── UI helpers ─────────────────────────────────────────────────────────
    showLoading(el, msg = 'Loading…') {
      if (typeof el === 'string') el = document.getElementById(el);
      if (el) el.innerHTML = `<div class="api-loading">${msg}</div>`;
    },
    showError(el, msg) {
      if (typeof el === 'string') el = document.getElementById(el);
      if (el) el.innerHTML = `<div class="api-error">⚠ ${msg}</div>`;
    },
  };
})();

/* ── CSS helpers injected once ─────────────────────────────────────────────── */
(function injectApiStyles() {
  if (document.getElementById('api-styles')) return;
  const s = document.createElement('style');
  s.id = 'api-styles';
  s.textContent = `
    .api-loading { padding: 40px; text-align: center; color: var(--ink-muted, #888); font-size: 14px; }
    .api-loading::before { content: ''; display: block; width: 28px; height: 28px; border: 3px solid #ddd;
      border-top-color: var(--primary, #2c6e49); border-radius: 50%; animation: spin .7s linear infinite; margin: 0 auto 12px; }
    .api-error { padding: 20px; text-align: center; color: #c0392b; background: #fdf3f2; border-radius: 8px; font-size: 14px; margin: 16px 0; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .btn[disabled], button[disabled] { opacity: .5; cursor: not-allowed; }
  `;
  document.head.appendChild(s);
})();