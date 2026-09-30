/* =====================================================================
   TAYYAB SULTAN - PORTFOLIO JAVASCRIPT
   Sections:
   1. 3D Background (Spline) - optional
   2. Header scroll effect
   3. Mobile menu (burger)
   4. Scroll reveal animation
   5. Contact form (Web3Forms)
   6. Footer year
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. 3D BACKGROUND (SPLINE) - OPTIONAL
   Apni Spline "Aether Shard" public scene ka URL (.splinecode par khatam
   hone wala) neeche quotes ke andar paste karo. Khali chhorne par 3D
   background load nahi hoga.
   --------------------------------------------------------------------- */
const SPLINE_SCENE = "";

// Sirf tab chale jab URL diya ho aur user ne "reduce motion" on na kiya ho
if (SPLINE_SCENE && !matchMedia('(prefers-reduced-motion:reduce)').matches) {

  // Spline viewer ki library load karo
  const m = document.createElement('script');
  m.type = 'module';
  m.src = 'https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js';
  document.head.appendChild(m);

  // 3D viewer element banao
  const v = document.createElement('spline-viewer');
  v.setAttribute('url', SPLINE_SCENE);
  v.setAttribute('loading-anim-type', 'none');

  // Load hote hi background ko fade-in karo
  v.addEventListener('load-complete', () => document.getElementById('sp').classList.add('on'));

  // Backup: agar 4 second mein load-complete na aaye to bhi show kar do
  setTimeout(() => document.getElementById('sp').classList.add('on'), 4000);

  // Viewer ko page ke #sp container mein daal do
  document.getElementById('sp').appendChild(v);
}


/* ---------------------------------------------------------------------
   Common elements (baqi sections mein use hote hain)
   --------------------------------------------------------------------- */
const hd = document.getElementById('hd');  // Header
const lk = document.getElementById('lk');  // Menu links list
const bg = document.getElementById('bg');  // Burger button


/* ---------------------------------------------------------------------
   2. HEADER SCROLL EFFECT
   20px se zyada scroll karne par header par "s" class lagti hai
   (CSS mein darker background aur glow aa jata hai)
   --------------------------------------------------------------------- */
addEventListener('scroll', () => hd.classList.toggle('s', scrollY > 20));


/* ---------------------------------------------------------------------
   3. MOBILE MENU (BURGER)
   --------------------------------------------------------------------- */

// Burger click: menu open/close karo aur icon badlo (bars <-> X)
bg.onclick = () => {
  const o = lk.classList.toggle('open');                      // true = menu open
  bg.setAttribute('aria-expanded', o);                        // Screen readers ke liye
  bg.firstChild.className = o ? 'fas fa-xmark' : 'fas fa-bars';
};

// Menu ke kisi link par click karne par menu band kar do
lk.querySelectorAll('a').forEach(a => a.onclick = () => {
  lk.classList.remove('open');
  bg.setAttribute('aria-expanded', false);
  bg.firstChild.className = 'fas fa-bars';
});


/* ---------------------------------------------------------------------
   4. SCROLL REVEAL ANIMATION
   Jab ".rv" wala element screen mein 15% nazar aaye to us par "in" class
   lagti hai aur wo fade-in hota hai.
   --------------------------------------------------------------------- */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');

    // Agar element ke andar progress bars (.fi) hon to unki width set karo
    e.target.querySelectorAll('.fi').forEach(f => f.style.width = f.dataset.w + '%');

    // Animation sirf ek baar chalao
    io.unobserve(e.target);
  }
}), { threshold: .15 });

// Har ".rv" element ko observe karo; har 3 elements ke baad delay repeat hota hai
document.querySelectorAll('.rv').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * .1 + 's';
  io.observe(el);
});


/* ---------------------------------------------------------------------
   5. CONTACT FORM (Web3Forms)
   Form submit hone par page reload nahi hota; data background mein
   send hota hai aur neeche status message dikhta hai.
   --------------------------------------------------------------------- */
document.getElementById('cf').onsubmit = async e => {
  e.preventDefault();  // Page reload roko

  const f = e.target;                        // Form
  const m = document.getElementById('fm');   // Status message ki jagah
  const b = f.querySelector('button');       // Send button

  // Validation: name, valid email aur message zaroori hain
  if (!f.name.value.trim() || !f.email.validity.valid || !f.message.value.trim()) {
    m.textContent = 'Please fill in all fields with a valid email.';
    return;
  }

  // Double click se bachne ke liye button disable karo
  b.disabled = true;
  m.textContent = 'Sending...';

  try {
    // Form data Web3Forms ko bhejo
    const r = await fetch(f.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(f)
    });
    const d = await r.json();

    if (d.success) {
      // Kamyab: message dikhao aur form khali kar do
      m.textContent = 'Thank you! Your message has been sent.';
      f.reset();
    } else {
      // Server ne error diya
      m.textContent = 'Something went wrong. Please try again or email me directly.';
    }
  } catch (err) {
    // Internet ya network ka masla
    m.textContent = 'Network error. Please try again or email me directly.';
  }

  // Button dobara enable karo
  b.disabled = false;
};


/* ---------------------------------------------------------------------
   6. FOOTER YEAR
   Copyright mein saal khud-ba-khud update hota hai
   --------------------------------------------------------------------- */
document.getElementById('yr').textContent = new Date().getFullYear();
