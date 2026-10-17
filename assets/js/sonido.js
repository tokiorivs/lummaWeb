/* Sonidos de burbuja generados con Web Audio (sin archivos). window.LummaSound.play('tick'|'pop'|'chime') */
(function () {
  const KEY = 'lumma_sonido_off';
  let ctx = null;
  let off = false;
  try { off = localStorage.getItem(KEY) === '1'; } catch (e) { /* sin almacenamiento */ }

  function audio() {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    if (!ctx) ctx = new C();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  /* Una burbuja: tono senoidal que sube rápido de frecuencia y se apaga, con variación al azar. */
  function burbuja(c, t, base, dur, vol) {
    const f = base * (0.9 + Math.random() * 0.2);
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * 2.6, t + dur * 0.7);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function play(nombre) {
    if (off) return;
    try {
      const c = audio();
      if (!c) return;
      const t = c.currentTime;
      if (nombre === 'tick') burbuja(c, t, 520, 0.08, 0.4);
      else if (nombre === 'pop') { burbuja(c, t, 300, 0.16, 0.56); burbuja(c, t + 0.09, 520, 0.1, 0.32); }
      else if (nombre === 'chime') { burbuja(c, t, 320, 0.14, 0.48); burbuja(c, t + 0.1, 420, 0.14, 0.48); burbuja(c, t + 0.2, 560, 0.2, 0.48); }
    } catch (e) { /* el sonido nunca debe romper la página */ }
  }
  function setOff(v) { off = v; try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* ignorar */ } }

  window.LummaSound = { play, isOff: () => off, setOff };
})();
