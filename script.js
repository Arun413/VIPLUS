/* ══════════════════════════════════════
   CHEMISTRY CANVAS BACKGROUND
   Floating chemical formulas + molecules
══════════════════════════════════════ */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

// All chemistry formulas / symbols relevant to oilfield chemicals
const FORMULAS = [
    'H₂O', 'CO₂', 'NaCl', 'CH₄', 'H₂S', 'KCl', 'CaCl₂', 'BaSO₄', 'NaOH',
    'HCl', 'H₂SO₄', 'NH₃', 'C₆H₆', 'CaCO₃', 'Na₂CO₃', 'NaHCO₃',
    'SiO₂', 'KOH', 'MgO', 'ZnBr₂', 'CsOH', 'K₂CO₃', 'C₂H₅OH',
    'NaNO₃', 'Fe₂O₃', 'Al₂O₃', 'N₂', 'O₂', 'Cl₂', 'SO₂', 'NO₂',
    'C₃H₈', 'C₁₂H₂₆', 'CH₂O', 'C₆H₁₂O₆', 'HCO₃⁻', 'Ca²⁺', 'Mg²⁺',
    'PO₄³⁻', 'SO₄²⁻', 'Na⁺', 'K⁺', 'H⁺', 'OH⁻', 'Fe³⁺', 'Zn²⁺',
    'pH', 'ppm', 'mol/L', 'ΔH', 'Ksp', 'Kw'
];

// Two-color scheme: green tones + teal/blue tones
const COLORS = [
    'rgba(0,230,118,',    // --green
    'rgba(38,198,218,',   // --teal
    'rgba(178,255,89,',   // --lime
    'rgba(128,222,234,',  // --sky
    'rgba(0,200,100,',    // darker green
    'rgba(77,208,225,',   // mid teal
];

const mItems = ['Filtration Control', 'Viscosifiers', 'Corrosion Inhibitors', 'Biocides & Scavengers', 'Shale Stabilizers', 'Lubricants', 'Lost Circulation Materials', 'OBM Products', 'NAF / RDF Systems', 'Brines', 'Nano Technology', 'Specialty Chemicals', 'Milling Fluids', 'HTHP Systems', 'Breaker Chemicals', 'Commercial Chemicals'];
const track = document.getElementById('marquee');
[...mItems, ...mItems].forEach(t => { track.innerHTML += `<span class="marquee-item"><span class="marquee-dot"></span>${t}</span>`; });

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class ChemParticle {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vy = -(Math.random() * 0.35 + 0.08);   // float upward slowly
        this.vx = (Math.random() - 0.5) * 0.15;
        this.rot = (Math.random() - 0.5) * 0.008;
        this.angle = Math.random() * Math.PI * 2;
        this.size = Math.random() * 9 + 8;             // font size 8–17px
        this.alpha = Math.random() * 0.22 + 0.06;
        this.maxAlpha = this.alpha;
        this.fade = Math.random() * 0.003 + 0.001;
        this.colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.formula = FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
        // optional: draw a tiny atom ring around some particles
        this.hasRing = Math.random() < 0.25;
        this.ringR = this.size * 2.2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.rot;
        // fade in/out
        if (this.y < H * 0.15) {
            this.alpha -= this.fade * 3;
        }
        if (this.alpha <= 0 || this.y < -40 || this.x < -80 || this.x > W + 80) {
            // reset to bottom
            this.x = Math.random() * W;
            this.y = H + 20;
            this.alpha = 0;
            this.maxAlpha = Math.random() * 0.22 + 0.06;
            this.formula = FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
            this.colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.size = Math.random() * 9 + 8;
            this.hasRing = Math.random() < 0.25;
        }
        if (this.alpha < this.maxAlpha && this.y > H * 0.15) {
            this.alpha += this.fade;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // optional orbit ring
        if (this.hasRing) {
            ctx.beginPath();
            ctx.ellipse(0, 0, this.ringR, this.ringR * 0.38, this.angle * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `${this.colorBase}${(this.alpha * 0.5).toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // tiny electron dot on ring
            const ex = Math.cos(this.angle * 3) * this.ringR;
            const ey = Math.sin(this.angle * 3) * this.ringR * 0.38;
            ctx.beginPath();
            ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `${this.colorBase}${(this.alpha * 0.9).toFixed(3)})`;
            ctx.fill();
        }

        // formula text
        ctx.font = `${this.size}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `${this.colorBase}${this.alpha.toFixed(3)})`;
        ctx.fillText(this.formula, 0, 0);

        ctx.restore();
    }
}

// Connection lines between nearby particles (like bonds)
function drawBonds() {
    const limit = window.innerWidth < 600 ? 80 : 120;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < limit) {
                const a = Math.min(particles[i].alpha, particles[j].alpha) * (1 - dist / limit) * 0.4;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,230,118,${a.toFixed(3)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

// Background gradient glow
function drawBackground() {
    ctx.clearRect(0, 0, W, H);
    // subtle radial green glow from center
    const g1 = ctx.createRadialGradient(W * 0.3, H * 0.4, 0, W * 0.3, H * 0.4, W * 0.6);
    g1.addColorStop(0, 'rgba(0,60,25,0.25)');
    g1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    // teal glow from right
    const g2 = ctx.createRadialGradient(W * 0.8, H * 0.6, 0, W * 0.8, H * 0.6, W * 0.5);
    g2.addColorStop(0, 'rgba(0,50,60,0.2)');
    g2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);
}

const pCount = window.innerWidth < 600 ? 45 : window.innerWidth < 1024 ? 70 : 110;
const particles = [];
for (let i = 0; i < pCount; i++) {
    const p = new ChemParticle();
    p.y = Math.random() * H; // scatter initially
    p.alpha = Math.random() * p.maxAlpha;
    particles.push(p);
}

function animate() {
    drawBackground();
    drawBonds();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const CATS = [
    { icon: '🧪', title: 'Filtration Control', label: 'Filtration Control Additives', items: ['Drilling Starch', 'Carboxymethylated Starch', 'Hydroxypropylated Starch', 'Polyanionic Cellulose LV', 'Polyanionic Cellulose HV', 'CMC LVT', 'CMC HVT', 'Synthetic Polymers for HT Fluid Loss', 'Resinated Lignite'] },
    { icon: '🌀', title: 'Viscosifiers', label: 'Viscosifiers', items: ['Xanthan Polymer DS', 'Xanthan Polymer Clarified', 'Xanthan Gum Liquid', 'Guar Gum', 'HEC Powder', 'HEC Liquid', 'Bentonite Drilling Grade', 'Bentonite OCMA'] },
    { icon: '🛡️', title: 'Corrosion Inhibitors', label: 'Corrosion Inhibitors', items: ['Corrosion Inhibitor – Packer Fluids', 'Corrosion Inhibitor – Drilling Fluids', 'Corrosion Inhibitor COB', 'Corrosion Inhibitor – Reservoir', 'Organic Acid Corrosion Inhibitor'] },
    { icon: '🦠', title: 'Biocides / Scavengers', label: 'Biocides & Scavengers', items: ['Bactericide Triazine Based', 'Bactericide Amine Based', 'Glutaraldehyde Biocide', 'O₂ Scavenger – Sodium Erythorbate', 'O₂ Scavenger – Sulphite Based', 'H₂S Scavenger – Irointe Sponge', 'H₂S Scavenger – Triazine'] },
    { icon: '⛏️', title: 'Shale Stabilizers', label: 'Shale Stabilizer / Inhibitor', items: ['Clouding Glycol LC', 'Clouding Glycol MC', 'Clouding Glycol HC', 'Sodium Silicate Liquid', 'Potassium Silicate Liquid', 'Sulphonated Asphalt K', 'Sulphonated Asphalt', 'Polyamine', 'PHPA Liquid', 'PHPA High Molecular Weight', 'PHPA LMW', 'Polymeric Sealant'] },
    { icon: '🔧', title: 'Lubricants', label: 'Lubricants', items: ['High Performance Ester Lubricant (Mono-Valent Brine)', 'Ester Based Lubricant', 'Phosphate Based Lubricant'] },
    { icon: '🪨', title: 'Lost Circulation', label: 'Lost Circulation Materials', items: ['Cellulose Fibre C', 'Cellulose Fibre M', 'Cellulose Fibre F', 'Acid Soluble Cellulose Fibre C/M/F', 'Walnut Shells F/M/C', 'Mica F/M/C', 'Cottonseed Hulls', 'Resilient Graphite Fine', 'Resilient Graphite', 'Graded/Sized Salt LCMs', 'Cross-linking Polymer LCMs', 'Marble 50/25/10/5/2 Microns'] },
    { icon: '🛢️', title: 'OBM Products', label: 'Oil Based Mud Products', items: ['Primary Emulsifier', 'Secondary Emulsifier', 'Single Shot Emulsifier', 'Organophilic Clay', 'Rheology Modifier (OBM)', 'Rheology Modifier & Filtration Control (OBM)', 'Thinner (OBM)'] },
    { icon: '🌡️', title: 'NAF / RDF Systems', label: 'NAF / RDF System Products', items: ['One-Stop Emulsifier Package (≤300°F)', 'One-Stop Emulsifier Package (>300°F)', 'HT Emulsifier (>400°F)', 'HT Fluid Loss Control (>400°F)', 'Emulsifier – Low OWR 60:40 to 50:50 (300°F)', 'Wetting Agent – Low OWR (300°F)', 'Treated Hectorite HT Viscosifier', 'Solvent Wash – Displacing OBM', 'Surfactant Wash – Displacing OBM', 'Rheology Modifier (Alternate)', 'Rheology Modifier Flat Gels', 'Lubricant for NAF (<2% v/v)', 'Emulsifier–Wetting Agent Blend'] },
    { icon: '💧', title: 'Brines', label: 'Brine Solutions', items: ['Potassium Formate – 1.57 SG (13.1 ppg)', 'Sodium Formate – 1.32 SG (11.0 ppg)', 'Zinc Bromide – 2.3 SG (19.2 ppg)', 'Cesium Formate', 'Heavy Brine >15 ppg (Zinc & Cesium Free)'] },
    { icon: '⚡', title: 'Nano Technology', label: 'Nano Technology Products', items: ['Nano-silica Compound – Shale Stabilisation', 'Nano-inhibitors for Shale', 'Nano-graphene Lubricant', 'Nano-size Synthetic Deformable Polymer (Fluid Loss / Differential Sticking)', 'Nanoscopic Surfactant-Solvent – Reservoir Wettability & Flowback'] },
    { icon: '🧬', title: 'HTHP Speciality', label: 'HTHP Speciality Products', items: ['Synthetic Polymer – HT Fluid Loss (350°F)', 'Synthetic Co-polymer – HT Fluid Loss (>400°F)', 'HT Viscosifier (>400°F)', 'HT Viscosifier & Fluid Loss Control (>400°F)', 'High Temp Stable Polymer Package', 'CFL', 'HT Thinner', 'Lignite'] },
];

const APPS = [
    { icon: '🛢️', name: 'Drilling Fluids', desc: 'Water-based, oil-based, and synthetic mud systems with complete additive packages.', relatedCats: [0, 1, 4, 6, 7, 8], products: ['Xanthan Polymer', 'PAC LV/HV', 'CMC HVT', 'Bentonite', 'Sulphonated Asphalt', 'Shale Inhibitors', 'LCM Range'] },
    { icon: '⚙️', name: 'Production Chemicals', desc: 'Corrosion inhibition, biocides, and scale management for production systems.', relatedCats: [2, 3], products: ['Corrosion Inhibitors', 'Bactericide Triazine', 'H₂S Scavengers', 'O₂ Scavengers', 'Glutaraldehyde Biocide'] },
    { icon: '🌊', name: 'Completion & Workover', desc: 'Brine systems, breaker chemicals, and milling fluid products.', relatedCats: [9, 7], products: ['Potassium Formate Brine', 'Zinc Bromide Brine', 'Cesium Formate', 'Breaker Chemicals', 'Milling Fluid Extenders'] },
    { icon: '🔩', name: 'Reservoir Enhancement', desc: 'Nano-technology solutions and wettability modifiers for improved recovery.', relatedCats: [10, 11], products: ['Nano-silica Shale Stabiliser', 'Nano-graphene Lubricant', 'Nanoscopic Surfactant-Solvent', 'Synthetic HT Co-polymer', 'Reservoir Corrosion Inhibitor'] },
];

/* populate main form */
const mainSel = document.getElementById('main-cat-select');
CATS.forEach(c => { const o = document.createElement('option'); o.value = c.title; o.textContent = c.label; mainSel.appendChild(o); });

/* ── HAMBURGER ── */
function toggleMenu() {
    const h = document.getElementById('hamburger'), m = document.getElementById('mobile-menu');
    h.classList.toggle('open'); m.classList.toggle('open');
    document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('mobile-menu').classList.remove('open');
    document.body.style.overflow = '';
}
document.getElementById('mobile-menu').addEventListener('click', e => { if (e.target === e.currentTarget) closeMenu(); });

/* ── BUILD PRODUCT CARDS ── */
const grid = document.getElementById('cat-grid');
CATS.forEach((c, i) => {
    const delay = (i % 3) * 0.08;
    const vis = c.items.slice(0, 5);
    const hid = c.items.slice(5);
    const visHtml = vis.map(it => `<li>${it}</li>`).join('');
    const hidHtml = hid.map((it, j) => `<li class="cat-hidden" data-hidx="${i}-${j}">${it}</li>`).join('');
    const moreBtn = hid.length ? `<button class="cat-more-btn" data-cat="${i}" onclick="toggleMore(event,${i})">▸ +${hid.length} more products</button>` : '';
    grid.innerHTML += `
  <div class="category-card reveal" style="transition-delay:${delay}s" onclick="openCatModal(${i},event)">
    <div class="cat-count">${c.items.length}</div>
    <span class="cat-icon">${c.icon}</span>
    <div class="cat-title">${c.title}</div>
    <ul class="cat-items" id="cat-list-${i}">${visHtml}${hidHtml}</ul>
    ${moreBtn}
    <div class="card-click-hint">Click to enquire ›</div>
  </div>`;
});

function toggleMore(e, ci) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const els = document.querySelectorAll(`[data-hidx^="${ci}-"]`);
    const open = btn.getAttribute('data-open') === '1';
    els.forEach(el => el.classList.toggle('shown', !open));
    btn.textContent = open ? `▸ +${CATS[ci].items.length - 5} more products` : '▴ Show less';
    btn.setAttribute('data-open', open ? '0' : '1');
}

/* ── BUILD APP CARDS ── */
const appsGrid = document.getElementById('apps-grid');
APPS.forEach((a, i) => {
    appsGrid.innerHTML += `
  <div class="app-card reveal" onclick="openAppModal(${i})">
    <span class="app-icon">${a.icon}</span>
    <div class="app-name">${a.name}</div>
    <p class="app-desc">${a.desc}</p>
  </div>`;
});

/* ── MODAL ── */
let currentType = '', currentIdx = 0;

function openCatModal(idx, e) {
    if (e && e.target.closest('.cat-more-btn')) return;
    currentType = 'cat'; currentIdx = idx;
    const c = CATS[idx];
    document.getElementById('modal-icon').textContent = c.icon;
    document.getElementById('modal-label').textContent = 'Product Category';
    document.getElementById('modal-title').textContent = c.title;
    document.getElementById('modal-prefill-text').textContent = c.label + ' Inquiry';
    document.getElementById('modal-products-list').innerHTML = c.items.map(it => `<div class="modal-product-item">${it}</div>`).join('');
    document.getElementById('modal-products-section').style.display = '';
    document.getElementById('modal-products-checkboxes').innerHTML = c.items.map((it, i) => `<label class="prod-check-label"><input type="checkbox" value="${it}" ${i < 3 ? 'checked' : ''}> ${it}</label>`).join('');
    document.getElementById('modal-products-check-field').style.display = '';
    document.getElementById('modal-industry-field').style.display = '';
    document.getElementById('mf-industry').value = '';
    resetModal(); openModal();
}

function openAppModal(idx) {
    currentType = 'app'; currentIdx = idx;
    const a = APPS[idx];
    document.getElementById('modal-icon').textContent = a.icon;
    document.getElementById('modal-label').textContent = 'Industry Application';
    document.getElementById('modal-title').textContent = a.name;
    document.getElementById('modal-prefill-text').textContent = a.name + ' Application Inquiry';
    document.getElementById('modal-products-list').innerHTML = a.products.map(it => `<div class="modal-product-item">${it}</div>`).join('');
    document.getElementById('modal-products-section').style.display = '';
    const allProds = [];
    a.relatedCats.forEach(ci => CATS[ci].items.forEach(p => allProds.push(p)));
    document.getElementById('modal-products-checkboxes').innerHTML = allProds.map(it => `<label class="prod-check-label"><input type="checkbox" value="${it}" ${a.products.some(p => it.toLowerCase().includes(p.toLowerCase().split(' ')[0])) ? 'checked' : ''}> ${it}</label>`).join('');
    document.getElementById('modal-products-check-field').style.display = '';
    const ind = document.getElementById('mf-industry');
    ind.value = a.name;
    if (!ind.value) { const o = document.createElement('option'); o.value = a.name; o.textContent = a.name; ind.insertBefore(o, ind.options[1]); ind.value = a.name; }
    document.getElementById('modal-industry-field').style.display = '';
    resetModal(); openModal();
}

function resetModal() {
    document.getElementById('modal-form').style.display = '';
    document.getElementById('modal-success').classList.remove('show');
    document.getElementById('modal-form').reset();
    document.getElementById('modal-box').scrollTop = 0;
}
function openModal() {
    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
}
function handleOverlayClick(e) { if (e.target === document.getElementById('modal-overlay')) closeModal(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function submitModalForm(e) {
    e.preventDefault();
    document.getElementById('modal-form').style.display = 'none';
    document.getElementById('modal-success').classList.add('show');
    document.getElementById('modal-box').scrollTop = 0;
}

function showMainFormSuccess(btn) {
    btn.textContent = '✓ Sent!';
    btn.style.background = 'linear-gradient(135deg,#008040,#00c060)';
    setTimeout(() => { btn.textContent = 'Send Inquiry →'; btn.style.background = ''; }, 3000);
}

/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), 60); obs.unobserve(e.target); } });
}, { threshold: .08 });
setTimeout(() => document.querySelectorAll('.reveal').forEach(el => obs.observe(el)), 50);