/* Carta interactiva de Lumma. Todo ocurre en el celular del cliente: no se envía ningún pedido. */
(function () {
  const MENU = window.LUMMA_MENU, CFG = window.LUMMA_CONFIG, ART = window.LummaArt;
  const $app = document.getElementById('app');
  const KEY = 'lumma_carta_v1';

  const money = (n) => 'S/ ' + n.toFixed(2);
  function load() { try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S.cart)); } catch (e) { /* sin almacenamiento */ } }

  const esGrande = () => window.matchMedia('(min-width: 900px)').matches;
  const S = { view: 'menu', cat: MENU[0].id, cart: load(), cur: null, upShown: false, big: false };
  const hash = location.hash.replace('#', '');
  const enlaceDirecto = MENU.some((c) => c.id === hash);
  if (enlaceDirecto) S.cat = hash;
  if (!enlaceDirecto && !esGrande()) S.view = 'cats';

  const items = MENU.flatMap((c) => c.items.map((i) => ({ ...i, cat: c.id })));
  const find = (id) => items.find((i) => i.id === id);
  const nom = (i) => i.completo || i.nombre;
  const total = () => S.cart.reduce((a, l) => a + l.u * l.q, 0);
  const count = () => S.cart.reduce((a, l) => a + l.q, 0);
  const qtyOf = (id) => S.cart.filter((l) => l.id === id).reduce((a, l) => a + l.q, 0);

  function addLine(line) {
    const ex = S.cart.find((l) => l.key === line.key);
    if (ex) ex.q += line.q; else S.cart.push(line);
    save();
  }

  function unit() {
    const c = S.cur, i = c.item;
    let p = i.variantes ? i.variantes[c.vari].p : i.precio;
    if (i.tipo === 'bebida' && c.size) p += CFG.extra_grande;
    c.extras.forEach((n) => { p += CFG.extras_ramen.find((e) => e.n === n).p; });
    return p;
  }
  function detail() {
    const c = S.cur, i = c.item, d = [];
    if (i.variantes) d.push(i.variantes[c.vari].n);
    if (i.sabores) d.push(i.sabores[c.sab]);
    if (i.tipo === 'bebida') { d.push(c.size ? 'Grande' : 'Regular'); d.push('Topping: ' + CFG.topping_gratis[c.top].toLowerCase()); }
    if (i.tipo === 'ramen') { d.push(CFG.picantes[c.pic]); c.extras.forEach((n) => d.push('+ ' + n.toLowerCase())); }
    if (i.tipo === 'combo') d.unshift('Fruit Tea de ' + i.sabores[c.sab].toLowerCase());
    return d;
  }

  function go(view) { S.view = view; render(); window.scrollTo({ top: Math.max($app.offsetTop - 70, 0), behavior: 'auto' }); }

  function openItem(id) {
    const i = find(id);
    if (i.tipo === 'simple' && !i.variantes && !i.sabores) { addLine({ key: i.id, id: i.id, nombre: nom(i), det: [], u: i.precio, q: 1 }); render(); return; }
    S.cur = { item: i, q: 1, size: 0, top: 0, pic: 1, extras: [], vari: 0, sab: 0 };
    go('sheet');
  }
  function addCur() {
    const c = S.cur, d = detail();
    addLine({ key: c.item.id + '|' + d.join('|'), id: c.item.id, nombre: nom(c.item), det: d, u: unit(), q: c.q });
    go('menu');
  }
  function addSuggested(id) {
    const i = find(id), d = [];
    let u = i.precio;
    if (i.variantes) { d.push(i.variantes[0].n); u = i.variantes[0].p; }
    if (i.sabores) d.push(i.sabores[0]);
    addLine({ key: i.id + '|' + d.join('|'), id: i.id, nombre: nom(i), det: d, u, q: 1 });
    go('cart');
  }
  function checkout() {
    const hasMain = S.cart.some((l) => { const i = find(l.id); return i && (i.tipo === 'bebida' || i.tipo === 'ramen'); });
    const hasSnack = S.cart.some((l) => { const i = find(l.id); return i && i.cat === 'dim-sum'; });
    if (!S.upShown && hasMain && !hasSnack) { S.upShown = true; go('up'); } else go('cart');
  }

  /* ---------- vistas ---------- */
  const pasos = ['Elegir', 'Personalizar', 'Sugerencia', 'En caja'];
  const stepIndex = { cats: 0, menu: 0, sheet: 1, up: 2, cart: 3 };

  function card(i, n) {
    const q = qtyOf(i.id), simple = i.tipo === 'simple' && !i.variantes && !i.sabores;
    return `<button class="prod" data-a="item" data-v="${i.id}">
      ${q ? `<span class="insignia">${q}</span>` : ''}
      <span class="foto" style="background:${ART.tint(i.c[0], 0.8)}">${ART.svg(i.arte, i.c[0], i.c[1], 'p' + n)}</span>
      <span class="info"><span class="nombre">${i.nombre}</span>
      <span class="precio-fila"><span class="precio">${money(i.precio)}</span><span class="accion">${simple ? 'Agregar' : 'Elegir'}</span></span></span>
    </button>`;
  }

  function barraPedido() {
    if (!S.cart.length) return '';
    return `<div class="barra"><div><div class="suave">${count()} producto${count() > 1 ? 's' : ''} en tu pedido</div><div class="total">${money(total())}</div></div><button class="btn" data-a="checkout">Ver pedido</button></div>`;
  }

  function viewCats() {
    const enPedido = (id) => S.cart.reduce((a, l) => { const i = find(l.id); return a + (i && i.cat === id ? l.q : 0); }, 0);
    return `<h2 class="titulo-cats">Toca una categoría</h2><div class="rejilla-cats">${MENU.map((c, n) => {
      const q = enPedido(c.id);
      return `<button class="tarjeta cat" data-a="cat" data-v="${c.id}">${q ? `<span class="insignia">${q}</span>` : ''}<div class="ilustra">${ART.svg(c.icono, c.c[0], c.c[1], 'k' + n)}</div><strong>${c.nombre}</strong><span class="nota-cat solo-lectores">${c.nota}</span></button>`;
    }).join('')}</div>${barraPedido()}`;
  }

  function viewMenu() {
    const cat = MENU.find((c) => c.id === S.cat);
    const rail = MENU.map((c) => `<button class="chip${c.id === S.cat ? ' on' : ''}" data-a="cat" data-v="${c.id}">${c.nombre}<span class="nota">${c.nota}</span></button>`).join('');
    let h = `<div class="fila barra-volver solo-movil"><button class="volver" data-a="cats">← Categorías</button><strong>${cat.nombre}</strong><span></span></div>
      <div class="layout"><div class="rail-wrap"><p class="pista-cat">Toca una categoría</p><div class="rail" role="tablist" aria-label="Categorías">${rail}</div></div>
      <div><div class="rejilla-prod">${cat.items.map((i, n) => card(i, n)).join('')}</div></div></div>`;
    return h + barraPedido();
  }

  function group(etq, inner) { return `<div class="grupo"><span class="etq">${etq}</span>${inner}</div>`; }
  function opts(list, sel, action, fmt) {
    return `<div class="opciones">${list.map((x, n) => `<button class="opcion" aria-pressed="${sel(n)}" data-a="${action}" data-v="${n}">${fmt ? fmt(x, n) : x}</button>`).join('')}</div>`;
  }

  function viewSheet() {
    const c = S.cur, i = c.item;
    let h = `<div class="fila barra-volver"><button class="volver" data-a="back">← Volver</button><strong>${nom(i)}</strong><span></span></div>
      <div class="detalle-foto" style="background:${ART.tint(i.c[0], 0.8)}">${ART.svg(i.arte, i.c[0], i.c[1], 'd')}</div>`;
    if (i.desc) h += `<p class="suave" style="margin:0">${i.desc}</p>`;
    if (i.variantes) h += group('Elige una opción', opts(i.variantes, (n) => c.vari === n, 'vari', (v) => v.n + (v.p !== i.variantes[0].p ? ' · ' + money(v.p) : '')));
    if (i.sabores) h += group(i.tipo === 'combo' ? 'Sabor del Fruit Tea' : 'Sabor', opts(i.sabores, (n) => c.sab === n, 'sab'));
    if (i.tipo === 'bebida') {
      h += group('Tamaño', opts(['Regular', 'Grande + ' + money(CFG.extra_grande)], (n) => c.size === n, 'size'));
      h += group('Topping gratis', opts(CFG.topping_gratis, (n) => c.top === n, 'top'));
    }
    if (i.tipo === 'ramen') {
      h += group('Nivel de picante', opts(CFG.picantes, (n) => c.pic === n, 'pic'));
      h += group('Toppings extra', opts(CFG.extras_ramen, (n) => c.extras.includes(CFG.extras_ramen[n].n), 'extra', (e) => e.n + ' + ' + money(e.p)));
    }
    h += `<div class="cantidad"><span class="etq-cant">Cantidad</span><div class="ctl"><button data-a="menos" aria-label="Menos">−</button><span class="num" aria-live="polite">${c.q}</span><button data-a="mas" aria-label="Más">+</button></div></div>`;
    h += `<div class="barra"><div><div class="suave">Total</div><div class="total">${money(unit() * c.q)}</div></div><button class="btn" data-a="addcur">Agregar al pedido</button></div>`;
    return h;
  }

  function viewUp() {
    const list = CFG.sugerencias.map(find).filter(Boolean);
    return `<div style="text-align:center"><h2 style="margin-bottom:.2rem">¿Algo para acompañar?</h2><p class="suave">Suma un snack a tu pedido.</p></div>
      <div class="rejilla-prod" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">${list.map((i) => `<button class="prod" data-a="sug" data-v="${i.id}">
        <span class="foto" style="background:${ART.tint(i.c[0], 0.8)}">${ART.svg(i.arte, i.c[0], i.c[1], 's' + i.id)}</span>
        <span class="info"><span class="nombre">${i.nombre}</span><span class="precio-fila"><span class="precio">${money(i.precio)}</span><span class="accion">+ Agregar</span></span></span></button>`).join('')}</div>
      <div class="barra" style="background:none;padding:0"><button class="btn blanco bloque" data-a="nogracias">No, gracias</button></div>`;
  }

  function viewCart() {
    if (!S.cart.length) return `<div class="vacio"><h2>Tu pedido está vacío</h2><p>Elige algo de la carta para ver tu total.</p><button class="btn" data-a="seguir">Ir a la carta</button></div>`;
    let h = `<div class="${S.big ? 'grande-modo' : ''}" style="display:flex;flex-direction:column;gap:12px">
      <div class="fila barra-volver"><button class="volver" data-a="back">← Volver</button><strong>Muestra esto en caja</strong><span></span></div>
      <div class="total-fila total-arriba"><span>Total a pagar</span><span class="grande">${money(total())}</span></div>`;
    S.cart.forEach((l, n) => {
      h += `<div class="linea"><div><div class="nm">${l.q} × ${l.nombre}</div>${l.det.length ? `<div class="suave">${l.det.join(' · ')}</div>` : ''}<div class="ctrl"><button class="paso" data-a="lmenos" data-v="${n}" aria-label="Quitar uno de ${l.nombre}">−</button><button class="paso mas" data-a="lmas" data-v="${n}" aria-label="Sumar uno de ${l.nombre}">+</button><button class="quitar" data-a="rm" data-v="${n}">Quitar</button></div></div><div class="precio-linea">${money(l.u * l.q)}</div></div>`;
    });
    h += `<div class="nota-caja">Este resumen no se envía a nadie. Díctalo o muéstralo en caja, donde se confirma y se cobra tu pedido.</div>
      <div class="acciones-col"><button class="btn rosa bloque" data-a="big">${S.big ? 'Letra normal' : 'Letra grande para mostrar'}</button>
      <div class="acciones-fila"><button class="btn blanco" data-a="seguir">Seguir agregando</button><button class="btn blanco" data-a="reset">Vaciar pedido</button></div></div></div>`;
    return h;
  }

  /* ---------- barra de categorías: posición, degradado y pista de deslizar ---------- */
  let pistaMostrada = false;
  try { pistaMostrada = sessionStorage.getItem('lumma_pista_cat') === '1'; } catch (e) { /* sin almacenamiento */ }

  function nudge(rail) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (getComputedStyle(rail).flexDirection === 'column') return;
    const max = rail.scrollWidth - rail.clientWidth;
    if (max < 12 || rail.scrollLeft > 0) return;
    const dist = Math.min(90, max), D = 500;
    let parar = false;
    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((ev) => rail.addEventListener(ev, () => { parar = true; }, { once: true, passive: true }));
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    setTimeout(() => {
      const t0 = performance.now();
      const paso = (ahora) => {
        if (parar || !rail.isConnected) return;
        const k = Math.min((ahora - t0) / (2 * D), 1);
        rail.scrollLeft = dist * (k < 0.5 ? ease(k * 2) : 1 - ease((k - 0.5) * 2));
        if (k < 1) requestAnimationFrame(paso); else rail.scrollLeft = 0;
      };
      requestAnimationFrame(paso);
    }, 800);
  }

  function prepararBarra(izq) {
    const rail = $app.querySelector('.rail');
    if (!rail) return;
    const wrap = rail.parentElement;
    rail.scrollLeft = izq;
    const act = rail.querySelector('.chip.on');
    if (act && getComputedStyle(rail).flexDirection !== 'column') {
      const l = act.offsetLeft, r = l + act.offsetWidth;
      if (l < rail.scrollLeft + 8) rail.scrollLeft = Math.max(l - 12, 0);
      else if (r > rail.scrollLeft + rail.clientWidth - 8) rail.scrollLeft = r - rail.clientWidth + 12;
    }
    const actualizar = () => wrap.classList.toggle('fin', rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
    actualizar();
    rail.addEventListener('scroll', actualizar, { passive: true });
    if (!pistaMostrada) {
      pistaMostrada = true;
      try { sessionStorage.setItem('lumma_pista_cat', '1'); } catch (e) { /* sin almacenamiento */ }
      nudge(rail);
    }
  }

  function render() {
    if (S.view === 'cats' && esGrande()) S.view = 'menu';
    const views = { cats: viewCats, menu: viewMenu, sheet: viewSheet, up: viewUp, cart: viewCart };
    const ix = stepIndex[S.view];
    const previa = $app.querySelector('.rail');
    const izq = previa ? previa.scrollLeft : 0;
    $app.innerHTML = `<div class="pasos" aria-label="Pasos">${pasos.map((p, n) => `<span class="${n === ix ? 'on' : ''}"${n === ix ? ' aria-current="step"' : ''}>${p}</span>`).join('')}</div>${views[S.view]()}`;
    prepararBarra(izq);
  }

  /* ---------- eventos ---------- */
  $app.addEventListener('click', (e) => {
    const t = e.target.closest('[data-a]');
    if (!t) return;
    const a = t.dataset.a, v = t.dataset.v, c = S.cur;
    switch (a) {
      case 'cat': S.cat = v; if (S.view === 'cats') go('menu'); else render(); break;
      case 'cats': go('cats'); break;
      case 'seguir': go(esGrande() ? 'menu' : 'cats'); break;
      case 'item': openItem(v); break;
      case 'back': go('menu'); break;
      case 'size': c.size = +v; render(); break;
      case 'top': c.top = +v; render(); break;
      case 'pic': c.pic = +v; render(); break;
      case 'vari': c.vari = +v; render(); break;
      case 'sab': c.sab = +v; render(); break;
      case 'extra': { const n = CFG.extras_ramen[+v].n; const k = c.extras.indexOf(n); if (k >= 0) c.extras.splice(k, 1); else c.extras.push(n); render(); break; }
      case 'mas': c.q += 1; render(); break;
      case 'menos': c.q = Math.max(1, c.q - 1); render(); break;
      case 'addcur': addCur(); break;
      case 'checkout': checkout(); break;
      case 'sug': addSuggested(v); break;
      case 'nogracias': go('cart'); break;
      case 'rm': S.cart.splice(+v, 1); save(); if (!S.cart.length) S.view = 'menu'; render(); break;
      case 'lmas': S.cart[+v].q += 1; save(); render(); break;
      case 'lmenos': { const l = S.cart[+v]; l.q -= 1; if (l.q <= 0) S.cart.splice(+v, 1); save(); if (!S.cart.length) S.view = 'menu'; render(); break; }
      case 'big': S.big = !S.big; render(); break;
      case 'reset': S.cart = []; save(); S.upShown = false; S.big = false; go('menu'); break;
    }
  });

  window.matchMedia('(min-width: 900px)').addEventListener('change', () => { if (esGrande() && S.view === 'cats') S.view = 'menu'; render(); });
  render();
})();
