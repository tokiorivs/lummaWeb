/* Pantalla para el cajero: muestra el pedido que trae el QR del cliente. */
(function () {
  const $ = document.getElementById('pedido');
  const money = (n) => 'S/ ' + n.toFixed(2);
  /* Todo se escribe con textContent: el pedido viene de un enlace y nunca debe interpretarse como HTML. */
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };

  function entrada(mensaje) {
    $.replaceChildren();
    const caja = el('div', 'vacio');
    caja.append(el('h2', '', 'Recibir pedido'), el('p', '', mensaje));
    const f = el('form', 'recibir');
    const inp = el('input');
    inp.type = 'text';
    inp.placeholder = 'Escanea aquí el QR del cliente';
    inp.setAttribute('aria-label', 'Código del pedido');
    inp.autocomplete = 'off';
    const b = el('button', 'btn', 'Ver pedido');
    b.type = 'submit';
    f.append(inp, b);
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const cod = window.LummaPedido.extraer(inp.value);
      if (cod) location.hash = 'p=' + cod;
    });
    caja.append(f);
    $.append(caja);
    inp.focus();
  }

  function mostrar(p) {
    $.replaceChildren();
    const w = el('div', 'grande-modo');
    w.style.cssText = 'display:flex;flex-direction:column;gap:12px';
    const tot = el('div', 'total-fila total-arriba');
    tot.append(el('span', '', 'Total a pagar'), el('span', 'grande', money(p.total)));
    w.append(tot);
    p.items.forEach((l) => {
      const fila = el('div', 'linea');
      const izq = el('div');
      izq.append(el('div', 'nm', l.q + ' × ' + l.nombre));
      if (l.det.length) izq.append(el('div', 'suave', l.det.join(' · ')));
      fila.append(izq, el('div', 'precio-linea', money(l.u * l.q)));
      w.append(fila);
    });
    const otro = el('button', 'btn blanco bloque', 'Recibir otro pedido');
    otro.type = 'button';
    otro.addEventListener('click', () => { location.hash = ''; });
    w.append(otro);
    $.append(w);
    window.scrollTo({ top: 0 });
  }

  function cargar() {
    if (!location.hash || location.hash === '#') return entrada('Escanea el QR del cliente o pega su enlace.');
    const p = window.LummaPedido.decodificar(window.LummaPedido.extraer(location.hash));
    if (p && p.items.length) mostrar(p); else entrada('No se pudo leer ese pedido. Vuelve a escanear el QR.');
  }
  window.addEventListener('hashchange', cargar);
  cargar();
})();
