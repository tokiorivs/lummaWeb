/* Ilustraciones de productos (SVG inventado, mismo contorno azul noche del logo).
   Para usar fotos reales: poner la imagen en assets/images/productos/ y cambiar el campo "foto" del producto. */
(function () {
  const K = '#282F5C'; // contorno
  const o = `stroke="${K}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;

  function mix(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const m = (v) => Math.round(v + (255 - v) * amount);
    return `rgb(${m(r)},${m(g)},${m(b)})`;
  }

  function pearls(n) {
    const pts = [[46, 102], [58, 104], [70, 102], [52, 93], [64, 93], [76, 94]].slice(0, n);
    return pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.5" fill="#3B2A2A"/><circle cx="${x - 1.8}" cy="${y - 2}" r="1.4" fill="#fff" fill-opacity=".7"/>`).join('');
  }

  function cup(c1, c2, estilo, id) {
    const grad = estilo === 'galaxy' || estilo === 'sunset';
    const fill = grad ? `url(#g${id})` : c1;
    const body = 'M32 40H88L82 106Q81 111 76 111H44Q39 111 38 106Z';
    let s = `<defs><clipPath id="c${id}"><path d="${body}"/></clipPath>`;
    if (grad) s += `<linearGradient id="g${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
    s += '</defs>';
    s += `<g clip-path="url(#c${id})"><rect x="28" y="${estilo === 'milk' ? 54 : 46}" width="66" height="70" fill="${fill}"/>`;
    if (estilo === 'milk') s += '<rect x="28" y="40" width="66" height="16" fill="#FFF3E3"/>';
    if (estilo === 'frappe') s += '<rect x="28" y="40" width="66" height="12" fill="#FFF8F0"/>';
    if (estilo === 'soda' || estilo === 'refresher') {
      s += [[46, 90, 4], [62, 80, 3], [72, 96, 4.5], [54, 66, 3], [76, 70, 3.5], [44, 104, 3]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".75"/>`).join('');
    }
    if (estilo === 'slush') s += '<path d="M28 60Q40 52 50 62Q60 50 72 62Q82 54 94 62V80H28Z" fill="#fff" fill-opacity=".55"/>';
    s += '</g>';
    s += `<path d="${body}" fill="none" ${o}/>`;
    if (['milk', 'fruit', 'galaxy', 'sunset', 'frappe'].includes(estilo)) s += pearls(6);
    if (estilo === 'frappe') s += `<path d="M33 40Q36 14 60 14Q84 14 87 40Z" fill="#fff" ${o}/><path d="M44 26Q60 20 76 26" fill="none" stroke="#8A5A44" stroke-width="3" stroke-linecap="round"/>`;
    else if (estilo === 'slush') s += `<path d="M33 40Q35 24 47 28Q52 12 64 24Q77 16 81 31Q91 30 87 40Z" fill="#fff" ${o}/>`;
    else s += `<path d="M31 40Q60 6 89 40Z" fill="#fff" fill-opacity=".8" ${o}/>`;
    s += `<rect x="27" y="36" width="66" height="9" rx="4.5" fill="#fff" ${o}/>`;
    s += `<path d="M70 20L82 3" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M70 20L82 3" stroke="#F3403A" stroke-width="5" stroke-linecap="round"/>`;
    return s;
  }

  function bowl(seco, c1) {
    let s = '';
    if (seco) {
      s += `<path d="M24 62Q30 22 60 26Q90 22 96 62Z" fill="${c1}" ${o}/>`;
      s += '<path d="M34 56Q44 34 54 54M52 54Q62 30 72 54M70 54Q80 36 88 56" fill="none" stroke="#FFE08A" stroke-width="4" stroke-linecap="round"/>';
      s += '<circle cx="48" cy="38" r="3" fill="#7FBF5A"/><circle cx="66" cy="34" r="3" fill="#7FBF5A"/><circle cx="78" cy="44" r="3" fill="#7FBF5A"/>';
    } else {
      s += `<ellipse cx="60" cy="62" rx="46" ry="11" fill="${c1}" ${o}/>`;
      s += '<path d="M28 62Q36 46 44 62T60 62T76 62T92 62" fill="none" stroke="#FFE08A" stroke-width="4" stroke-linecap="round"/>';
      s += `<ellipse cx="48" cy="56" rx="9" ry="6" fill="#fff" ${o}/><circle cx="48" cy="56" r="3.5" fill="#FFC83D"/>`;
      s += `<rect x="68" y="46" width="12" height="16" rx="2" fill="#1F3B2D" ${o}/>`;
    }
    s += `<path d="M14 62H106Q106 110 60 110Q14 110 14 62Z" fill="#fff" ${o}/>`;
    s += '<path d="M20 78H100" stroke="#E9579F" stroke-width="5" stroke-linecap="round"/>';
    s += `<path d="M78 40L100 8M86 42L108 12" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>`;
    return s;
  }

  function face(x, y, sc) {
    return `<circle cx="${x - 5 * sc}" cy="${y}" r="${1.8 * sc}" fill="${K}"/><circle cx="${x + 5 * sc}" cy="${y}" r="${1.8 * sc}" fill="${K}"/><path d="M${x - 3 * sc} ${y + 3 * sc}Q${x} ${y + 6 * sc} ${x + 3 * sc} ${y + 3 * sc}" fill="none" stroke="${K}" stroke-width="2" stroke-linecap="round"/>`;
  }

  const draw = {
    mochi: (c1, c2) =>
      `<circle cx="60" cy="86" r="26" fill="${c1}" ${o}/>${face(60, 86, 1.1)}` +
      `<circle cx="60" cy="58" r="21" fill="#fff" ${o}/>${face(60, 58, 1)}` +
      `<circle cx="60" cy="36" r="16" fill="${c2}" ${o}/>${face(60, 36, 0.8)}`,
    onigiri: (c1, c2) =>
      `<path d="M60 14Q68 14 74 26L102 84Q108 102 90 104H30Q12 102 18 84L46 26Q52 14 60 14Z" fill="${c1}" ${o}/>` +
      `<path d="M36 80H84L92 104H28Z" fill="${c2}" ${o}/>${face(60, 52, 1.1)}`,
    dumpling: (c1, c2) =>
      `<path d="M12 86Q60 14 108 86Q60 102 12 86Z" fill="${c1}" ${o}/>` +
      '<path d="M32 70L38 88M46 58L50 90M60 54V92M74 58L70 90M88 70L82 88" fill="none" stroke="#282F5C" stroke-width="2.5" stroke-linecap="round"/>' +
      `<circle cx="60" cy="46" r="5" fill="${c2}"/>`,
    taiyaki: (c1, c2) =>
      `<path d="M92 62L112 40V84Z" fill="${c1}" ${o}/><ellipse cx="54" cy="62" rx="42" ry="28" fill="${c1}" ${o}/>` +
      `<circle cx="34" cy="54" r="4" fill="${K}"/><path d="M52 44Q58 62 52 80M66 46Q72 62 66 78M80 52Q84 62 80 72" fill="none" stroke="${c2}" stroke-width="3" stroke-linecap="round"/>`,
    bao: (c1, c2) =>
      `<path d="M14 90Q14 34 60 34Q106 34 106 90Q60 106 14 90Z" fill="${c1}" ${o}/>` +
      `<path d="M60 34Q52 48 60 56Q68 48 60 34" fill="${c2}" ${o}/><path d="M40 52Q48 66 56 60M80 52Q72 66 64 60" fill="none" stroke="${K}" stroke-width="2.5" stroke-linecap="round"/>`,
    pepero: (c1, c2) =>
      [[-18, 0], [0, 6], [18, 0]].map(([dx, dy]) =>
        `<g transform="translate(${60 + dx} ${60 + dy}) rotate(${dx / 2})"><rect x="-6" y="-46" width="12" height="92" rx="6" fill="#F4D9A0" ${o}/><rect x="-6" y="-46" width="12" height="54" rx="6" fill="${c1}" ${o}/><circle cx="0" cy="-22" r="2" fill="${c2}"/></g>`).join(''),
    ositos: (c1, c2) =>
      `<circle cx="36" cy="38" r="12" fill="${c1}" ${o}/><circle cx="84" cy="38" r="12" fill="${c1}" ${o}/><circle cx="60" cy="68" r="38" fill="${c1}" ${o}/>` +
      `<ellipse cx="60" cy="80" rx="14" ry="10" fill="#F4D9A0" ${o}/><circle cx="60" cy="76" r="3.5" fill="${c2}"/>${face(60, 62, 1.5)}`,
    chocopie: (c1, c2) =>
      `<ellipse cx="60" cy="64" rx="46" ry="34" fill="${c1}" ${o}/><path d="M16 64Q60 78 104 64" fill="none" stroke="${c2}" stroke-width="7" stroke-linecap="round"/>`,
    yakul: (c1, c2) =>
      `<rect x="40" y="36" width="40" height="70" rx="12" fill="${c1}" ${o}/><rect x="44" y="26" width="32" height="14" rx="6" fill="${c2}" ${o}/><rect x="46" y="58" width="28" height="22" rx="6" fill="${c2}" fill-opacity=".35"/>`,
    corndog: (c1, c2) =>
      `<g transform="rotate(-35 60 60)"><rect x="56" y="2" width="8" height="116" rx="4" fill="#E9C9A0" ${o}/><rect x="42" y="22" width="36" height="72" rx="18" fill="${c1}" ${o}/>` +
      `<path d="M44 40L56 46L44 52L56 58L44 64L56 70L44 76" fill="none" stroke="${c2}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g>`,
  };

  function inner(kind, c1, c2, id) {
    if (['milk', 'fruit', 'galaxy', 'sunset', 'slush', 'frappe', 'refresher', 'soda'].includes(kind)) return cup(c1, c2, kind, id);
    if (kind === 'sopa') return bowl(false, c1);
    if (kind === 'seco') return bowl(true, c1);
    if (kind === 'combo') {
      return `<g transform="translate(-14 4) scale(.8)">${cup(c1, c1, 'fruit', id)}</g><g transform="translate(56 40) scale(.55)">${draw.dumpling('#FFE9C8', c2)}</g>`;
    }
    return (draw[kind] || draw.mochi)(c1, c2);
  }

  window.LummaArt = {
    tint: (hex, amount) => mix(hex, amount === undefined ? 0.78 : amount),
    svg(kind, c1, c2, id) {
      return `<svg viewBox="0 0 120 120" role="img" aria-hidden="true" focusable="false">${inner(kind, c1, c2 || c1, id)}</svg>`;
    },
  };
})();
