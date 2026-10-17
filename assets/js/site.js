/* Encabezado, pie, enlaces y secciones comunes de la web de Lumma. */
(function () {
  const CFG = window.LUMMA_CONFIG, ART = window.LummaArt;
  const page = document.body.dataset.page;
  const nav = [['index.html', 'Inicio', 'inicio'], ['carta.html', 'Carta', 'carta'], ['links.html', 'Links', 'links']];

  const header = document.getElementById('encabezado');
  if (header) {
    header.innerHTML = `<div class="contenedor"><a class="logo" href="index.html"><img src="assets/images/lumma-logo.webp" alt="${CFG.nombre}"></a>
      <nav class="nav" aria-label="Principal">${nav.map(([href, t, id]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav></div>`;
  }
  const footer = document.getElementById('pie');
  if (footer) footer.innerHTML = `<div class="contenedor">© ${new Date().getFullYear()} ${CFG.nombre}</div>`;

  document.querySelectorAll('[data-enlace]').forEach((a) => { a.href = CFG.enlaces[a.dataset.enlace] || '#'; });

  const cats = document.getElementById('categorias-inicio');
  if (cats && window.LUMMA_MENU) {
    cats.innerHTML = window.LUMMA_MENU.map((c, n) => `<a class="tarjeta cat" href="carta.html#${c.id}">
      <div class="ilustra">${ART.svg(c.icono, c.c[0], c.c[1], 'k' + n)}</div><strong>${c.nombre}</strong><span>${c.nota}</span></a>`).join('');
  }

  const locales = document.getElementById('locales');
  if (locales) {
    locales.innerHTML = CFG.locales.map((l) => `<article class="tarjeta"><h3>${l.nombre}</h3>
      <p class="dato">${l.direccion}</p><p class="dato">${l.horario}</p><p class="dato">${l.telefono}</p>
      <a class="btn chico" href="${l.mapa}">Cómo llegar</a></article>`).join('');
  }
})();
