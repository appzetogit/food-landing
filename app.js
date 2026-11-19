/* GoodFood4You — front-end demo logic (cart, checkout, profile, menus, loaders) */
(() => {
"use strict";

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG = (id, w = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
const rs = n => "₹" + Math.round(n).toLocaleString("en-IN");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem("gf4u_" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("gf4u_" + k, JSON.stringify(v)); } catch {} }
};
const FB = "this.onerror=null;this.style.opacity=0";

/* ---------- data ---------- */
const P = {
  thali: "1546833999-b9f581a1996d", idli: "1589301760014-d929f3979dbc", pbm: "1631452180519-c014fe946bc7",
  ptikka: "1567188040759-fb8a883dc6d8", pavbhaji: "1626132647523-66f5bf380027", chaat: "1610192244261-3f33de3f55e4",
  kadai: "1596797038530-2c107229654b", idlivada: "1630383249896-424e482df921", dosa: "1668236543090-82eba5ee5976",
  samosa: "1601050690117-94f5f6fa8bd7", kofta: "1606471191009-63994c53433b", shahi: "1588166524941-3bf61a9c41db",
  daltadka: "1517244683847-7456b63c5969", noodles: "1585032226651-759b368d7246", gujthali: "1680993032090-1ef7ea9b51e5",
  dalmakhani: "1567337710282-00832b415979", vegbiryani: "1603133872878-684f208fb84b", palak: "1589647363585-f4a7d3877b10",
  ctikka: "1645177628172-a94c1f96e6db", kebab: "1599487488170-d11ec9c172f0", butterchicken: "1694579740719-0e601c5d2437",
  mutton: "1505253758473-96b7015fcd40", fish: "1574484284002-952d92456975", naanchicken: "1565557623262-b51c2513a641",
  pizza: "1565299624946-b28f40a0ae38", burger: "1568901346375-23c9450c58cd", biryani: "1563379091339-03b21ab4a4f8",
  north: "1585937421612-70a008356fbe", bowl: "1512621776951-a57141f2eefd", salad: "1540189549336-e6e99c3679fe",
  pancake: "1567620905732-2d1ec7ab7445", samosa2: "1601050690597-df0568f70950", rustic: "1504674900247-0877df9cc836"
};

const DISHES = [
  { id: "pbm", n: "Paneer Butter Masala", cat: "North Indian", veg: 1, p: 249, m: 299, img: P.pbm, d: "Soft paneer cubes in a rich, buttery tomato-cashew gravy.", best: 1, k: "paneer curry" },
  { id: "dalmakhani", n: "Dal Makhani", cat: "North Indian", veg: 1, p: 199, m: 239, img: P.dalmakhani, d: "Slow-cooked black lentils with cream & butter, served with papad.", best: 1, k: "dal" },
  { id: "palak", n: "Palak Paneer", cat: "North Indian", veg: 1, p: 229, img: P.palak, d: "Fresh spinach puree with cottage cheese and mild spices.", k: "paneer spinach" },
  { id: "kofta", n: "Malai Kofta", cat: "North Indian", veg: 1, p: 239, img: P.kofta, d: "Paneer-potato dumplings in a silky, mildly sweet gravy.", k: "kofta curry" },
  { id: "kadai", n: "Kadai Veg Masala", cat: "North Indian", veg: 1, p: 209, img: P.kadai, d: "Mixed veggies tossed with capsicum & freshly ground kadai masala.", k: "curry veg" },
  { id: "shahi", n: "Shahi Paneer with Jeera Rice", cat: "North Indian", veg: 1, p: 219, img: P.shahi, d: "Royal paneer curry paired with fragrant cumin rice.", k: "paneer rice" },
  { id: "daltadka", n: "Dal Tadka", cat: "North Indian", veg: 1, p: 169, img: P.daltadka, d: "Yellow dal tempered with ghee, garlic and red chillies.", k: "dal" },
  { id: "dosa", n: "Masala Dosa", cat: "South Indian", veg: 1, p: 129, m: 149, img: P.dosa, d: "Crispy rice crepe with spiced potato, sambar & chutneys.", best: 1, k: "dosa south" },
  { id: "idli", n: "Idli Sambar (4 pcs)", cat: "South Indian", veg: 1, p: 89, img: P.idli, d: "Fluffy steamed idlis with piping hot sambar & coconut chutney.", k: "idli south" },
  { id: "idlivada", n: "Idli Vada Combo", cat: "South Indian", veg: 1, p: 109, img: P.idlivada, d: "2 idlis + 1 medu vada with sambar and 3 chutneys.", k: "idli vada south" },
  { id: "pavbhaji", n: "Mumbai Pav Bhaji", cat: "Street Food", veg: 1, p: 139, m: 159, img: P.pavbhaji, d: "Buttery mashed veg bhaji with toasted pav, onion & lemon.", best: 1, k: "pav bhaji mumbai" },
  { id: "chaat", n: "Papdi Chaat", cat: "Street Food", veg: 1, p: 99, img: P.chaat, d: "Crunchy papdi, curd, tangy chutneys and sev.", k: "chaat" },
  { id: "samosa", n: "Punjabi Samosa (2 pcs)", cat: "Street Food", veg: 1, p: 49, img: P.samosa, d: "Flaky pastry stuffed with spiced potato & peas, with chutney.", k: "samosa snacks" },
  { id: "ptikka", n: "Paneer Tikka", cat: "Street Food", veg: 1, p: 229, img: P.ptikka, d: "Char-grilled paneer & veggies marinated in tandoori masala.", best: 1, k: "paneer tikka tandoor starter" },
  { id: "thali", n: "Royal Veg Thali", cat: "Thalis", veg: 1, p: 299, m: 349, img: P.thali, d: "2 sabzis, dal, rice, 3 rotis, raita, salad & sweet.", best: 1, k: "thali" },
  { id: "gujthali", n: "Gujarati Thali", cat: "Thalis", veg: 1, p: 329, img: P.gujthali, d: "Dal, kadhi, 3 shaak, rotli, rice, farsan & mithai.", k: "thali gujarati" },
  { id: "vegbiryani", n: "Veg Dum Biryani", cat: "Biryani & Rice", veg: 1, p: 199, img: P.vegbiryani, d: "Basmati rice slow-cooked with veggies, saffron & spices.", k: "biryani rice" },
  { id: "noodles", n: "Veg Hakka Noodles", cat: "Indo-Chinese", veg: 1, p: 159, img: P.noodles, d: "Wok-tossed noodles with crunchy veggies & soy.", k: "noodles chinese" },
  { id: "pizza", n: "Margherita Pizza", cat: "Pizza & Burgers", veg: 1, p: 249, img: P.pizza, d: "Classic tomato, mozzarella and fresh basil.", k: "pizza" },
  { id: "burger", n: "Classic Veg Burger", cat: "Pizza & Burgers", veg: 1, p: 149, img: P.burger, d: "Crispy veg patty, cheese, lettuce & house sauce.", k: "burger" },
  { id: "bowl", n: "Buddha Bowl", cat: "Healthy", veg: 1, p: 229, img: P.bowl, d: "Quinoa, chickpeas, greens & tahini dressing.", k: "healthy salad bowl" },
  { id: "salad", n: "Garden Fresh Salad", cat: "Healthy", veg: 1, p: 189, img: P.salad, d: "Seasonal greens with lemon-herb vinaigrette.", k: "healthy salad" },
  { id: "pancake", n: "Pancake Stack", cat: "Healthy", veg: 1, p: 179, img: P.pancake, d: "Fluffy pancakes with berries and maple syrup.", k: "breakfast" },
  { id: "butterchicken", n: "Butter Chicken", cat: "Non-Veg", veg: 0, p: 299, img: P.butterchicken, d: "Tandoori chicken in creamy makhani gravy.", k: "chicken curry" },
  { id: "ctikka", n: "Chicken Tikka", cat: "Non-Veg", veg: 0, p: 279, img: P.ctikka, d: "Smoky boneless chicken grilled in the tandoor.", k: "chicken tikka tandoor kebab" },
  { id: "kebab", n: "Seekh Kebab Platter", cat: "Non-Veg", veg: 0, p: 319, img: P.kebab, d: "Minced lamb skewers with mint chutney & onions.", k: "kebab tandoor" },
  { id: "mutton", n: "Mutton Rogan Josh", cat: "Non-Veg", veg: 0, p: 379, img: P.mutton, d: "Kashmiri-style slow-cooked mutton curry.", k: "mutton curry" },
  { id: "fish", n: "Goan Fish Curry", cat: "Non-Veg", veg: 0, p: 329, img: P.fish, d: "Tangy coconut curry with fresh fish.", k: "fish curry coastal" }
];
const D = Object.fromEntries(DISHES.map(d => [d.id, d]));

const RESTAURANTS = [
  { id: 1, n: "Shree Krishna Bhojanalaya", c: "Gujarati • Thalis", veg: 1, r: 4.7, t: 25, cost: 350, img: P.gujthali, off: "Flat ₹75 OFF on thalis", tag: "Featured", menu: ["gujthali", "thali", "daltadka", "samosa", "chaat"] },
  { id: 2, n: "Saravana Dosa Corner", c: "South Indian", veg: 1, r: 4.6, t: 20, cost: 250, img: P.dosa, off: "20% OFF on dosas", menu: ["dosa", "idli", "idlivada"] },
  { id: 3, n: "Punjabi Rasoi", c: "North Indian • Punjabi", veg: 0, r: 4.5, t: 30, cost: 500, img: P.pbm, off: "50% OFF up to ₹100", menu: ["pbm", "dalmakhani", "palak", "ptikka", "butterchicken", "ctikka"] },
  { id: 4, n: "Mumbai Chaat House", c: "Street Food • Snacks", veg: 1, r: 4.4, t: 15, cost: 200, img: P.pavbhaji, off: "Buy 1 Get 1 on chaat", menu: ["pavbhaji", "chaat", "samosa"] },
  { id: 5, n: "Royal Biryani House", c: "Biryani • Mughlai", veg: 0, r: 4.6, t: 35, cost: 450, img: P.biryani, off: "Free dessert above ₹399", menu: ["vegbiryani", "mutton", "ctikka", "kebab"] },
  { id: 6, n: "Tasty Tales", c: "North Indian", veg: 1, r: 5.0, t: 30, cost: 400, img: P.north, off: "Flat ₹75 OFF", tag: "Featured", menu: ["kofta", "kadai", "shahi", "daltadka", "dalmakhani"] },
  { id: 7, n: "Annapurna Sweets & Snacks", c: "Snacks • Pure Veg", veg: 1, r: 4.3, t: 20, cost: 150, img: P.samosa2, off: "15% OFF", menu: ["samosa", "chaat", "pavbhaji"] },
  { id: 8, n: "Flavour Kingdom", c: "Pizza • Multi-cuisine", veg: 1, r: 0, t: 25, cost: 350, img: P.pizza, off: "50% OFF up to ₹100", tag: "NEW", menu: ["pizza", "burger", "noodles"] },
  { id: 9, n: "Dragon Wok", c: "Indo-Chinese", veg: 1, r: 4.2, t: 25, cost: 300, img: P.noodles, off: "Combo at ₹199", menu: ["noodles", "vegbiryani"] },
  { id: 10, n: "Tandoor Tales", c: "Kebabs • Tandoor", veg: 0, r: 4.5, t: 30, cost: 550, img: P.kebab, off: "20% OFF", menu: ["ptikka", "ctikka", "kebab", "butterchicken"] },
  { id: 11, n: "Green Bowl Co.", c: "Healthy • Salads", veg: 1, r: 4.7, t: 20, cost: 400, img: P.salad, off: "15% OFF", menu: ["bowl", "salad", "pancake"] },
  { id: 12, n: "Aman Da Dhaba", c: "Punjabi • Dhaba", veg: 0, r: 4.3, t: 15, cost: 300, img: P.naanchicken, off: "Combo deals", menu: ["dalmakhani", "palak", "butterchicken", "samosa"] },
  { id: 13, n: "Burger Barn", c: "Burgers • Fast food", veg: 1, r: 4.4, t: 20, cost: 300, img: P.burger, off: "Buy 1 Get 1", menu: ["burger", "pizza"] },
  { id: 14, n: "Coastal Curry Co.", c: "Coastal • Seafood", veg: 0, r: 4.1, t: 40, cost: 600, img: P.fish, off: "Flat ₹100 OFF", menu: ["fish", "idli", "dosa"] },
  { id: 15, n: "Udupi Grand", c: "South Indian • Pure Veg", veg: 1, r: 4.8, t: 20, cost: 200, img: P.idlivada, off: "Free filter coffee", menu: ["idlivada", "idli", "dosa", "thali"] },
  { id: 16, n: "The Rustic Table", c: "North Indian", veg: 0, r: 0, t: 30, cost: 700, img: P.rustic, off: "Opening soon", tag: "OPENING SOON", soon: 1, menu: [] }
];
const R = Object.fromEntries(RESTAURANTS.map(r => [r.id, r]));
// which restaurant sells a dish (first match) — used when adding from the dish grid
const dishRest = id => RESTAURANTS.find(r => !r.soon && r.menu.includes(id));

const CUISINES = [
  ["Thali", P.thali, "thali"], ["Dosa", P.dosa, "dosa"], ["Paneer", P.pbm, "paneer"], ["Biryani", P.vegbiryani, "biryani"],
  ["Pav Bhaji", P.pavbhaji, "pav bhaji"], ["Chaat", P.chaat, "chaat"], ["Idli", P.idli, "idli"], ["Dal", P.dalmakhani, "dal"],
  ["Noodles", P.noodles, "noodles"], ["Pizza", P.pizza, "pizza"], ["Burger", P.burger, "burger"], ["Healthy", P.bowl, "healthy"],
  ["Kebabs", P.kebab, "kebab"]
];
const REGIONS = [
  ["North Indian", "Punjabi curries, dal & rotis", P.north, "North Indian"],
  ["South Indian", "Dosa, idli, vada & sambar", P.idlivada, "South Indian"],
  ["Royal Thalis", "Gujarati & Rajasthani meals", P.gujthali, "Thalis"],
  ["Mumbai Street Food", "Pav bhaji, chaat & samosa", P.pavbhaji, "Street Food"],
  ["Indo-Chinese", "Hakka noodles & more", P.noodles, "Indo-Chinese"]
];
const DCATS = ["All", "North Indian", "South Indian", "Street Food", "Thalis", "Biryani & Rice", "Indo-Chinese", "Healthy", "Pizza & Burgers", "Non-Veg"];
const RFILTERS = ["All", "Pure Veg", "Rating 4.5+", "Fast delivery", "Under ₹300", "Offers", "Favourites"];
const COUPONS = {
  GOOD50: { d: "50% off up to ₹100 (min ₹149)", calc: (t) => t >= 149 ? Math.min(100, t * .5) : -149 },
  VEGTHALI: { d: "₹75 off on thalis (min ₹299)", calc: (t, items) => items.some(i => D[i.id].cat === "Thalis") ? (t >= 299 ? 75 : -299) : -1 },
  DOSA20: { d: "20% off South Indian items", calc: (t, items) => { const s = items.filter(i => D[i.id].cat === "South Indian").reduce((a, i) => a + D[i.id].p * i.q, 0); return s ? s * .2 : -2; } },
  FREEDEL: { d: "Free delivery (min ₹199)", calc: (t) => t >= 199 ? 0 : -199, freeDel: 1 }
};

/* ---------- state ---------- */
const S = {
  cart: store.get("cart", []),               // [{id, q, rid}]
  favs: store.get("favs", []),               // [restaurantId]
  user: store.get("user", null),             // {name, phone}
  orders: store.get("orders", []),
  addrs: store.get("addrs", []),
  loc: store.get("loc", ""),
  veg: store.get("veg", false),
  coupon: store.get("coupon", ""),
  dcat: "All", rfilter: "All", q: "", shown: 8, step: "cart", pay: "cod", selAddr: 0, otp: null, pendingCheckout: false
};
const save = () => { store.set("cart", S.cart); store.set("favs", S.favs); store.set("user", S.user); store.set("orders", S.orders); store.set("addrs", S.addrs); store.set("loc", S.loc); store.set("veg", S.veg); store.set("coupon", S.coupon); };

/* ---------- toast ---------- */
let tT;
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tT); tT = setTimeout(() => t.classList.remove("show"), 2400); }

/* ---------- splash loader ---------- */
(function loader() {
  const bar = $("#ldBar"); let p = 0; const start = Date.now();
  const iv = setInterval(() => { p = Math.min(p + Math.random() * 18, 90); bar.style.width = p + "%"; }, 160);
  let fired = false;
  const finish = () => {
    if (fired) return; fired = true;
    const wait = Math.max(0, 1500 - (Date.now() - start));
    setTimeout(() => {
      clearInterval(iv); bar.style.width = "100%";
      setTimeout(() => { $("#loader").classList.add("done"); document.body.classList.remove("lock"); revealInit(); }, 300);
    }, wait);
  };
  // script runs at end of <body>, so the DOM is ready: just wait for the hero image (max 2.5s)
  const hero = document.getElementById("heroImg");
  if (hero.complete) finish(); else { hero.addEventListener("load", finish); hero.addEventListener("error", finish); }
  setTimeout(finish, 2500);
})();

/* ---------- scroll reveal & counters ---------- */
let revealed = false;
function revealInit() {
  if (revealed) return; revealed = true;
  if (!("IntersectionObserver" in window)) { $$(".rv").forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".rv").forEach(e => io.observe(e));
  $$("[data-count]").forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suf || "+"; let n = 0; const step = Math.ceil(end / 40);
    const iv = setInterval(() => { n = Math.min(end, n + step); el.textContent = n + suf; if (n >= end) clearInterval(iv); }, 30);
  });
}

/* ---------- hero typing + image swap ---------- */
(function typed() {
  const words = [["Paneer Tikka", P.ptikka], ["Masala Dosa", P.dosa], ["a Veg Thali", P.thali], ["Pav Bhaji", P.pavbhaji], ["Dal Makhani", P.dalmakhani]];
  const el = $("#typed"), img = $("#heroImg"); let wi = 0, ci = words[0][0].length, del = true;
  words.forEach(w => { const i = new Image(); i.src = IMG(w[1], 900); });
  setInterval(() => {
    const w = words[wi][0];
    if (del) { ci--; if (ci <= 0) { del = false; wi = (wi + 1) % words.length; img.style.opacity = 0; setTimeout(() => { img.src = IMG(words[wi][1], 900); img.style.opacity = 1; }, 300); } }
    else { ci++; if (ci >= words[wi][0].length) { del = true; ci = words[wi][0].length + 26; } }
    el.textContent = words[wi][0].slice(0, Math.max(0, Math.min(ci, words[wi][0].length)));
  }, 100);
})();

/* ---------- carousel ---------- */
(function carousel() {
  const slides = $("#slides"), n = slides.children.length, dots = $("#dots"); let i = 0, tm;
  dots.innerHTML = Array.from({ length: n }, (_, k) => `<button aria-label="Offer ${k + 1}"></button>`).join("");
  const go = k => { i = (k + n) % n; slides.style.transform = `translateX(-${i * 100}%)`; $$("button", dots).forEach((b, j) => b.classList.toggle("on", j === i)); clearInterval(tm); tm = setInterval(() => go(i + 1), 4500); };
  $$("button", dots).forEach((b, k) => b.onclick = () => go(k));
  $("#prevS").onclick = () => go(i - 1); $("#nextS").onclick = () => go(i + 1);
  let x0 = null; slides.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
  slides.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); x0 = null; });
  go(0);
})();
document.addEventListener("click", e => {
  const b = e.target.closest(".copy-code"); if (!b) return;
  const code = b.dataset.code; S.coupon = code; save();
  try { navigator.clipboard && navigator.clipboard.writeText(code); } catch {}
  toast(`Code ${code} copied & applied to your cart 🎉`); renderCart();
});

/* ---------- cuisines / regions ---------- */
$("#cuisineList").innerHTML = CUISINES.map(([n, i, k]) => `<button class="cu" data-k="${k}"><div class="ci"><img loading="lazy" src="${IMG(i, 240)}" alt="${n}" onerror="${FB}"></div><span>${n}</span></button>`).join("");
$("#cuisineList").onclick = e => {
  const c = e.target.closest(".cu"); if (!c) return;
  const on = c.classList.contains("on");
  $$(".cu").forEach(x => x.classList.remove("on"));
  if (on) { setQuery(""); return; }
  c.classList.add("on"); setQuery(c.dataset.k, true);
};
$("#clearCuisine").onclick = () => { $$(".cu").forEach(x => x.classList.remove("on")); setQuery(""); };
$("#regionList").innerHTML = REGIONS.map(([n, d, i, cat]) => `<button class="rg rv" data-cat="${cat}"><img loading="lazy" src="${IMG(i, 500)}" alt="${n}" onerror="${FB}"><div><h3>${n}</h3><p>${d}</p></div></button>`).join("");
$("#regionList").onclick = e => { const r = e.target.closest(".rg"); if (!r) return; setQuery(""); setDcat(r.dataset.cat); $("#dishes").scrollIntoView({ behavior: "smooth" }); };

function setQuery(q, scroll) {
  S.q = q.toLowerCase().trim(); S.shown = 8;
  $("#clearCuisine").style.display = S.q ? "" : "none";
  $("#topSearch").value = q; $("#heroInput").value = q;
  if (S.q) S.dcat = "All";
  renderDishFilters(); loadAnim(renderDishes, "#dishGrid", 4); loadAnim(renderRests, "#grid", 4);
  if (scroll) $("#dishes").scrollIntoView({ behavior: "smooth" });
}

/* ---------- skeleton loading ---------- */
const skel = n => Array.from({ length: n }, () => `<div class="sk"><div class="a"></div><div class="l"></div><div class="l s"></div></div>`).join("");
function loadAnim(fn, sel, n, ms = 450) { $(sel).innerHTML = skel(n); clearTimeout(loadAnim[sel]); loadAnim[sel] = setTimeout(fn, ms); }

/* ---------- dishes ---------- */
function renderDishFilters() {
  $("#dishFilters").innerHTML = DCATS.filter(c => !(S.veg && c === "Non-Veg")).map(c => `<button class="chip ${c === S.dcat ? "on" : ""}" data-c="${c}">${c === "Non-Veg" ? "🍗 " : ""}${c}</button>`).join("");
}
function setDcat(c) { S.dcat = c; renderDishFilters(); loadAnim(renderDishes, "#dishGrid", 4, 350); }
$("#dishFilters").onclick = e => { const c = e.target.closest(".chip"); if (c) setDcat(c.dataset.c); };
const matchQ = (txt) => !S.q || S.q.split(" ").every(w => txt.toLowerCase().includes(w));
function dishList() {
  return DISHES.filter(d => (!S.veg || d.veg) && (S.dcat === "All" || d.cat === S.dcat) && matchQ(d.n + " " + d.cat + " " + d.k));
}
const qtyOf = id => (S.cart.find(i => i.id === id) || {}).q || 0;
const addCtl = (id, disabled) => {
  const q = qtyOf(id);
  if (disabled) return `<button class="add" disabled>Soon</button>`;
  return q ? `<span class="qty"><button data-dec="${id}" aria-label="Remove one">−</button><span>${q}</span><button data-inc="${id}" aria-label="Add one">+</button></span>`
           : `<button class="add" data-inc="${id}">ADD</button>`;
};
function dishCard(d) {
  return `<article class="dc"><div class="im"><img loading="lazy" src="${IMG(d.img, 500)}" alt="${esc(d.n)}" onerror="${FB}">${d.best ? `<span class="bs">★ Bestseller</span>` : ""}</div>
    <div class="bd"><h4><span class="vmark ${d.veg ? "" : "nv"}" title="${d.veg ? "Veg" : "Non-veg"}"></span>${esc(d.n)}</h4><p class="ds">${esc(d.d)}</p>
    <div class="row"><span class="price">${rs(d.p)}${d.m ? `<s>${rs(d.m)}</s>` : ""}</span><span data-ctl="${d.id}">${addCtl(d.id)}</span></div></div></article>`;
}
function renderDishes() {
  const l = dishList();
  $("#dishGrid").innerHTML = l.length ? l.map(dishCard).join("") : `<div class="empty"><div class="e">🍽️</div><p>No dishes match "${esc(S.q)}"${S.veg ? " in pure veg" : ""}. Try something else!</p></div>`;
}

/* ---------- restaurants ---------- */
$("#filters").onclick = e => { const c = e.target.closest(".chip"); if (c) setRfilter(c.dataset.f); };
function renderRFilters() { $("#filters").innerHTML = RFILTERS.map(f => `<button class="chip ${f === S.rfilter ? "on" : ""}" data-f="${f}">${f === "Favourites" ? "❤️ " : f === "Pure Veg" ? "🌿 " : ""}${f}</button>`).join(""); }
function setRfilter(f) { S.rfilter = f; S.shown = 8; renderRFilters(); loadAnim(renderRests, "#grid", 4, 350); }
function restList() {
  return RESTAURANTS.filter(r => {
    if (S.veg && !r.veg) return false;
    if (!matchQ(r.n + " " + r.c + " " + r.menu.map(id => D[id].n + " " + D[id].k).join(" "))) return false;
    switch (S.rfilter) {
      case "Pure Veg": return r.veg;
      case "Rating 4.5+": return r.r >= 4.5;
      case "Fast delivery": return r.t <= 20;
      case "Under ₹300": return r.cost <= 300;
      case "Offers": return !r.soon;
      case "Favourites": return S.favs.includes(r.id);
      default: return true;
    }
  });
}
function rateBadge(r) { return r.r ? `<span class="rate ${r.r < 4 ? "low" : ""}">${r.r.toFixed(1)} ★</span>` : `<span class="rate new">NEW</span>`; }
function renderRests() {
  const l = restList();
  $("#resCount").textContent = l.length;
  $("#grid").innerHTML = l.slice(0, S.shown).map(r => `
    <article class="rc" data-rid="${r.id}" tabindex="0">
      <div class="im"><img loading="lazy" src="${IMG(r.img)}" alt="${esc(r.n)}" onerror="${FB}">
        ${r.tag ? `<span class="tagb ${r.soon ? "soon" : ""}">${r.tag}</span>` : ""}
        ${r.veg ? `<span class="tagb pv">🌿 Pure Veg</span>` : ""}
        <button class="fav" data-fav="${r.id}" aria-label="Favourite">${S.favs.includes(r.id) ? "❤️" : "🤍"}</button>
        <div class="offer">${r.off}</div></div>
      <div class="bd"><h4>${esc(r.n)}${rateBadge(r)}</h4>
        <div class="meta"><span>${r.c}</span><span>•</span><span>${rs(r.cost)} for two</span></div>
        <div class="meta"><span>🕒 ${r.t}–${r.t + 5} min</span><span>•</span><span>📍 ${(1 + r.id * .3).toFixed(1)} km</span></div>
      </div>
    </article>`).join("") || `<div class="empty"><div class="e">${S.rfilter === "Favourites" ? "💔" : "🔍"}</div><p>${S.rfilter === "Favourites" ? "No favourites yet. Tap 🤍 on any restaurant to save it." : "No restaurants found. Try another search or filter."}</p></div>`;
  $("#moreBtn").style.display = l.length > S.shown ? "" : "none";
}
$("#moreBtn").onclick = () => { const b = $("#moreBtn"); b.textContent = "Loading…"; b.disabled = true; $("#grid").insertAdjacentHTML("beforeend", skel(4));
  setTimeout(() => { S.shown += 8; renderRests(); b.textContent = "Load more restaurants"; b.disabled = false; }, 600); };
$("#resetAll").onclick = () => { S.veg = false; syncVeg(); $$(".cu").forEach(x => x.classList.remove("on")); S.rfilter = "All"; S.dcat = "All"; renderRFilters(); setQuery(""); toast("Filters cleared"); };
$("#grid").addEventListener("click", e => {
  const f = e.target.closest("[data-fav]");
  if (f) { e.stopPropagation(); toggleFav(+f.dataset.fav); return; }
  const c = e.target.closest(".rc"); if (c) openMenu(+c.dataset.rid);
});
$("#grid").addEventListener("keydown", e => { if (e.key === "Enter") { const c = e.target.closest(".rc"); if (c) openMenu(+c.dataset.rid); } });
function toggleFav(id) {
  const i = S.favs.indexOf(id);
  if (i > -1) { S.favs.splice(i, 1); toast("Removed from favourites"); } else { S.favs.push(id); toast(`❤️ ${R[id].n} added to favourites`); }
  save(); renderRests(); if ($("#profileDrawer").classList.contains("open")) renderProfile();
}

/* ---------- veg toggle ---------- */
function syncVeg() { $$(".vegToggle").forEach(t => t.checked = S.veg); save(); }
$$(".vegToggle").forEach(t => t.addEventListener("change", () => {
  S.veg = t.checked; syncVeg(); if (S.veg && S.dcat === "Non-Veg") S.dcat = "All";
  renderDishFilters(); loadAnim(renderDishes, "#dishGrid", 4, 350); loadAnim(renderRests, "#grid", 4, 350);
  toast(S.veg ? "🌿 Showing pure veg only" : "Showing veg & non-veg");
}));

/* ---------- search ---------- */
let sT; $("#topSearch").addEventListener("input", e => { clearTimeout(sT); sT = setTimeout(() => setQuery(e.target.value), 300); });
$("#topSearch").addEventListener("keydown", e => { if (e.key === "Enter") { setQuery(e.target.value); $("#dishes").scrollIntoView({ behavior: "smooth" }); } });
$("#heroForm").onsubmit = e => { e.preventDefault(); setQuery($("#heroInput").value, true); };

/* ---------- quick cards / tabs / partner ---------- */
$$("[data-go]").forEach(b => b.onclick = () => {
  const g = b.dataset.go;
  if (g === "offers") $("#offers").scrollIntoView({ behavior: "smooth" });
  if (g === "veg") { S.veg = true; syncVeg(); renderDishFilters(); renderDishes(); renderRests(); $("#dishes").scrollIntoView({ behavior: "smooth" }); toast("🌿 Showing pure veg only"); }
  if (g === "gourmet") { setRfilter("Rating 4.5+"); $("#restaurants").scrollIntoView({ behavior: "smooth" }); }
});
$$(".tab").forEach(t => t.addEventListener("click", () => {
  $$(".tab").forEach(x => x.classList.remove("active")); t.classList.add("active");
  if (t.dataset.filter) setRfilter(t.dataset.filter);
}));
$$("[data-partner]").forEach(b => b.onclick = () => openInfo(b.dataset.partner));
$$(".soon-btn").forEach(b => b.onclick = () => openInfo("app"));

/* ---------- cart core ---------- */
function addItem(id, rid) {
  const d = D[id]; if (!d) return;
  if (S.veg && !d.veg) { toast("Turn off Pure Veg to add non-veg items"); return; }
  const it = S.cart.find(i => i.id === id);
  if (it) it.q++; else S.cart.push({ id, q: 1, rid: rid || (dishRest(id) || {}).id });
  save(); syncCart(id, true);
  if (!it) toast(`${d.n} added to cart 🛒`);
}
function decItem(id) {
  const it = S.cart.find(i => i.id === id); if (!it) return;
  it.q--; if (it.q <= 0) S.cart = S.cart.filter(i => i.id !== id);
  save(); syncCart(id);
}
function syncCart(id, bump) {
  $$(`[data-ctl="${id}"]`).forEach(el => el.innerHTML = addCtl(id));
  const n = S.cart.reduce((a, i) => a + i.q, 0), t = itemTotal();
  $$(".cartCount").forEach(b => { b.textContent = n; if (bump) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); } });
  $("#cbCount").textContent = `${n} item${n === 1 ? "" : "s"}`; $("#cbTotal").textContent = rs(t);
  $("#cartbar").classList.toggle("show", n > 0 && !$("#cartDrawer").classList.contains("open"));
  if ($("#cartDrawer").classList.contains("open") && S.step === "cart") renderCart();
}
document.addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
  if (inc) { e.stopPropagation(); addItem(inc.dataset.inc, inc.dataset.rid ? +inc.dataset.rid : undefined); }
  else if (dec) { e.stopPropagation(); decItem(dec.dataset.dec); }
});
const itemTotal = () => S.cart.reduce((a, i) => a + D[i.id].p * i.q, 0);
function bill() {
  const t = itemTotal(); let disc = 0, cmsg = "", freeDel = false;
  if (S.coupon && COUPONS[S.coupon]) {
    const c = COUPONS[S.coupon], v = c.calc(t, S.cart);
    if (v >= 0) { disc = v; freeDel = !!c.freeDel; } else cmsg = v === -1 ? "Add a thali to use this code" : v === -2 ? "Add South Indian items to use this code" : `Add ${rs(-v - t)} more to use this code`;
  }
  const del = t === 0 ? 0 : (freeDel || t >= 499 ? 0 : 35), plat = t ? 5 : 0, gst = Math.round((t - disc) * .05);
  return { t, disc, del, plat, gst, cmsg, total: Math.max(0, t - disc + del + plat + gst) };
}

/* ---------- drawers & modals ---------- */
let lastFocus;
function openPanel(el) {
  closeAll(true); lastFocus = document.activeElement;
  el.classList.add("open"); $("#overlay").classList.add("show"); document.body.classList.add("lock");
  $("#cartbar").classList.remove("show");
  setTimeout(() => { const f = el.querySelector("input,button:not(.x)"); f && f.focus({ preventScroll: true }); }, 350);
}
function closeAll(silent) {
  $$(".drawer.open,.modal.open").forEach(x => x.classList.remove("open"));
  $("#overlay").classList.remove("show"); document.body.classList.remove("lock");
  if (!silent) { syncCart(""); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); setBnav("home"); }
}
$("#overlay").onclick = () => closeAll();
document.addEventListener("click", e => { if (e.target.closest(".close-all")) closeAll(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });

/* ---------- cart drawer ---------- */
function openCart() { S.step = "cart"; renderCart(); openPanel($("#cartDrawer")); setBnav("cart"); }
$("#cartBtn").onclick = openCart;
document.addEventListener("click", e => { if (e.target.closest(".open-cart")) openCart(); });

function stepsBar(n) { return `<div class="steps-bar">${[1, 2, 3].map(i => `<span class="${i <= n ? "on" : ""}"></span>`).join("")}</div>`; }
function renderCart() {
  const body = $("#cartBody"), foot = $("#cartFoot");
  if (S.step === "done") return;
  if (!S.cart.length) {
    $("#cartTitle").textContent = "Your cart";
    body.innerHTML = `<div class="cart-empty"><div class="e">🛒</div><h3 style="color:var(--ink);margin:10px 0 4px">Your cart is empty</h3><p>Good food is always cooking! Add some delicious dishes from GoodFood4You.</p></div>`;
    foot.innerHTML = `<button class="btn btn-red btn-block" id="browseBtn">Browse dishes</button>`;
    $("#browseBtn").onclick = () => { closeAll(); $("#dishes").scrollIntoView({ behavior: "smooth" }); };
    return;
  }
  const b = bill();
  if (S.step === "cart") {
    $("#cartTitle").textContent = `Your cart (${S.cart.reduce((a, i) => a + i.q, 0)})`;
    const groups = {};
    S.cart.forEach(i => (groups[i.rid] = groups[i.rid] || []).push(i));
    body.innerHTML = stepsBar(1) + Object.entries(groups).map(([rid, items]) => `
      <div style="font-weight:800;font-size:13px;color:var(--muted);margin:6px 0 8px">🏪 ${esc((R[rid] || { n: "GoodFood4You Kitchen" }).n)}</div>
      ${items.map(i => { const d = D[i.id]; return `<div class="ci-row"><img src="${IMG(d.img, 160)}" alt="" onerror="${FB}"><div class="nm"><b><span class="vmark ${d.veg ? "" : "nv"}"></span>${esc(d.n)}</b><small>${rs(d.p)} × ${i.q} = <b style="color:var(--ink)">${rs(d.p * i.q)}</b></small></div><span data-ctl="${i.id}">${addCtl(i.id)}</span></div>`; }).join("")}`).join("") + `
      <div class="card"><h5>🏷️ Apply coupon</h5><div class="coupon"><input id="cpIn" placeholder="Enter code e.g. GOOD50" value="${esc(S.coupon)}"><button class="btn btn-dark" id="cpBtn" style="padding:10px 16px">${S.coupon ? "Remove" : "Apply"}</button></div>
        ${S.coupon && !b.cmsg ? `<p class="save" style="color:var(--veg);font-size:13px;margin-top:8px;font-weight:700">✓ ${S.coupon} applied: ${COUPONS[S.coupon].d}</p>` : ""}
        ${b.cmsg ? `<p style="color:var(--red);font-size:13px;margin-top:8px;font-weight:600">${b.cmsg}</p>` : ""}
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">${Object.keys(COUPONS).map(c => `<button class="chip" data-cp="${c}" style="padding:5px 10px;font-size:11px">${c}</button>`).join("")}</div></div>
      <div class="card bill"><h5>🧾 Bill details</h5>
        <div><span>Item total</span><span>${rs(b.t)}</span></div>
        ${b.disc ? `<div class="save"><span>Coupon discount</span><span>−${rs(b.disc)}</span></div>` : ""}
        <div><span>Delivery fee ${b.del ? `<small style="color:var(--muted)">(free above ₹499)</small>` : ""}</span><span>${b.del ? rs(b.del) : `<b class="save">FREE</b>`}</span></div>
        <div><span>Platform fee</span><span>${rs(b.plat)}</span></div>
        <div><span>GST &amp; charges (5%)</span><span>${rs(b.gst)}</span></div>
        <div class="tot"><span>To pay</span><span>${rs(b.total)}</span></div>
        ${b.disc || !b.del ? `<p class="save" style="font-size:13px;margin-top:6px">🎉 You're saving ${rs(b.disc + (b.del ? 0 : 35))} on this order!</p>` : ""}</div>
      <button class="link" id="clearCart" style="margin:4px 0 10px">🗑 Clear cart</button>`;
    foot.innerHTML = `<button class="btn btn-red btn-block" id="toAddr">Proceed to checkout • ${rs(b.total)}</button>`;
    $("#cpBtn").onclick = () => {
      if (S.coupon) { S.coupon = ""; save(); renderCart(); return; }
      const v = $("#cpIn").value.trim().toUpperCase();
      if (COUPONS[v]) { S.coupon = v; save(); toast(`Coupon ${v} applied 🎉`); } else toast("Invalid coupon code");
      renderCart();
    };
    $("#cpIn").onkeydown = e => { if (e.key === "Enter") $("#cpBtn").click(); };
    $$("[data-cp]", body).forEach(c => c.onclick = () => { S.coupon = c.dataset.cp; save(); renderCart(); });
    $("#clearCart").onclick = () => { const ids = S.cart.map(i => i.id); S.cart = []; save(); ids.forEach(id => syncCart(id)); renderCart(); toast("Cart cleared"); };
    $("#toAddr").onclick = () => {
      if (!S.user) { S.pendingCheckout = true; toast("Please log in to continue checkout"); openProfile(); return; }
      S.step = "addr"; renderCart();
    };
  }
  if (S.step === "addr") {
    $("#cartTitle").textContent = "Delivery address";
    body.innerHTML = stepsBar(2) + (S.addrs.length ? `<div class="pay" id="addrList">${S.addrs.map((a, i) => `<label><input type="radio" name="addr" value="${i}" ${i === S.selAddr ? "checked" : ""}><span><b>${esc(a.label)}</b><br><small style="color:var(--muted);font-weight:500">${esc(a.full)}</small></span></label>`).join("")}</div><div style="text-align:center;margin:14px 0;color:var(--muted);font-size:13px">or add a new address</div>` : "") + `
      <div class="fld" id="fA1"><label>House / Flat / Floor</label><input id="a1" placeholder="e.g. 402, Sunshine Apartments"><div class="err">Please enter house / flat details</div></div>
      <div class="fld" id="fA2"><label>Area / Street / Landmark</label><input id="a2" placeholder="e.g. MG Road, near City Mall" value="${esc(S.loc)}"><div class="err">Please enter area</div></div>
      <div class="two"><div class="fld"><label>City</label><input id="a3" placeholder="City"></div><div class="fld" id="fA4"><label>Pincode</label><input id="a4" placeholder="6 digits" inputmode="numeric" maxlength="6"><div class="err">Enter a valid 6-digit pincode</div></div></div>
      <div class="fld"><label>Save as</label><div class="filters" id="lbls" style="margin:0">${["Home", "Work", "Other"].map((l, i) => `<button class="chip ${i ? "" : "on"}" data-l="${l}">${l}</button>`).join("")}</div></div>
      <div class="fld"><label>Delivery instructions (optional)</label><textarea id="a5" rows="2" placeholder="e.g. Ring the bell, don't call"></textarea></div>`;
    foot.innerHTML = `<div class="two"><button class="btn btn-ghost" id="back1">← Back</button><button class="btn btn-red" id="toPay">Continue to payment</button></div>`;
    let lbl = "Home";
    $$("#lbls .chip").forEach(c => c.onclick = () => { $$("#lbls .chip").forEach(x => x.classList.remove("on")); c.classList.add("on"); lbl = c.dataset.l; });
    $("#back1").onclick = () => { S.step = "cart"; renderCart(); };
    $("#toPay").onclick = () => {
      const a1 = $("#a1").value.trim(), a2 = $("#a2").value.trim(), a3 = $("#a3").value.trim(), a4 = $("#a4").value.trim();
      const typed = a1 || a2 || a4;
      if (!typed && S.addrs.length) { const r = $("input[name=addr]:checked"); S.selAddr = r ? +r.value : 0; S.note = $("#a5").value.trim(); S.step = "pay"; renderCart(); return; }
      let ok = true;
      [["#fA1", a1], ["#fA2", a2], ["#fA4", /^\d{6}$/.test(a4) ? a4 : ""]].forEach(([f, v]) => { $(f).classList.toggle("bad", !v); if (!v) ok = false; });
      if (!ok) { toast("Please fill in the highlighted fields"); return; }
      S.addrs.unshift({ label: lbl, full: `${a1}, ${a2}${a3 ? ", " + a3 : ""} - ${a4}` }); S.selAddr = 0; S.note = $("#a5").value.trim(); save();
      S.step = "pay"; renderCart();
    };
  }
  if (S.step === "pay") {
    $("#cartTitle").textContent = "Payment";
    const a = S.addrs[S.selAddr];
    body.innerHTML = stepsBar(3) + `
      <div class="card"><h5>📍 Delivering to ${esc(a.label)}</h5><p style="font-size:13px;color:var(--muted)">${esc(a.full)}</p><p style="font-size:13px;margin-top:6px">🕒 Estimated delivery: <b>30–35 min</b></p></div>
      <div class="card"><h5>💳 Choose payment method</h5><div class="pay">
        <label><input type="radio" name="pay" value="cod" ${S.pay === "cod" ? "checked" : ""}>💵 Cash on delivery</label>
        <label><input type="radio" name="pay" value="upi" ${S.pay === "upi" ? "checked" : ""}>📱 Pay by UPI on delivery (scan QR)</label>
        <label><input type="radio" name="pay" value="card" ${S.pay === "card" ? "checked" : ""}>💳 Card on delivery (swipe machine)</label>
      </div><p style="font-size:12px;color:var(--muted);margin-top:10px">Demo store: no online payment is taken. You pay the rider at your door.</p></div>
      <div class="card bill"><h5>🧾 Order summary</h5>
        ${S.cart.map(i => `<div><span>${esc(D[i.id].n)} × ${i.q}</span><span>${rs(D[i.id].p * i.q)}</span></div>`).join("")}
        ${b.disc ? `<div class="save"><span>Coupon (${S.coupon})</span><span>−${rs(b.disc)}</span></div>` : ""}
        <div><span>Delivery + fees + GST</span><span>${rs(b.del + b.plat + b.gst)}</span></div>
        <div class="tot"><span>To pay</span><span>${rs(b.total)}</span></div></div>`;
    foot.innerHTML = `<div class="two"><button class="btn btn-ghost" id="back2">← Back</button><button class="btn btn-red" id="place">Place order • ${rs(b.total)}</button></div>`;
    $$("input[name=pay]").forEach(r => r.onchange = () => S.pay = r.value);
    $("#back2").onclick = () => { S.step = "addr"; renderCart(); };
    $("#place").onclick = placeOrder;
  }
}
function placeOrder() {
  const btn = $("#place"); btn.disabled = true; btn.innerHTML = `<span class="spin" style="display:inline-block;width:16px;height:16px;border:2px solid #fff;border-right-color:transparent;border-radius:50%;animation:spin .7s linear infinite"></span> Placing order…`;
  setTimeout(() => {
    const b = bill(), id = "GF4U" + Math.floor(100000 + Math.random() * 900000);
    const order = { id, at: Date.now(), items: S.cart.map(i => ({ ...i })), total: b.total, addr: S.addrs[S.selAddr], pay: S.pay, rest: [...new Set(S.cart.map(i => (R[i.rid] || {}).n).filter(Boolean))].join(", ") };
    S.orders.unshift(order);
    const ids = S.cart.map(i => i.id); S.cart = []; S.coupon = ""; save(); ids.forEach(x => syncCart(x));
    S.step = "done"; showSuccess(order);
  }, 1400);
}
const TRACK = [["✓", "Order confirmed", "The restaurant has accepted your order"], ["👨‍🍳", "Preparing your food", "Fresh & hot, made 4 You"], ["🛵", "Out for delivery", "Your rider is on the way"], ["🏠", "Delivered", "Enjoy your meal! Order • Enjoy • Repeat"]];
const orderStage = o => Math.min(3, Math.floor((Date.now() - o.at) / 8000));
let trkIv;
function showSuccess(o) {
  $("#cartTitle").textContent = "Order placed!";
  $("#cartBody").innerHTML = `<div class="success"><div class="tick"><svg viewBox="0 0 52 52"><path d="M14 27l8 8 16-17"/></svg></div>
    <h3 style="font-size:22px;font-weight:800">Yay! Order placed 🎉</h3><p style="color:var(--muted);font-size:14px">Order ID <b style="color:var(--ink)">#${o.id}</b> • ${rs(o.total)} • ${o.pay === "cod" ? "Cash" : o.pay.toUpperCase()} on delivery</p>
    <div class="card track" id="trk">${TRACK.map((t, i) => `<div class="trk" data-i="${i}"><span class="dot">${t[0]}</span><div><b>${t[1]}</b><small>${t[2]}</small></div></div>`).join("")}</div></div>`;
  $("#cartFoot").innerHTML = `<div class="two"><button class="btn btn-ghost" id="viewOrders">My orders</button><button class="btn btn-red" id="contShop">Order more</button></div>`;
  $("#viewOrders").onclick = () => { openProfile("orders"); };
  $("#contShop").onclick = () => { closeAll(); S.step = "cart"; };
  const upd = () => { const s = orderStage(o); $$("#trk .trk").forEach((el, i) => el.classList.toggle("on", i <= s)); if (s >= 3) clearInterval(trkIv); };
  clearInterval(trkIv); upd(); trkIv = setInterval(upd, 1000);
}

/* ---------- restaurant menu modal ---------- */
function openMenu(id) {
  const r = R[id]; if (!r) return;
  $("#mImg").src = IMG(r.img, 900); $("#mName").textContent = r.n;
  $("#mMeta").innerHTML = `${r.c} • ${r.r ? r.r.toFixed(1) + " ★" : "NEW"} • ${r.t}–${r.t + 5} min • ${rs(r.cost)} for two ${r.veg ? "• 🌿 Pure Veg" : ""}`;
  if (r.soon) {
    $("#mBody").innerHTML = `<div class="empty"><div class="e">⏳</div><p><b>${esc(r.n)}</b> is opening soon on GoodFood4You. Tap ❤️ to get notified!</p><button class="btn btn-red" data-fav="${r.id}" id="favSoon" style="margin-top:12px">${S.favs.includes(r.id) ? "❤️ Saved" : "🤍 Notify me"}</button></div>`;
    $("#favSoon").onclick = () => { toggleFav(r.id); openMenu(r.id); };
  } else {
    const items = r.menu.map(x => D[x]).filter(d => !S.veg || d.veg);
    $("#mBody").innerHTML = `<div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span>🏷️ <b>${r.off}</b></span><button class="chip" id="mFav">${S.favs.includes(r.id) ? "❤️ Saved" : "🤍 Save"}</button></div>` +
      (items.length ? items.map(d => `<div class="mi"><div class="tx"><b><span class="vmark ${d.veg ? "" : "nv"}"></span>${esc(d.n)}</b>${d.best ? `<small style="color:var(--orange);font-weight:700">★ Bestseller</small>` : ""}<div class="price">${rs(d.p)}${d.m ? `<s>${rs(d.m)}</s>` : ""}</div><p>${esc(d.d)}</p></div>
        <div class="pic"><img src="${IMG(d.img, 240)}" alt="" onerror="${FB}"><span data-ctl="${d.id}">${addCtl(d.id).replace(/data-inc="/g, `data-rid="${r.id}" data-inc="`)}</span></div></div>`).join("")
      : `<div class="empty"><div class="e">🌿</div><p>No pure veg items here. Turn off the veg filter to see the full menu.</p></div>`);
    $("#mFav").onclick = () => { toggleFav(r.id); $("#mFav").textContent = S.favs.includes(r.id) ? "❤️ Saved" : "🤍 Save"; };
  }
  openPanel($("#menuModal"));
}

/* ---------- profile / login ---------- */
let ptab = "orders";
function openProfile(tab) { if (tab) ptab = tab; renderProfile(); openPanel($("#profileDrawer")); setBnav("profile"); }
$("#profileBtn").onclick = () => openProfile();
document.addEventListener("click", e => { if (e.target.closest(".open-profile")) openProfile(); if (e.target.closest(".open-orders")) openProfile("orders"); });
function syncUser() {
  $("#profileLbl").textContent = S.user ? S.user.name.split(" ")[0] : "Login";
  $("#avatarSm").textContent = S.user ? S.user.name[0].toUpperCase() : "👤";
}
function renderProfile() {
  const b = $("#profBody");
  if (!S.user) {
    $("#profTitle").textContent = "Login / Sign up";
    if (!S.otp) {
      b.innerHTML = `<div class="ph"><div class="big">👋</div><div><b>Welcome to GoodFood4You</b><span style="font-size:13px">Log in to place orders, track them & save favourites</span></div></div>
        <div class="fld" id="fN"><label>Your name</label><input id="lgName" placeholder="e.g. Rohan Sharma" autocomplete="name"><div class="err">Please enter your name</div></div>
        <div class="fld" id="fP"><label>Mobile number</label><div class="coupon"><input value="+91" disabled style="flex:0 0 64px;text-align:center"><input id="lgPhone" placeholder="10-digit mobile number" inputmode="numeric" maxlength="10" autocomplete="tel-national"></div><div class="err">Enter a valid 10-digit mobile number</div></div>
        <button class="btn btn-red btn-block" id="sendOtp">Send OTP</button>
        <p style="font-size:12px;color:var(--muted);text-align:center;margin-top:12px">Demo login: the OTP is shown on screen, and no SMS is sent.</p>`;
      $("#sendOtp").onclick = () => {
        const n = $("#lgName").value.trim(), p = $("#lgPhone").value.trim();
        $("#fN").classList.toggle("bad", !n); $("#fP").classList.toggle("bad", !/^[6-9]\d{9}$/.test(p));
        if (!n || !/^[6-9]\d{9}$/.test(p)) return;
        S.otp = { n, p, code: String(Math.floor(1000 + Math.random() * 9000)) };
        renderProfile(); toast(`Your GoodFood4You demo OTP is ${S.otp.code}`);
      };
      $("#lgPhone").onkeydown = e => { if (e.key === "Enter") $("#sendOtp").click(); };
    } else {
      b.innerHTML = `<div class="ph"><div class="big">🔐</div><div><b>Verify OTP</b><span style="font-size:13px">Sent to +91 ${S.otp.p.slice(0, 2)}******${S.otp.p.slice(-2)}</span></div></div>
        <div class="otp">${[0, 1, 2, 3].map(i => `<input maxlength="1" inputmode="numeric" data-o="${i}" aria-label="OTP digit ${i + 1}">`).join("")}</div>
        <p style="text-align:center;font-size:13px;margin-bottom:14px;background:#fff3d1;padding:8px;border-radius:10px">Demo OTP: <b>${S.otp.code}</b></p>
        <button class="btn btn-red btn-block" id="verify">Verify &amp; continue</button>
        <button class="link" id="chg" style="display:block;margin:14px auto 0">← Change number</button>`;
      const ins = $$(".otp input", b);
      ins.forEach((inp, i) => {
        inp.oninput = () => { inp.value = inp.value.replace(/\D/g, ""); if (inp.value && ins[i + 1]) ins[i + 1].focus(); if (ins.every(x => x.value)) $("#verify").click(); };
        inp.onkeydown = e => { if (e.key === "Backspace" && !inp.value && ins[i - 1]) ins[i - 1].focus(); };
        inp.onpaste = e => { const v = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 4); if (v.length === 4) { e.preventDefault(); ins.forEach((x, j) => x.value = v[j]); $("#verify").click(); } };
      });
      setTimeout(() => ins[0].focus(), 50);
      $("#verify").onclick = () => {
        const v = ins.map(x => x.value).join("");
        if (v !== S.otp.code) { toast("Incorrect OTP. Please try again"); ins.forEach(x => x.value = ""); ins[0].focus(); return; }
        S.user = { name: S.otp.n, phone: S.otp.p, since: Date.now() }; S.otp = null; save(); syncUser();
        toast(`Welcome, ${S.user.name.split(" ")[0]}! 🎉`);
        if (S.pendingCheckout) { S.pendingCheckout = false; S.step = "addr"; renderCart(); openPanel($("#cartDrawer")); } else renderProfile();
      };
      $("#chg").onclick = () => { S.otp = null; renderProfile(); };
    }
    return;
  }
  $("#profTitle").textContent = "My account";
  const u = S.user;
  const tabs = [["orders", "📦 Orders"], ["favs", "❤️ Favourites"], ["addrs", "📍 Addresses"], ["settings", "⚙️ Settings"]];
  let inner = "";
  if (ptab === "orders") inner = S.orders.length ? S.orders.map(o => {
    const s = orderStage(o);
    return `<div class="ord"><div class="t"><span>#${o.id}</span><span>${rs(o.total)}</span></div><small>${new Date(o.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} • ${esc(o.rest || "GoodFood4You")}</small>
      <small>${o.items.map(i => `${esc(D[i.id].n)} × ${i.q}`).join(", ")}</small>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="st2" style="${s < 3 ? "background:#fff3d1;color:#8a5a00" : ""}">${TRACK[s][0]} ${TRACK[s][1]}</span><button class="chip" data-reorder="${o.id}" style="margin-top:8px">↻ Reorder</button></div></div>`;
  }).join("") : `<div class="empty"><div class="e">📦</div><p>No orders yet. Your GoodFood4You orders will show up here.</p><button class="btn btn-red" id="startOrd" style="margin-top:12px">Start ordering</button></div>`;
  if (ptab === "favs") { const f = S.favs.map(id => R[id]).filter(Boolean);
    inner = f.length ? f.map(r => `<div class="ci-row"><img src="${IMG(r.img, 160)}" alt="" onerror="${FB}"><div class="nm"><b>${esc(r.n)}</b><small>${r.c} • ${r.r ? r.r + " ★" : "NEW"}</small></div><button class="chip" data-openr="${r.id}">Menu</button><button class="x" data-unfav="${r.id}" aria-label="Remove">✕</button></div>`).join("")
      : `<div class="empty"><div class="e">💔</div><p>No favourites yet. Tap 🤍 on any restaurant to save it here.</p></div>`; }
  if (ptab === "addrs") inner = (S.addrs.length ? S.addrs.map((a, i) => `<div class="ci-row"><div style="font-size:26px">${a.label === "Work" ? "🏢" : a.label === "Home" ? "🏠" : "📍"}</div><div class="nm"><b>${esc(a.label)}</b><small>${esc(a.full)}</small></div><button class="x" data-deladdr="${i}" aria-label="Delete address">🗑</button></div>`).join("")
      : `<div class="empty"><div class="e">📍</div><p>No saved addresses yet. They're saved automatically at checkout.</p></div>`) + `<button class="btn btn-ghost btn-block" id="setLoc">📡 Set delivery location</button>`;
  if (ptab === "settings") inner = `<div class="fld"><label>Name</label><input id="stName" value="${esc(u.name)}"></div>
      <div class="fld"><label>Mobile</label><input value="+91 ${esc(u.phone)}" disabled></div>
      <label class="vegsw" style="margin:6px 0 16px"><input type="checkbox" class="vegToggle" ${S.veg ? "checked" : ""} id="stVeg"><span class="tr"></span>Always show pure veg only</label>
      <button class="btn btn-dark btn-block" id="stSave">Save changes</button>`;
  b.innerHTML = `<div class="ph"><div class="big">${esc(u.name[0].toUpperCase())}</div><div><b>${esc(u.name)}</b><span style="font-size:13px">+91 ${esc(u.phone)} • ${S.orders.length} order${S.orders.length === 1 ? "" : "s"}</span></div></div>
    <div class="ptabs">${tabs.map(([k, l]) => `<button class="${k === ptab ? "on" : ""}" data-pt="${k}">${l}</button>`).join("")}</div>
    <div>${inner}</div>
    <div class="menu-list" style="margin-top:16px"><button id="goCart">🛒 My cart (${S.cart.reduce((a, i) => a + i.q, 0)})</button><button id="goHelp">💬 Help &amp; support</button><button id="logout" style="color:var(--red)">↪ Log out</button></div>`;
  $$("[data-pt]", b).forEach(t => t.onclick = () => { ptab = t.dataset.pt; renderProfile(); });
  $$("[data-reorder]", b).forEach(x => x.onclick = () => { const o = S.orders.find(o => o.id === x.dataset.reorder); o.items.forEach(i => { const c = S.cart.find(c => c.id === i.id); c ? c.q += i.q : S.cart.push({ ...i }); }); save(); o.items.forEach(i => syncCart(i.id, true)); toast("Items added to cart 🛒"); openCart(); });
  $$("[data-openr]", b).forEach(x => x.onclick = () => openMenu(+x.dataset.openr));
  $$("[data-unfav]", b).forEach(x => x.onclick = () => toggleFav(+x.dataset.unfav));
  $$("[data-deladdr]", b).forEach(x => x.onclick = () => { S.addrs.splice(+x.dataset.deladdr, 1); S.selAddr = 0; save(); renderProfile(); toast("Address removed"); });
  const so = $("#startOrd"); if (so) so.onclick = () => { closeAll(); $("#dishes").scrollIntoView({ behavior: "smooth" }); };
  const sl = $("#setLoc"); if (sl) sl.onclick = openLoc;
  const ss = $("#stSave"); if (ss) ss.onclick = () => { const n = $("#stName").value.trim(); if (!n) return toast("Name can't be empty"); S.user.name = n; S.veg = $("#stVeg").checked; syncVeg(); save(); syncUser(); renderDishFilters(); renderDishes(); renderRests(); renderProfile(); toast("Profile updated ✓"); };
  $("#goCart").onclick = openCart;
  $("#goHelp").onclick = () => openInfo("help");
  $("#logout").onclick = () => { S.user = null; save(); syncUser(); renderProfile(); toast("Logged out. See you soon! 👋"); };
}

/* ---------- location ---------- */
const POP = ["Connaught Place, New Delhi", "Bandra West, Mumbai", "Indiranagar, Bengaluru", "SG Highway, Ahmedabad", "Koregaon Park, Pune", "Banjara Hills, Hyderabad"];
function setLoc(txt) { S.loc = txt; save(); $("#locTxt").textContent = txt; }
function openLoc() {
  $("#popularLocs").innerHTML = `<div style="font-size:12px;font-weight:700;color:var(--muted);margin-top:8px">POPULAR LOCATIONS</div>` + POP.map(p => `<button data-loc="${p}">📍 ${p}</button>`).join("");
  $$("[data-loc]").forEach(b => b.onclick = () => { setLoc(b.dataset.loc); closeAll(); toast(`📍 Delivering to ${b.dataset.loc}`); loadAnim(renderRests, "#grid", 4); });
  openPanel($("#locModal"));
}
$("#locBtn").onclick = openLoc;
$("#detectLoc").onclick = () => {
  const b = $("#detectLoc");
  if (!navigator.geolocation) return toast("Location isn't available in this browser");
  b.textContent = "Detecting…"; b.disabled = true;
  navigator.geolocation.getCurrentPosition(pos => {
    b.textContent = "📡 Detect my location"; b.disabled = false;
    setLoc(`Near ${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`); closeAll(); toast("📍 Showing GoodFood4You restaurants near you"); loadAnim(renderRests, "#grid", 4);
  }, () => { b.textContent = "📡 Detect my location"; b.disabled = false; toast("Location permission denied. Enter it manually"); }, { timeout: 10000 });
};
$("#saveLoc").onclick = () => {
  const a = $("#locArea").value.trim(), c = $("#locCity").value.trim();
  $("#fLocArea").classList.toggle("bad", !a); if (!a) return;
  setLoc(c ? `${a}, ${c}` : a); closeAll(); toast(`📍 Delivering to ${S.loc}`); loadAnim(renderRests, "#grid", 4);
};

/* ---------- info modal ---------- */
function openInfo(kind) {
  const t = $("#infoTitle"), b = $("#infoBody");
  if (kind === "app") { t.textContent = "📱 GoodFood4You app"; b.innerHTML = `<div class="empty"><img src="assets/logo.jpeg" alt="" style="width:110px;border-radius:24px;margin:0 auto 12px"><p><b>Coming soon to iOS &amp; Android!</b><br>Until then, GoodFood4You works great right here in your browser.</p><button class="btn btn-red close-all" style="margin-top:14px">Keep ordering</button></div>`; }
  if (kind === "help") { t.textContent = "💬 Help & support"; b.innerHTML = `<div class="menu-list">${[["Where is my order?", "Open Profile → Orders to see live status for every order."], ["How do I apply a coupon?", "Open your cart, enter a code like GOOD50 and tap Apply."], ["Is the food pure veg?", "Turn on the 🌿 Veg switch to see only pure veg restaurants & dishes."], ["How do I pay?", "Pay with cash, UPI or card to the rider at your door."]].map(([q, a]) => `<details style="padding:12px 0;border-bottom:1px solid var(--line)"><summary style="font-weight:700;cursor:pointer">${q}</summary><p style="color:var(--muted);font-size:14px;margin-top:6px">${a}</p></details>`).join("")}</div>`; }
  if (kind === "restaurant" || kind === "rider") {
    const r = kind === "restaurant";
    t.textContent = r ? "🏪 Partner with GoodFood4You" : "🛵 Ride with GoodFood4You";
    b.innerHTML = `<form id="pform"><div class="fld" id="pf1"><label>${r ? "Restaurant name" : "Full name"}</label><input id="p1" required><div class="err">Required</div></div>
      <div class="fld" id="pf2"><label>Mobile number</label><input id="p2" inputmode="numeric" maxlength="10" placeholder="10 digits"><div class="err">Enter a valid 10-digit number</div></div>
      <div class="fld"><label>City</label><input id="p3" placeholder="City"></div>
      ${r ? `<div class="fld"><label>Type</label><select id="p4"><option>Pure Veg</option><option>Veg &amp; Non-veg</option><option>Cloud kitchen</option></select></div>` : `<div class="fld"><label>Vehicle</label><select id="p4"><option>Bike / Scooter</option><option>Bicycle</option><option>EV</option></select></div>`}
      <button class="btn btn-red btn-block" type="submit">Submit application</button></form>`;
    $("#pform").onsubmit = e => {
      e.preventDefault(); const a = $("#p1").value.trim(), p = $("#p2").value.trim();
      $("#pf1").classList.toggle("bad", !a); $("#pf2").classList.toggle("bad", !/^\d{10}$/.test(p)); if (!a || !/^\d{10}$/.test(p)) return;
      b.innerHTML = `<div class="success"><div class="tick"><svg viewBox="0 0 52 52"><path d="M14 27l8 8 16-17"/></svg></div><h3>Application received!</h3><p style="color:var(--muted)">Thanks ${esc(a)}! The GoodFood4You team will reach out shortly.</p><button class="btn btn-dark close-all" style="margin-top:14px">Done</button></div>`;
    };
  }
  openPanel($("#infoModal"));
}

/* ---------- mobile bottom nav ---------- */
function setBnav(k) { $$(".bnav button").forEach(b => b.classList.toggle("on", b.dataset.bn === k)); }
$$(".bnav button").forEach(b => b.onclick = () => {
  const k = b.dataset.bn; setBnav(k);
  if (k === "home") { closeAll(); scrollTo({ top: 0, behavior: "smooth" }); }
  if (k === "search") { closeAll(); $("#heroInput").scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => $("#heroInput").focus(), 400); setBnav("search"); }
  if (k === "veg") { closeAll(); S.veg = !S.veg; syncVeg(); renderDishFilters(); renderDishes(); renderRests(); $("#dishes").scrollIntoView({ behavior: "smooth" }); toast(S.veg ? "🌿 Showing pure veg only" : "Showing veg & non-veg"); }
  if (k === "cart") openCart();
  if (k === "profile") openProfile();
});

/* ---------- header / scroll ---------- */
const secs = ["restaurants", "dishes", "regions", "offers", "how"];
addEventListener("scroll", () => {
  const y = scrollY;
  $("#hdr").classList.toggle("scrolled", y > 10);
  $("#totop").classList.toggle("show", y > 800);
}, { passive: true });
$("#totop").onclick = () => scrollTo({ top: 0, behavior: "smooth" });

/* ---------- init ---------- */
$("#yr").textContent = new Date().getFullYear();
if (S.loc) $("#locTxt").textContent = S.loc;
syncVeg(); syncUser(); renderDishFilters(); renderRFilters();
$("#dishGrid").innerHTML = skel(8); $("#grid").innerHTML = skel(8);
setTimeout(() => { renderDishes(); renderRests(); }, 2200);   // skeletons show right after the splash
syncCart("");
})();
