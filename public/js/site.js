const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
let state = { applications: [], categories: [] };

function applyCms(settings = {}) {
  const content = settings.pageContent || {};
  const brand = settings.brand || {};
  const textFields = {
    cmsHeroBadge: content.heroBadge,
    cmsHeroDescription: content.heroDescription,
    cmsHeroPrimaryCta: content.heroPrimaryCta,
    cmsHeroSecondaryCta: content.heroSecondaryCta,
    cmsAboutEyebrow: content.aboutEyebrow,
    cmsAboutDescription: content.aboutDescription,
    cmsServicesEyebrow: content.servicesEyebrow,
    cmsServicesTitle: content.servicesTitle,
    cmsServicesDescription: content.servicesDescription,
    cmsPortfolioEyebrow: content.portfolioEyebrow,
    cmsPortfolioTitle: content.portfolioTitle,
    cmsPortfolioDescription: content.portfolioDescription,
    cmsProcessEyebrow: content.processEyebrow,
    cmsProcessTitle: content.processTitle,
    cmsProcessDescription: content.processDescription,
    cmsStackEyebrow: content.stackEyebrow,
    cmsStackDescription: content.stackDescription,
    cmsContactEyebrow: content.contactEyebrow,
    cmsContactDescription: content.contactDescription,
    cmsFooterHeadline: content.footerHeadline
  };
  for (const [id, value] of Object.entries(textFields)) if (value) { const element = document.getElementById(id); if (element) element.textContent = value; }
  const richTitles = [
    ['cmsHeroTitle', content.heroTitle, content.heroHighlight, ' '],
    ['cmsAboutTitle', content.aboutTitle, content.aboutHighlight, '<br>'],
    ['cmsStackTitle', content.stackTitle, content.stackHighlight, '<br>'],
    ['cmsContactTitle', content.contactTitle, content.contactHighlight, '<br>']
  ];
  for (const [id, title, highlight, separator] of richTitles) if (title || highlight) { const element = document.getElementById(id); if (element) element.innerHTML = `${escapeHtml(title || '')}${separator}<em>${escapeHtml(highlight || '')}</em>`; }
  if (content.heroImage) { const image = document.getElementById('cmsHeroImage'); image.src = content.heroImage; }
  if (brand.name) document.querySelectorAll('.brand-copy strong').forEach(element => { element.textContent = brand.name; });
  if (brand.tagline) document.querySelectorAll('.brand-copy small').forEach(element => { element.textContent = brand.tagline; });
  if (brand.logoUrl) document.querySelectorAll('.brand-mark').forEach(mark => { const image = document.createElement('img'); image.src = brand.logoUrl; image.alt = brand.name || 'PromptWorks'; mark.replaceChildren(image); });
}

function renderMetrics(metrics = {}) {
  const items = [['applications','Aplicaciones desarrolladas'],['categories','Categorías de software'],['technologies','Tecnologías utilizadas'],['completed','Proyectos completados']];
  $('#metrics').innerHTML = items.map(([key,label]) => `<div class="metric"><b>${Number(metrics[key] || 0)}</b><span>${label}</span></div>`).join('');
}
function renderServices(items) {
  $('#servicesGrid').innerHTML = items.length ? items.map((item,index) => `<article class="service-card"><div class="service-icon">${String(index+1).padStart(2,'0')}</div><span class="service-code">PW / CAPABILITY</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join('') : '<div class="empty-state">Los servicios se publicarán desde el panel administrativo.</div>';
}
function renderFilters() {
  $('#filters').innerHTML = `<button class="active" data-filter="all">Todas</button>${state.categories.map(item => `<button data-filter="${escapeHtml(item.slug)}">${escapeHtml(item.name)}</button>`).join('')}`;
  $('#filters').addEventListener('click', event => { const button = event.target.closest('button'); if (!button) return; document.querySelectorAll('#filters button').forEach(el => el.classList.remove('active')); button.classList.add('active'); renderApps(button.dataset.filter); });
}
function renderApps(filter = 'all') {
  const items = state.applications.filter(app => filter === 'all' || app.category?.slug === filter);
  $('#appsGrid').innerHTML = items.length ? items.map((app,index) => `<article class="app-card"><div class="app-cover">${app.coverImage ? `<img src="${escapeHtml(app.coverImage)}" alt="Portada de ${escapeHtml(app.name)}" loading="lazy">` : escapeHtml(app.name.slice(0,2).toUpperCase())}<span class="project-number">${String(index+1).padStart(2,'0')}</span></div><div class="app-body"><div class="app-top"><span class="tag">${escapeHtml(app.category?.name || 'Software')}</span><span class="status">${escapeHtml(app.status)}</span></div><h3>${escapeHtml(app.name)}</h3><p>${escapeHtml(app.shortDescription)}</p><div class="tech-list">${(app.technologies || []).slice(0,4).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div><div class="app-actions"><a class="button small" href="/apps/${encodeURIComponent(app.slug)}">Ver proyecto <b>↗</b></a>${app.demoUrl ? `<a class="button small ghost" href="${escapeHtml(app.demoUrl)}" target="_blank" rel="noopener">Demo real</a>` : ''}</div></div></article>`).join('') : '<div class="empty-state">No hay aplicaciones publicadas en esta categoría.</div>';
}
function renderTestimonials(items) {
  if (!items.length) return; $('#testimonials').hidden = false;
  $('#testimonialsGrid').innerHTML = items.map(item => `<article class="testimonial-card"><p>“${escapeHtml(item.comment)}”</p><b>${escapeHtml(item.name)}</b><small>${escapeHtml([item.role,item.company].filter(Boolean).join(' · '))}</small></article>`).join('');
}
async function loadSite() {
  try { const response = await fetch('/api/public/bootstrap'); const result = await response.json(); if (!response.ok) throw new Error(result.message); state = result.data; applyCms(state.settings); renderMetrics(state.settings?.metrics); renderServices(state.services); renderFilters(); renderApps(); renderTestimonials(state.testimonials); }
  catch { $('#servicesGrid').innerHTML = $('#appsGrid').innerHTML = '<div class="empty-state">No se pudo cargar el contenido. Verifica la conexión con MongoDB.</div>'; renderMetrics({}); }
}
$('#menuButton').addEventListener('click', () => { const nav = $('#mainNav'); nav.classList.toggle('open'); $('#menuButton').setAttribute('aria-expanded', nav.classList.contains('open')); });
document.querySelectorAll('#mainNav a').forEach(link => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));
$('#contactForm').addEventListener('submit', async event => {
  event.preventDefault(); const form = event.currentTarget; const status = $('#formStatus'); const button = form.querySelector('button[type=submit]'); status.className = 'form-status'; status.textContent = ''; button.disabled = true; button.textContent = 'Enviando…';
  try { const response = await fetch('/api/public/contact', { method:'POST', body:new FormData(form) }); const result = await response.json(); if (!response.ok) throw new Error(result.message); status.classList.add('success'); status.textContent = result.message; form.reset(); }
  catch (error) { status.classList.add('error'); status.textContent = error.message; } finally { button.disabled = false; button.textContent = 'Enviar solicitud'; }
});
$('#year').textContent = new Date().getFullYear(); loadSite();
