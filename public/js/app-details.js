const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
async function load() {
  const slug = decodeURIComponent(location.pathname.split('/').filter(Boolean).pop());
  const root = document.querySelector('#appDetail');
  try {
    const response = await fetch(`/api/public/applications/${encodeURIComponent(slug)}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    const app = result.data;
    document.title = `${app.name} | PromptWorks`;
    document.querySelector('meta[name=description]').content = app.shortDescription;
    const gallery = app.gallery?.length ? `<h3>Galería</h3><div class="gallery">${app.gallery.map((src,i)=>`<img src="${escapeHtml(src)}" alt="${escapeHtml(app.name)} captura ${i+1}" loading="lazy">`).join('')}</div>` : '';
    const video = app.videoUrl ? `<h3>Video demostrativo</h3><a class="button ghost" href="${escapeHtml(app.videoUrl)}" target="_blank" rel="noopener">Abrir video</a>` : '';
    root.innerHTML = `<section class="detail-hero"><div><p class="eyebrow">${escapeHtml(app.category?.name)}</p><h1>${escapeHtml(app.name)}</h1><p class="lead">${escapeHtml(app.shortDescription)}</p><div class="actions"><a class="button" href="/#contacto">Solicitar una aplicación similar</a>${app.demoUrl ? `<a class="button ghost" href="${escapeHtml(app.demoUrl)}" target="_blank" rel="noopener">Ver demo</a>` : ''}</div></div><div class="detail-visual"><div class="app-cover">${app.coverImage ? `<img src="${escapeHtml(app.coverImage)}" alt="${escapeHtml(app.name)}">` : escapeHtml(app.name.slice(0,2).toUpperCase())}</div></div></section><section class="detail-content"><div><p class="eyebrow">El proyecto</p><h2>Software diseñado para resolver un problema real.</h2><p class="section-copy">${escapeHtml(app.description)}</p>${app.problem ? `<h3>Problema que resuelve</h3><p class="section-copy">${escapeHtml(app.problem)}</p>` : ''}${app.features?.length ? `<h3>Funciones principales</h3><ul class="feature-list">${app.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>` : ''}${gallery}${video}</div><aside class="detail-panel"><p><small>Estado</small><br><b>${escapeHtml(app.status)}</b></p><p><small>Plataforma</small><br><b>${escapeHtml(app.platform)}</b></p><p><small>Categoría</small><br><b>${escapeHtml(app.category?.name)}</b></p><div class="tech-list">${(app.technologies||[]).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div></aside></section>`;
  } catch(error) {
    root.innerHTML = `<div class="empty-state"><h2>No encontramos este proyecto</h2><p>${escapeHtml(error.message)}</p><a class="button" href="/#aplicaciones">Volver al portafolio</a></div>`;
  }
}
load();
