/* ══════════════════════════════════════════════
   ██████████  EMAILJS CONFIGURATION  ██████████
   
   SETUP STEPS:
   1. Go to https://www.emailjs.com and create a free account
   2. Add an Email Service (Gmail, Outlook, etc.)
   3. Create an Email Template — use these variables:
        {{from_name}}     — sender name
        {{from_email}}    — sender email
        {{from_phone}}    — sender phone
        {{company}}       — company name
        {{category}}      — product category / application
        {{products}}      — selected products list
        {{industry}}      — industry / application
        {{quantity}}      — quantity required
        {{required_by}}   — required by date
        {{notes}}         — additional notes
        {{form_type}}     — "Product Inquiry" or "Contact Form"
        {{subject}}       — auto-generated subject line
   4. Copy your Public Key, Service ID, Template ID below
══════════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY = 'uUuT6i8wM65rYEm6s';    // e.g. 'abc123XYZ'
const EMAILJS_SERVICE_ID = 'service_6e5lh75';    // e.g. 'service_vchem'
const EMAILJS_TEMPLATE_ID = 'template_cvx9kvd';   // e.g. 'template_inquiry'

// Show config banner if keys are not set
const keysConfigured = !EMAILJS_PUBLIC_KEY.startsWith('YOUR_');
if (!keysConfigured) {
    document.getElementById('config-banner').classList.add('show');
    setTimeout(() => document.getElementById('config-banner').classList.remove('show'), 8000);
}

// Initialise EmailJS
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/* ──────────────────────────────────────────────
   SEND EMAIL via EmailJS
────────────────────────────────────────────── */
async function sendEmail(params) {
    if (!keysConfigured) {
        // Dev fallback: simulate send
        await new Promise(r => setTimeout(r, 1200));
        console.log('EmailJS not configured — would have sent:', params);
        return { status: 200, text: 'OK (simulated)' };
    }
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
}

/* ──────────────────────────────────────────────
   CHEMISTRY CANVAS BACKGROUND
────────────────────────────────────────────── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

const FORMULAS = [
    'H₂O', 'CO₂', 'NaCl', 'CH₄', 'H₂S', 'KCl', 'CaCl₂', 'BaSO₄', 'NaOH',
    'HCl', 'H₂SO₄', 'NH₃', 'C₆H₆', 'CaCO₃', 'Na₂CO₃', 'NaHCO₃',
    'SiO₂', 'KOH', 'MgO', 'ZnBr₂', 'CsOH', 'K₂CO₃', 'C₂H₅OH',
    'NaNO₃', 'Fe₂O₃', 'Al₂O₃', 'N₂', 'O₂', 'Cl₂', 'SO₂', 'NO₂',
    'C₃H₈', 'C₁₂H₂₆', 'CH₂O', 'HCO₃⁻', 'Ca²⁺', 'Mg²⁺',
    'PO₄³⁻', 'SO₄²⁻', 'Na⁺', 'K⁺', 'H⁺', 'OH⁻', 'Fe³⁺', 'Zn²⁺',
    'pH', 'ppm', 'mol/L', 'ΔH', 'Ksp', 'Kw', 'BaCl₂', 'MgCl₂',
    'C₆H₁₂O₆', 'CsOOH', 'NaBr', 'KBr', 'ZnCl₂', 'FeCl₃'
];
const COLORS = [
    'rgba(0,230,118,',
    'rgba(38,198,218,',
    'rgba(178,255,89,',
    'rgba(128,222,234,',
    'rgba(0,200,100,',
    'rgba(77,208,225,',
];

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

class ChemParticle {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vy = -(Math.random() * 0.35 + 0.08);
        this.vx = (Math.random() - 0.5) * 0.15;
        this.rot = (Math.random() - 0.5) * 0.008;
        this.angle = Math.random() * Math.PI * 2;
        this.size = Math.random() * 9 + 8;
        this.alpha = Math.random() * 0.22 + 0.06;
        this.maxAlpha = this.alpha;
        this.fade = Math.random() * 0.003 + 0.001;
        this.colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.formula = FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
        this.hasRing = Math.random() < 0.25;
        this.ringR = this.size * 2.2;
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.angle += this.rot;
        if (this.y < H * 0.15) this.alpha -= this.fade * 3;
        if (this.alpha <= 0 || this.y < -40 || this.x < -80 || this.x > W + 80) {
            this.x = Math.random() * W; this.y = H + 20; this.alpha = 0;
            this.maxAlpha = Math.random() * 0.22 + 0.06;
            this.formula = FORMULAS[Math.floor(Math.random() * FORMULAS.length)];
            this.colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.size = Math.random() * 9 + 8;
            this.hasRing = Math.random() < 0.25;
        }
        if (this.alpha < this.maxAlpha && this.y > H * 0.15) this.alpha += this.fade;
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
        if (this.hasRing) {
            ctx.beginPath();
            ctx.ellipse(0, 0, this.ringR, this.ringR * 0.38, this.angle * 2, 0, Math.PI * 2);
            ctx.strokeStyle = `${this.colorBase}${(this.alpha * 0.5).toFixed(3)})`;
            ctx.lineWidth = 0.6; ctx.stroke();
            const ex = Math.cos(this.angle * 3) * this.ringR;
            const ey = Math.sin(this.angle * 3) * this.ringR * 0.38;
            ctx.beginPath(); ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `${this.colorBase}${(this.alpha * 0.9).toFixed(3)})`; ctx.fill();
        }
        ctx.font = `${this.size}px 'Courier New',monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = `${this.colorBase}${this.alpha.toFixed(3)})`;
        ctx.fillText(this.formula, 0, 0);
        ctx.restore();
    }
}

function drawBonds() {
    const lim = window.innerWidth < 600 ? 80 : 120;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < lim) {
                const a = Math.min(particles[i].alpha, particles[j].alpha) * (1 - d / lim) * 0.4;
                ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0,230,118,${a.toFixed(3)})`; ctx.lineWidth = 0.5; ctx.stroke();
            }
        }
    }
}

function drawBG() {
    ctx.clearRect(0, 0, W, H);
    const g1 = ctx.createRadialGradient(W * .3, H * .4, 0, W * .3, H * .4, W * .6);
    g1.addColorStop(0, 'rgba(0,60,25,.25)'); g1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(W * .8, H * .6, 0, W * .8, H * .6, W * .5);
    g2.addColorStop(0, 'rgba(0,50,60,.2)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
}

const pCount = window.innerWidth < 600 ? 45 : window.innerWidth < 1024 ? 70 : 110;
const particles = [];
for (let i = 0; i < pCount; i++) {
    const p = new ChemParticle(); p.y = Math.random() * H; p.alpha = Math.random() * p.maxAlpha; particles.push(p);
}
function animate() { drawBG(); drawBonds(); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
animate();

/* ──────────────────────────────────────────────
   DATA
────────────────────────────────────────────── */
const CATS = [
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\"/></svg>', title: 'Filtration Control', label: 'Filtration Control Additives', items: ['Drilling Starch', 'Carboxymethylated Starch', 'Hydroxypropylated Starch', 'Polyanionic Cellulose LV', 'Polyanionic Cellulose HV', 'CMC LVT', 'CMC HVT', 'Synthetic Polymers for HT Fluid Loss', 'Resinated Lignite'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 10c2-3 4-3 6 0s4 3 6 0 4-3 6 0\"/><path d=\"M2 16c2-3 4-3 6 0s4 3 6 0 4-3 6 0\"  /></svg>', title: 'Viscosifiers', label: 'Viscosifiers', items: ['Xanthan Polymer DS', 'Xanthan Polymer Clarified', 'Xanthan Gum Liquid', 'Guar Gum', 'HEC Powder', 'HEC Liquid', 'Bentonite Drilling Grade', 'Bentonite OCMA'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"/><polyline points=\"9 12 11 14 15 10\"  /></svg>', title: 'Corrosion Inhibitors', label: 'Corrosion Inhibitors', items: ['Corrosion Inhibitor – Packer Fluids', 'Corrosion Inhibitor – Drilling Fluids', 'Corrosion Inhibitor COB', 'Corrosion Inhibitor – Reservoir', 'Organic Acid Corrosion Inhibitor'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 3h6v8l4.5 7.5A2 2 0 0 1 18 22H6a2 2 0 0 1-1.5-3.5L9 11V3z\"/><line x1=\"6\" y1=\"16\" x2=\"18\" y2=\"16\"  /></svg>', title: 'Biocides / Scavengers', label: 'Biocides & Scavengers', items: ['Bactericide Triazine Based', 'Bactericide Amine Based', 'Glutaraldehyde Biocide', 'O₂ Scavenger – Sodium Erythorbate', 'O₂ Scavenger – Sulphite Based', 'H₂S Scavenger – Irointe Sponge', 'H₂S Scavenger – Triazine'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"12 2 2 7 12 12 22 7 12 2\"/><polyline points=\"2 17 12 22 22 17\"/><polyline points=\"2 12 12 17 22 12\"  /></svg>', title: 'Shale Stabilizers', label: 'Shale Stabilizer / Inhibitor', items: ['Clouding Glycol LC', 'Clouding Glycol MC', 'Clouding Glycol HC', 'Sodium Silicate Liquid', 'Potassium Silicate Liquid', 'Sulphonated Asphalt K', 'Sulphonated Asphalt', 'Polyamine', 'PHPA Liquid', 'PHPA High Molecular Weight', 'PHPA LMW', 'Polymeric Sealant'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z\"  /></svg>', title: 'Lubricants', label: 'Lubricants', items: ['High Performance Ester Lubricant (Mono-Valent Brine)', 'Ester Based Lubricant', 'Phosphate Based Lubricant'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"5\" y=\"11\" width=\"14\" height=\"7\" rx=\"2\"/><path d=\"M8 11V8a4 4 0 0 1 8 0v3\"  /></svg>', title: 'Lost Circulation', label: 'Lost Circulation Materials', items: ['Cellulose Fibre C', 'Cellulose Fibre M', 'Cellulose Fibre F', 'Acid Soluble Cellulose Fibre C/M/F', 'Walnut Shells F/M/C', 'Mica F/M/C', 'Cottonseed Hulls', 'Resilient Graphite Fine', 'Resilient Graphite', 'Graded/Sized Salt LCMs', 'Cross-linking Polymer LCMs', 'Marble 50/25/10/5/2 Microns'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><ellipse cx=\"12\" cy=\"5\" rx=\"8\" ry=\"3\"/><path d=\"M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5\"/><path d=\"M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3\"  /></svg>', title: 'OBM Products', label: 'Oil Based Mud Products', items: ['Primary Emulsifier', 'Secondary Emulsifier', 'Single Shot Emulsifier', 'Organophilic Clay', 'Rheology Modifier (OBM)', 'Rheology Modifier & Filtration Control (OBM)', 'Thinner (OBM)'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z\"/><line x1=\"10\" y1=\"7\" x2=\"9\" y2=\"7\"/><line x1=\"10\" y1=\"10\" x2=\"9\" y2=\"10\"  /></svg>', title: 'NAF / RDF Systems', label: 'NAF / RDF System Products', items: ['One-Stop Emulsifier Package (≤300°F)', 'One-Stop Emulsifier Package (>300°F)', 'HT Emulsifier (>400°F)', 'HT Fluid Loss Control (>400°F)', 'Emulsifier – Low OWR 60:40 to 50:50 (300°F)', 'Wetting Agent – Low OWR (300°F)', 'Treated Hectorite HT Viscosifier', 'Solvent Wash – Displacing OBM', 'Surfactant Wash – Displacing OBM', 'Rheology Modifier (Alternate)', 'Rheology Modifier Flat Gels', 'Lubricant for NAF (<2% v/v)', 'Emulsifier–Wetting Agent Blend'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 2h8\"/><path d=\"M9 2v7.55L4 20h16L15 9.55V2\"/><line x1=\"4.93\" y1=\"15\" x2=\"19.07\" y2=\"15\"  /></svg>', title: 'Brines', label: 'Brine Solutions', items: ['Potassium Formate – 1.57 SG (13.1 ppg)', 'Sodium Formate – 1.32 SG (11.0 ppg)', 'Zinc Bromide – 2.3 SG (19.2 ppg)', 'Cesium Formate', 'Heavy Brine >15 ppg (Zinc & Cesium Free)'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"2\"/><ellipse cx=\"12\" cy=\"12\" rx=\"10\" ry=\"4\"/><ellipse cx=\"12\" cy=\"12\" rx=\"10\" ry=\"4\" transform=\"rotate(60 12 12)\"/><ellipse cx=\"12\" cy=\"12\" rx=\"10\" ry=\"4\" transform=\"rotate(120 12 12)\"  /></svg>', title: 'Nano Technology', label: 'Nano Technology Products', items: ['Nano-silica Compound – Shale Stabilisation', 'Nano-inhibitors for Shale', 'Nano-graphene Lubricant', 'Nano-size Synthetic Deformable Polymer (Fluid Loss / Differential Sticking)', 'Nanoscopic Surfactant-Solvent – Reservoir Wettability & Flowback'] },
    { icon: '<svg width=\"28\" height=\"28\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 22c4 0 7-3.58 7-8 0-3-1.5-5-3-7-1 2.5-1.5 3-2 3s-1-1-1-3C11 5 9.5 3 8 2c-1.5 3-3 5.5-3 7.5A7 7 0 0 0 12 22z\"  /></svg>', title: 'HTHP Speciality', label: 'HTHP Speciality Products', items: ['Synthetic Polymer – HT Fluid Loss (350°F)', 'Synthetic Co-polymer – HT Fluid Loss (>400°F)', 'HT Viscosifier (>400°F)', 'HT Viscosifier & Fluid Loss Control (>400°F)', 'High Temp Stable Polymer Package', 'CFL', 'HT Thinner', 'Lignite'] },
];

const APPS = [
    { icon: '<svg width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"8\" y=\"12\" width=\"8\" height=\"9\" rx=\"1\"/><path d=\"M12 3v9\"/><path d=\"M6 12h12\"/><path d=\"M9 7l3-5 3 5\"  /></svg>', name: 'Drilling Fluids', desc: 'Water-based, oil-based, and synthetic mud systems with complete additive packages.', relatedCats: [0, 1, 4, 6, 7, 8], products: ['Xanthan Polymer', 'PAC LV/HV', 'CMC HVT', 'Bentonite', 'Sulphonated Asphalt', 'Shale Inhibitors', 'LCM Range'] },
    { icon: '<svg width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z\"  /></svg>', name: 'Production Chemicals', desc: 'Corrosion inhibition, biocides, and scale management for production systems.', relatedCats: [2, 3], products: ['Corrosion Inhibitors', 'Bactericide Triazine', 'H₂S Scavengers', 'O₂ Scavengers', 'Glutaraldehyde Biocide'] },
    { icon: '<svg width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"  /></svg>', name: 'Completion & Workover', desc: 'Brine systems, breaker chemicals, and milling fluid products.', relatedCats: [9, 7], products: ['Potassium Formate Brine', 'Zinc Bromide Brine', 'Cesium Formate', 'Breaker Chemicals', 'Milling Fluid Extenders'] },
    { icon: '<svg width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"/><polyline points=\"17 6 23 6 23 12\"  /></svg>', name: 'Reservoir Enhancement', desc: 'Nano-technology solutions and wettability modifiers for improved recovery.', relatedCats: [10, 11], products: ['Nano-silica Shale Stabiliser', 'Nano-graphene Lubricant', 'Nanoscopic Surfactant-Solvent', 'Synthetic HT Co-polymer', 'Reservoir Corrosion Inhibitor'] },
];

/* Populate category dropdowns */
const cfCat = document.getElementById('cf-category');
CATS.forEach(c => { const o = document.createElement('option'); o.value = c.label; o.textContent = c.label; cfCat.appendChild(o); });

/* ──────────────────────────────────────────────
   HAMBURGER
────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────
   BUILD PRODUCT CARDS
────────────────────────────────────────────── */
const grid = document.getElementById('cat-grid');
CATS.forEach((c, i) => {
    const delay = (i % 3) * 0.08;
    const vis = c.items.slice(0, 5), hid = c.items.slice(5);
    const visHtml = vis.map(it => `<li>${it}</li>`).join('');
    const hidHtml = hid.map((it, j) => `<li class="cat-hidden" data-hidx="${i}-${j}">${it}</li>`).join('');
    const moreBtn = hid.length ? `<button class="cat-more-btn" onclick="toggleMore(event,${i})">▸ +${hid.length} more products</button>` : '';
    grid.innerHTML += `
  <div class="category-card reveal" style="transition-delay:${delay}s" onclick="openCatModal(${i},event)">
    <div class="cat-count">${c.items.length}</div>
    <span class="cat-icon">${c.icon}</span>
    <div class="cat-title">${c.title}</div>
    <ul class="cat-items">${visHtml}${hidHtml}</ul>
    ${moreBtn}
    <div class="card-click-hint">Click to enquire ›</div>
  </div>`;
});

function toggleMore(e, ci) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const open = btn.getAttribute('data-open') === '1';
    document.querySelectorAll(`[data-hidx^="${ci}-"]`).forEach(el => el.classList.toggle('shown', !open));
    btn.textContent = open ? `▸ +${CATS[ci].items.length - 5} more products` : '▴ Show less';
    btn.setAttribute('data-open', open ? '0' : '1');
}

/* ──────────────────────────────────────────────
   BUILD APPLICATION CARDS
────────────────────────────────────────────── */
const appsGrid = document.getElementById('apps-grid');
APPS.forEach((a, i) => {
    appsGrid.innerHTML += `
  <div class="app-card reveal" onclick="openAppModal(${i})">
    <span class="app-icon">${a.icon}</span>
    <div class="app-name">${a.name}</div>
    <p class="app-desc">${a.desc}</p>
  </div>`;
});

/* ──────────────────────────────────────────────
   MODAL
────────────────────────────────────────────── */
let currentType = '', currentIdx = 0;

function openCatModal(idx, e) {
    if (e && e.target.closest('.cat-more-btn')) return;
    currentType = 'cat'; currentIdx = idx;
    const c = CATS[idx];
    document.getElementById('modal-icon').innerHTML = c.icon;
    document.getElementById('modal-label').textContent = 'Product Category';
    document.getElementById('modal-title').textContent = c.title;
    document.getElementById('modal-prefill-text').textContent = c.label + ' — VChem Inquiry';
    document.getElementById('modal-products-list').innerHTML = c.items.map(it => `<div class="modal-product-item">${it}</div>`).join('');
    document.getElementById('modal-products-checkboxes').innerHTML = c.items.map((it, i) => `<label class="prod-check-label"><input type="checkbox" value="${it}" ${i < 3 ? 'checked' : ''}> ${it}</label>`).join('');
    document.getElementById('mf-industry').value = '';
    resetModal(); openModal();
}

function openAppModal(idx) {
    currentType = 'app'; currentIdx = idx;
    const a = APPS[idx];
    document.getElementById('modal-icon').innerHTML = a.icon;
    document.getElementById('modal-label').textContent = 'Industry Application';
    document.getElementById('modal-title').textContent = a.name;
    document.getElementById('modal-prefill-text').textContent = a.name + ' Application — VChem Inquiry';
    document.getElementById('modal-products-list').innerHTML = a.products.map(it => `<div class="modal-product-item">${it}</div>`).join('');
    const allProds = [];
    a.relatedCats.forEach(ci => CATS[ci].items.forEach(p => allProds.push(p)));
    document.getElementById('modal-products-checkboxes').innerHTML = allProds.map(it =>
        `<label class="prod-check-label"><input type="checkbox" value="${it}" ${a.products.some(p => it.toLowerCase().includes(p.toLowerCase().split(' ')[0])) ? 'checked' : ''}> ${it}</label>`
    ).join('');
    const ind = document.getElementById('mf-industry');
    // pre-set industry option
    [...ind.options].forEach(o => { if (o.value === a.name) o.selected = true; });
    if (!ind.value) {
        const o = document.createElement('option'); o.value = a.name; o.textContent = a.name;
        ind.insertBefore(o, ind.options[1]); ind.value = a.name;
    }
    resetModal(); openModal();
}

function resetModal() {
    document.getElementById('modal-form').style.display = '';
    document.getElementById('modal-success').classList.remove('show');
    document.getElementById('modal-form').reset();
    setStatus('mf-status', '', '');
    document.getElementById('modal-box').scrollTop = 0;
}
function openModal() { document.getElementById('modal-overlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); document.body.style.overflow = ''; }
function handleOverlayClick(e) { if (e.target === document.getElementById('modal-overlay')) closeModal(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ──────────────────────────────────────────────
   STATUS HELPER
────────────────────────────────────────────── */
function setStatus(id, type, msg) {
    const el = document.getElementById(id);
    el.className = 'form-status' + (type ? ' ' + type : '');
    el.textContent = msg;
}

/* ──────────────────────────────────────────────
   SUBMIT MODAL FORM → EmailJS
────────────────────────────────────────────── */
async function submitModalForm(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('mf-submit');
    submitBtn.disabled = true;
    setStatus('mf-status', 'sending', 'Sending your inquiry to VChem...');

    const checkedProds = [...document.querySelectorAll('#modal-products-checkboxes input:checked')]
        .map(i => i.value).join(', ') || 'Not specified';

    const category = currentType === 'cat' ? CATS[currentIdx].label : APPS[currentIdx].name;
    const subject = `VChem Inquiry — ${category} — ${document.getElementById('mf-name').value}`;

    const params = {
        subject,
        form_type: currentType === 'cat' ? 'Product Category Inquiry' : 'Application Inquiry',
        category,
        from_name: document.getElementById('mf-name').value,
        company: document.getElementById('mf-company').value,
        from_email: document.getElementById('mf-email').value,
        from_phone: document.getElementById('mf-phone').value || 'Not provided',
        industry: document.getElementById('mf-industry').value || 'Not specified',
        products: checkedProds,
        quantity: document.getElementById('mf-qty').value || 'Not specified',
        required_by: document.getElementById('mf-date').value || 'Not specified',
        notes: document.getElementById('mf-notes').value || 'None',
    };

    try {
        await sendEmail(params);
        document.getElementById('modal-form').style.display = 'none';
        document.getElementById('modal-success').classList.add('show');
        document.getElementById('modal-box').scrollTop = 0;
    } catch (err) {
        console.error('EmailJS error:', err);
        setStatus('mf-status', 'error', 'Failed to send. Please email info@vchem.com or call +966 548 130 415.');
        submitBtn.disabled = false;
    }
}

/* ──────────────────────────────────────────────
   SUBMIT CONTACT FORM → EmailJS
────────────────────────────────────────────── */
async function submitContactForm() {
    const name = document.getElementById('cf-name').value.trim();
    const company = document.getElementById('cf-company').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const cat = document.getElementById('cf-category').value;
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !company || !email) {
        setStatus('cf-status', 'error', 'Please fill in Name, Company and Email before sending.');
        return;
    }

    const btn = document.getElementById('cf-submit');
    btn.disabled = true;
    setStatus('cf-status', 'sending', 'Sending your message to VChem...');

    const params = {
        subject: `VChem General Inquiry — ${cat || 'General'} — ${name}`,
        form_type: 'Contact Form',
        category: cat || 'General Inquiry',
        from_name: name,
        company,
        from_email: email,
        from_phone: phone || 'Not provided',
        industry: 'Not specified',
        products: cat || 'Not specified',
        quantity: 'Not specified',
        required_by: 'Not specified',
        notes: message || 'None',
    };

    try {
        await sendEmail(params);
        setStatus('cf-status', 'success', '✔ Message sent! VChem will reply within 24 hours at info@vchem.com.');
        document.getElementById('cf-name').value = '';
        document.getElementById('cf-company').value = '';
        document.getElementById('cf-email').value = '';
        document.getElementById('cf-phone').value = '';
        document.getElementById('cf-category').value = '';
        document.getElementById('cf-message').value = '';
        btn.textContent = '✓ Sent!';
        setTimeout(() => { btn.textContent = 'Send Inquiry →'; btn.disabled = false; }, 4000);
    } catch (err) {
        console.error('EmailJS error:', err);
        setStatus('cf-status', 'error', 'Send failed. Please email info@vchem.com or call +966 548 130 415.');
        btn.disabled = false;
    }
}


/* ─── MARQUEE ─── */
const mItems = ['Filtration Control', 'Viscosifiers', 'Corrosion Inhibitors', 'Biocides & Scavengers',
    'Shale Stabilizers', 'Lubricants', 'Lost Circulation Materials', 'OBM Products', 'NAF / RDF Systems',
    'Brines', 'Nano Technology', 'Specialty Chemicals', 'Milling Fluids', 'HTHP Systems',
    'Breaker Chemicals', 'Commercial Chemicals', 'Drilling Fluids Mfg.', 'VChem Traders'];
const track = document.getElementById('marquee');
[...mItems, ...mItems].forEach(t => {
    track.innerHTML += `<span class="marquee-item"><span class="marquee-dot"></span>${t}</span>`;
});

/* ─── SCROLL REVEAL ─── */
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), 60);
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });

setTimeout(() => document.querySelectorAll('.reveal').forEach(el => obs.observe(el)), 100);

/* ─── SERVICES TAB SWITCHER ─── */
function showServicePanel(index, btn) {
    // Hide all panels
    document.querySelectorAll('.services-panel').forEach(p => p.classList.remove('active'));
    // Deactivate all tabs
    document.querySelectorAll('.svc-tab').forEach(t => t.classList.remove('active'));
    // Activate selected
    document.getElementById('svc-panel-' + index).classList.add('active');
    btn.classList.add('active');
}

/* ─── OPEN SERVICE CARD MODAL ─── */
function openSvcModal(serviceName, cardTitle, items) {
    currentType = 'svc';
    currentIdx = -1;

    // Icon: wrench/settings SVG for services
    const icon = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`;

    document.getElementById('modal-icon').innerHTML = icon;
    document.getElementById('modal-label').textContent = serviceName;
    document.getElementById('modal-title').textContent = cardTitle;
    document.getElementById('modal-prefill-text').textContent = cardTitle + ' — VChem Service Inquiry';

    // Show service items in the products list area
    document.getElementById('modal-products-list').innerHTML = items.map(it =>
        `<div class="modal-product-item">${it}</div>`
    ).join('');

    // Checkboxes for items so user can select which they're interested in
    document.getElementById('modal-products-checkboxes').innerHTML = items.map((it, i) =>
        `<label class="prod-check-label"><input type="checkbox" value="${it}" ${i < 3 ? 'checked' : ''}> ${it}</label>`
    ).join('');

    // Pre-set industry dropdown to the service name if possible
    const ind = document.getElementById('mf-industry');
    let matched = false;
    [...ind.options].forEach(o => {
        if (o.value.toLowerCase().includes(serviceName.split(' ')[0].toLowerCase())) {
            o.selected = true; matched = true;
        }
    });
    if (!matched) {
        // Add a temporary option for this service
        let existing = [...ind.options].find(o => o.value === serviceName);
        if (!existing) {
            const o = document.createElement('option');
            o.value = serviceName; o.textContent = serviceName;
            o.setAttribute('data-temp', '1');
            ind.insertBefore(o, ind.options[1]);
        }
        ind.value = serviceName;
    }

    resetModal(); openModal();
}

// Patch submitModalForm to handle 'svc' type
const _origSubmit = submitModalForm;
// Override category/subject logic for svc type inside submitModalForm
// (done inline: submitModalForm already reads currentType, we just need it to handle 'svc')