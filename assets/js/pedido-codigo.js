/* Codifica / decodifica el pedido dentro de un enlace (no hay servidor: el pedido viaja en el propio QR). */
window.LummaPedido = {
  codificar(cart, total) {
    const datos = { v: 1, t: total, i: cart.map((l) => [l.q, l.nombre, l.det, l.u]) };
    const bytes = new TextEncoder().encode(JSON.stringify(datos));
    let bin = '';
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  decodificar(codigo) {
    try {
      const b64 = codigo.replace(/-/g, '+').replace(/_/g, '/');
      const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      const d = JSON.parse(new TextDecoder().decode(bytes));
      if (!d || !Array.isArray(d.i)) return null;
      return {
        total: Number(d.t) || 0,
        items: d.i.map((x) => ({ q: Number(x[0]) || 0, nombre: String(x[1]), det: Array.isArray(x[2]) ? x[2].map(String) : [], u: Number(x[3]) || 0 })),
      };
    } catch (e) { return null; }
  },
  /* Saca el código de un enlace completo, del "#p=..." o del código a secas. */
  extraer(texto) {
    const m = String(texto).trim().match(/[#?&]p=([A-Za-z0-9_-]+)/);
    return m ? m[1] : String(texto).trim().replace(/^#/, '');
  },
};
