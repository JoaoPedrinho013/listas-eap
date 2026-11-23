/* ============================================================
   charts.js — gráficos em SVG puro, no formato dos slides do professor:
   coluna, setores (com graus), histograma, FAC (limite superior),
   linha, dispersão + linha de tendência, BOXPLOT (LS/LI tracejados),
   curva normal (área sombreada + z), IC (α/2) e curva do qui-quadrado (RA/RC)
   ============================================================ */
(function (global) {
  'use strict';
  var S = global.EAP.S, fmt = S.fmt;
  var uid = 0;

  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function lin(d0, d1, r0, r1) { return function (v) { return r0 + (v - d0) * (r1 - r0) / (d1 - d0); }; }
  function niceStep(range, count) {
    var raw = range / count, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    var m = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return m * p;
  }
  function niceScale(min, max, count, zero) {
    if (zero) min = Math.min(0, min);
    var step = niceStep(max - min || 1, count || 5);
    var lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, t = [];
    for (var v = lo; v <= hi + step / 1e6; v += step) t.push(Math.round(v / step) * step);
    return { min: lo, max: hi, ticks: t, step: step };
  }
  function decOf(step) { return step >= 1 ? 0 : Math.min(3, Math.ceil(-Math.log10(step))); }

  function wrap(title, w, h, inner, defs, cap) {
    return '<figure class="chart"><svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(title || 'gráfico') + '">' +
      (defs ? '<defs>' + defs + '</defs>' : '') +
      (title ? '<text class="ct" x="' + w / 2 + '" y="22" text-anchor="middle">' + esc(title) + '</text>' : '') +
      inner + '</svg>' + (cap ? '<figcaption>' + cap + '</figcaption>' : '') + '</figure>';
  }
  // eixos + grade horizontal
  function axes(o) {
    var s = '', i;
    o.yScale.ticks.forEach(function (t) {
      var y = o.y(t);
      s += '<line class="grid" x1="' + o.L + '" x2="' + o.R + '" y1="' + y + '" y2="' + y + '"/>';
      s += '<text class="tk" x="' + (o.L - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + fmt(t, decOf(o.yScale.step)) + '</text>';
    });
    s += '<line class="axis" x1="' + o.L + '" x2="' + o.L + '" y1="' + o.T + '" y2="' + o.B + '"/>';
    s += '<line class="axis" x1="' + o.L + '" x2="' + o.R + '" y1="' + o.B + '" y2="' + o.B + '"/>';
    if (o.yLabel) s += '<text class="al" transform="translate(16,' + (o.T + o.B) / 2 + ') rotate(-90)" text-anchor="middle">' + esc(o.yLabel) + '</text>';
    if (o.xLabel) s += '<text class="al" x="' + (o.L + o.R) / 2 + '" y="' + o.H + '" text-anchor="middle" dy="-4">' + esc(o.xLabel) + '</text>';
    return s;
  }

  /* ---------- coluna ---------- */
  function col(o) {
    var W = 640, H = 360, L = 62, R = 620, T = 40, B = 288;
    var ys = niceScale(0, Math.max.apply(null, o.vals) * 1.08, 5, true), y = lin(ys.min, ys.max, B, T);
    var n = o.cats.length, bw = (R - L) / n, s = axes({ yScale: ys, y: y, L: L, R: R, T: T, B: B, H: H, xLabel: o.xLabel, yLabel: o.yLabel });
    o.cats.forEach(function (c, i) {
      var x = L + i * bw + bw * 0.3, w = bw * 0.4, v = o.vals[i];
      s += '<rect class="bar" x="' + x + '" y="' + y(v) + '" width="' + w + '" height="' + (B - y(v)) + '"/>';
      s += '<text class="vl" x="' + (x + w / 2) + '" y="' + (y(v) - 6) + '" text-anchor="middle">' + fmt(v, o.dec || 0) + '</text>';
      s += '<text class="tk" x="' + (x + w / 2) + '" y="' + (B + 18) + '" text-anchor="middle">' + esc(c) + '</text>';
    });
    return wrap(o.title, W, H, s, '', o.cap);
  }

  /* ---------- histograma (barras coladas, rótulo "lo /----- hi") ---------- */
  function hist(o) {
    var W = 640, H = 380, L = 62, R = 620, T = 40, B = 290;
    var fs = o.rows.map(function (r) { return r.F; });
    var ys = niceScale(0, Math.max.apply(null, fs) * 1.1, 5, true), y = lin(ys.min, ys.max, B, T);
    var n = o.rows.length, bw = (R - L) / n, s = axes({ yScale: ys, y: y, L: L, R: R, T: T, B: B, H: H, xLabel: o.xLabel, yLabel: o.yLabel || 'F' });
    o.rows.forEach(function (r, i) {
      var x = L + i * bw;
      s += '<rect class="bar hbar" x="' + x + '" y="' + y(r.F) + '" width="' + bw + '" height="' + (B - y(r.F)) + '"/>';
      s += '<text class="vl" x="' + (x + bw / 2) + '" y="' + (y(r.F) - 5) + '" text-anchor="middle">' + r.F + '</text>';
      var lab = (o.label ? o.label(r) : S.classLabel(r, o.dec || 0));
      s += '<text class="tk" transform="translate(' + (x + bw / 2 + 4) + ',' + (B + 14) + ') rotate(-28)" text-anchor="end">' + esc(lab) + '</text>';
    });
    return wrap(o.title, W, H, s, '', o.cap);
  }

  /* ---------- linha: FAC (pontos no limite superior) / série temporal ---------- */
  function line(o) {
    var W = 640, H = 360, L = 62, R = 612, T = 40, B = 284, pts = o.points, i;
    var xs = pts.map(function (p) { return p.x; }), vs = pts.map(function (p) { return p.y; });
    var ysS = niceScale(o.yMin !== undefined ? o.yMin : 0, Math.max.apply(null, vs) * 1.08, 5, o.yMin === undefined), y = lin(ysS.min, ysS.max, B, T);
    var xS = o.xTicks ? { min: o.xTicks[0], max: o.xTicks[o.xTicks.length - 1], ticks: o.xTicks } : niceScale(Math.min.apply(null, xs), Math.max.apply(null, xs), 6, false);
    var pad = (xS.max - xS.min) * 0.04, x = lin(xS.min - pad, xS.max + pad, L, R);
    var s = axes({ yScale: ysS, y: y, L: L, R: R, T: T, B: B, H: H, xLabel: o.xLabel, yLabel: o.yLabel });
    xS.ticks.forEach(function (t) {
      s += '<line class="axis" x1="' + x(t) + '" x2="' + x(t) + '" y1="' + B + '" y2="' + (B + 5) + '"/>';
      s += '<text class="tk" x="' + x(t) + '" y="' + (B + 19) + '" text-anchor="middle">' + (o.xFmt ? o.xFmt(t) : fmt(t, decOf(xS.step || 1))) + '</text>';
    });
    var d = pts.map(function (p, k) { return (k ? 'L' : 'M') + x(p.x) + ',' + y(p.y); }).join(' ');
    s += '<path class="ln" d="' + d + '"/>';
    pts.forEach(function (p) {
      s += '<circle class="dot" cx="' + x(p.x) + '" cy="' + y(p.y) + '" r="4"/>';
      if (o.valueLabels) s += '<text class="vl" x="' + x(p.x) + '" y="' + (y(p.y) - 9) + '" text-anchor="middle">' + fmt(p.y, o.dec || 0) + '</text>';
    });
    if (o.note) s += o.note(x, y);
    return wrap(o.title, W, H, s, '', o.cap);
  }

  // duas séries na mesma figura (ex.: exportação x importação)
  function line2(o) {
    var W = 640, H = 380, L = 62, R = 612, T = 56, B = 300, i;
    var all = o.series[0].ys.concat(o.series[1].ys);
    var ysS = niceScale(Math.min.apply(null, all) * 0.95, Math.max.apply(null, all) * 1.03, 5, false), y = lin(ysS.min, ysS.max, B, T);
    var n = o.xs.length, x = lin(0, n - 1, L + 20, R - 10);
    var s = axes({ yScale: ysS, y: y, L: L, R: R, T: T, B: B, H: H, xLabel: o.xLabel, yLabel: o.yLabel });
    o.xs.forEach(function (v, k) { s += '<text class="tk" x="' + x(k) + '" y="' + (B + 18) + '" text-anchor="middle">' + v + '</text>'; });
    o.series.forEach(function (se, k) {
      var d = se.ys.map(function (v, j) { return (j ? 'L' : 'M') + x(j) + ',' + y(v); }).join(' ');
      s += '<path class="ln s' + k + '" d="' + d + '"/>';
      se.ys.forEach(function (v, j) { s += '<circle class="dot s' + k + '" cx="' + x(j) + '" cy="' + y(v) + '" r="3.6"/>'; });
      s += '<rect class="key s' + k + '" x="' + (L + 14 + k * 150) + '" y="34" width="12" height="12"/><text class="tk" x="' + (L + 32 + k * 150) + '" y="45">' + esc(se.name) + '</text>';
    });
    return wrap(o.title, W, H, s, '', o.cap);
  }

  /* ---------- setores (pizza) com graus ---------- */
  function pie(o) {
    var W = 640, H = 380, cx = 230, cy = 205, r = 130, tot = S.sum(o.items.map(function (i) { return i.value; }));
    var ang = -Math.PI / 2, s = '', leg = '';
    o.items.forEach(function (it, k) {
      var a = it.value / tot * 2 * Math.PI, a2 = ang + a, large = a > Math.PI ? 1 : 0;
      var x1 = cx + r * Math.cos(ang), y1 = cy + r * Math.sin(ang), x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      s += '<path class="pie p' + (k % 8) + '" d="M' + cx + ',' + cy + ' L' + x1 + ',' + y1 + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x2 + ',' + y2 + ' Z"/>';
      var mid = ang + a / 2, lx = cx + (r * 0.68) * Math.cos(mid), ly = cy + (r * 0.68) * Math.sin(mid);
      s += '<text class="pl" x="' + lx + '" y="' + ly + '" text-anchor="middle">' + fmt(it.value / tot * 100, 1) + '%</text>';
      s += '<text class="pl2" x="' + lx + '" y="' + (ly + 13) + '" text-anchor="middle">' + fmt(it.value / tot * 360, 1) + '°</text>';
      leg += '<rect class="key p' + (k % 8) + '" x="440" y="' + (70 + k * 26) + '" width="14" height="14"/><text class="tk" x="462" y="' + (82 + k * 26) + '">' + esc(it.label) + ' — ' + fmt(it.value, o.dec || 0) + '</text>';
      ang = a2;
    });
    return wrap(o.title, W, H, s + leg, '', o.cap);
  }

  /* ---------- dispersão + linha de tendência ---------- */
  function scatter(o) {
    var W = 640, H = 380, L = 66, R = 618, T = 40, B = 304;
    var inc = o.include || [], axs = o.xs.concat(inc.map(function (p) { return p.x; })), ays = o.ys.concat(inc.map(function (p) { return p.y; }));
    var xS = niceScale(Math.min.apply(null, axs) - 2, Math.max.apply(null, axs) + 2, 6, false);
    var yS = niceScale(Math.min.apply(null, ays) * 0.9, Math.max.apply(null, ays) * 1.05, 6, false);
    var x = lin(xS.min, xS.max, L, R), y = lin(yS.min, yS.max, B, T);
    var s = axes({ yScale: yS, y: y, L: L, R: R, T: T, B: B, H: H, xLabel: o.xLabel, yLabel: o.yLabel });
    xS.ticks.forEach(function (t) {
      s += '<line class="axis" x1="' + x(t) + '" x2="' + x(t) + '" y1="' + B + '" y2="' + (B + 5) + '"/><text class="tk" x="' + x(t) + '" y="' + (B + 19) + '" text-anchor="middle">' + fmt(t, decOf(xS.step)) + '</text>';
    });
    if (o.line) {
      var x0 = xS.min, x1 = xS.max;
      s += '<line class="trend" x1="' + x(x0) + '" y1="' + y(o.line.a + o.line.b * x0) + '" x2="' + x(x1) + '" y2="' + y(o.line.a + o.line.b * x1) + '"/>';
      s += '<text class="vl" x="' + (R - 4) + '" y="' + (y(o.line.a + o.line.b * x1) - 8) + '" text-anchor="end">Linha de tendência</text>';
    }
    o.xs.forEach(function (v, i) { s += '<circle class="dot" cx="' + x(v) + '" cy="' + y(o.ys[i]) + '" r="4.5"/>'; });
    if (o.extra) s += o.extra(x, y);
    return wrap(o.title, W, H, s, '', o.cap);
  }

  /* ---------- BOXPLOT (formato do slide: LS/LI tracejados) ---------- */
  function box(o) {
    var W = 640, H = 420, L = 70, R = 620, T = 44, B = 366, bx = o.boxes;
    var lo = Math.min.apply(null, bx.map(function (b) { return Math.min(b.s.li, b.s.min); }));
    var hi = Math.max.apply(null, bx.map(function (b) { return Math.max(b.s.ls, b.s.max); }));
    var yS = niceScale(lo - (hi - lo) * 0.03, hi + (hi - lo) * 0.03, 8, false), y = lin(yS.min, yS.max, B, T);
    var s = axes({ yScale: yS, y: y, L: L, R: R, T: T, B: B, H: H, yLabel: o.yLabel });
    var n = bx.length, slot = (R - L) / n, d = o.dec === undefined ? 2 : o.dec;
    bx.forEach(function (b, i) {
      var c = L + slot * (i + 0.5), w = Math.min(90, slot * 0.34), q = b.s, k = 'b' + (i % 3);
      var lx = c + w / 2 + 10;
      s += '<line class="fence k' + (i % 3) + '" x1="' + (c - w * 0.9) + '" x2="' + (c + w * 0.9) + '" y1="' + y(q.ls) + '" y2="' + y(q.ls) + '"/>';
      s += '<line class="fence k' + (i % 3) + '" x1="' + (c - w * 0.9) + '" x2="' + (c + w * 0.9) + '" y1="' + y(q.li) + '" y2="' + y(q.li) + '"/>';
      s += '<line class="whisk" x1="' + c + '" x2="' + c + '" y1="' + y(q.maxIn) + '" y2="' + y(q.q3) + '"/><line class="whisk" x1="' + c + '" x2="' + c + '" y1="' + y(q.q1) + '" y2="' + y(q.minIn) + '"/>';
      s += '<line class="whisk" x1="' + (c - w * 0.25) + '" x2="' + (c + w * 0.25) + '" y1="' + y(q.maxIn) + '" y2="' + y(q.maxIn) + '"/><line class="whisk" x1="' + (c - w * 0.25) + '" x2="' + (c + w * 0.25) + '" y1="' + y(q.minIn) + '" y2="' + y(q.minIn) + '"/>';
      s += '<rect class="bx ' + k + '" x="' + (c - w / 2) + '" y="' + y(q.q3) + '" width="' + w + '" height="' + (y(q.q1) - y(q.q3)) + '"/>';
      s += '<line class="med" x1="' + (c - w / 2) + '" x2="' + (c + w / 2) + '" y1="' + y(q.md) + '" y2="' + y(q.md) + '"/>';
      q.outliers.forEach(function (v) {
        s += '<circle class="out" cx="' + c + '" cy="' + y(v) + '" r="4"/><text class="vl" x="' + (c + 9) + '" y="' + (y(v) + 4) + '">' + fmt(v, d) + '</text>';
      });
      // rótulos dos valores
      var lab = [['LS', q.ls], ['Máx. ≤ LS', q.maxIn], ['Q3', q.q3], ['Md', q.md], ['Q1', q.q1], ['Mín. ≥ LI', q.minIn], ['LI', q.li]];
      var prev = -999;
      lab.forEach(function (t) {
        var yy = y(t[1]); if (yy - prev < 13) yy = prev + 13; prev = yy;
        s += '<text class="bl" x="' + lx + '" y="' + (yy + 3) + '">' + t[0] + ' = ' + fmt(t[1], d) + '</text>';
      });
      s += '<text class="al" x="' + c + '" y="' + (B + 22) + '" text-anchor="middle">' + esc(b.label) + '</text>';
    });
    return wrap(o.title, W, H, s, '', o.cap);
  }

  /* ---------- curva normal ---------- */
  // o.mu, o.sigma, o.fmt(x) → rótulo do eixo ; o.marks=[x...] ; o.shade=[{from,to}] ; o.notes=[{x,text}]
  function bell(o) {
    var W = 640, H = 320, L = 30, R = 610, T = 36, B = 226;
    var mu = o.mu, sg = o.sigma, xmin = mu - 4 * sg, xmax = mu + 4 * sg;
    var x = lin(xmin, xmax, L, R), ymax = S.pdfNorm(0) / sg, y = lin(0, ymax * 1.12, B, T);
    var id = 'bz' + (++uid), s = '', i, N = 160;
    function cur(a, b) {
      var p = [];
      for (i = 0; i <= N; i++) { var v = a + (b - a) * i / N; p.push([x(v), y(S.pdfNorm((v - mu) / sg) / sg)]); }
      return p;
    }
    (o.shade || []).forEach(function (sh) {
      var a = Math.max(sh.from === undefined || sh.from === null ? xmin : sh.from, xmin), b = Math.min(sh.to === undefined || sh.to === null ? xmax : sh.to, xmax);
      var p = cur(a, b), d = 'M' + x(a) + ',' + B + ' ' + p.map(function (q) { return 'L' + q[0] + ',' + q[1]; }).join(' ') + ' L' + x(b) + ',' + B + ' Z';
      s += '<path class="area ' + (sh.cls || '') + '" d="' + d + '"/>';
    });
    var pc = cur(xmin, xmax);
    s += '<path class="curve" d="' + pc.map(function (q, k) { return (k ? 'L' : 'M') + q[0] + ',' + q[1]; }).join(' ') + '"/>';
    s += '<line class="axis" x1="' + L + '" x2="' + R + '" y1="' + B + '" y2="' + B + '"/>';
    // média
    s += '<line class="mu" x1="' + x(mu) + '" x2="' + x(mu) + '" y1="' + y(ymax) + '" y2="' + B + '"/>';
    var marks = [{ v: mu, mu: true }].concat((o.marks || []).map(function (v) { return { v: v }; }));
    // rótulos próximos da média (ou entre si) ficam de lados opostos para não se sobrepor
    var near = marks.filter(function (m) { return !m.mu && Math.abs(x(m.v) - x(mu)) < 110; });
    marks.forEach(function (m) {
      var z = (m.v - mu) / sg, xx = x(m.v), anc = 'middle', dx = 0;
      if (near.length) {
        if (m.mu) { var left = near.some(function (q) { return q.v < mu; }); anc = left ? 'start' : 'end'; dx = left ? 6 : -6; }
        else { anc = m.v < mu ? 'end' : 'start'; dx = m.v < mu ? -6 : 6; }
      }
      if (!m.mu) s += '<line class="mk" x1="' + xx + '" x2="' + xx + '" y1="' + y(S.pdfNorm(z) / sg) + '" y2="' + (B + 4) + '"/>';
      s += '<text class="tk b" x="' + (xx + dx) + '" y="' + (B + 20) + '" text-anchor="' + anc + '">' + (m.mu ? 'μ = ' : '') + (o.fmt ? o.fmt(m.v) : fmt(m.v, 2)) + '</text>';
      s += '<text class="tk z" x="' + (xx + dx) + '" y="' + (B + 37) + '" text-anchor="' + anc + '">z = ' + fmt(z, 2) + '</text>';
    });
    // régua em σ
    for (var k = -3; k <= 3; k++) {
      var xx2 = x(mu + k * sg);
      s += '<line class="axis" x1="' + xx2 + '" x2="' + xx2 + '" y1="' + B + '" y2="' + (B + 5) + '"/>';
      s += '<text class="sg" x="' + xx2 + '" y="' + (B + 56) + '" text-anchor="middle">' + (k === 0 ? 'μ' : (k > 0 ? '+' : '−') + Math.abs(k) + 'σ') + '</text>';
    }
    (o.notes || []).forEach(function (n) {
      s += '<text class="note" x="' + x(n.x) + '" y="' + (n.y !== undefined ? n.y : T + 18) + '" text-anchor="' + (n.anchor || 'middle') + '">' + esc(n.text) + '</text>';
      if (n.arrowTo !== undefined) s += '<line class="lead" x1="' + x(n.x) + '" y1="' + ((n.y !== undefined ? n.y : T + 18) + 4) + '" x2="' + x(n.arrowTo) + '" y2="' + (B - 26) + '"/>';
    });
    return wrap(o.title, W, H, s, '', o.cap);
  }

  /* ---------- intervalo de confiança (sino com caudas α/2) ---------- */
  function ci(o) {
    var W = 640, H = 300, L = 30, R = 610, T = 30, B = 214;
    var z = o.z, xmin = -3.6, xmax = 3.6, x = lin(xmin, xmax, L, R), ymax = S.pdfNorm(0), y = lin(0, ymax * 1.12, B, T);
    var id = 'h' + (++uid), s = '', i, N = 160;
    function cur(a, b) { var p = []; for (i = 0; i <= N; i++) { var v = a + (b - a) * i / N; p.push([x(v), y(S.pdfNorm(v))]); } return p; }
    function area(a, b, cls) {
      var p = cur(a, b); return '<path class="' + cls + '" d="M' + x(a) + ',' + B + ' ' + p.map(function (q) { return 'L' + q[0] + ',' + q[1]; }).join(' ') + ' L' + x(b) + ',' + B + ' Z"/>';
    }
    s += area(-z, z, 'area mid') + area(xmin, -z, 'area tail') + area(z, xmax, 'area tail');
    s += '<path class="curve" d="' + cur(xmin, xmax).map(function (q, k) { return (k ? 'L' : 'M') + q[0] + ',' + q[1]; }).join(' ') + '"/>';
    s += '<line class="axis" x1="' + L + '" x2="' + R + '" y1="' + B + '" y2="' + B + '"/>';
    s += '<line class="mu" x1="' + x(0) + '" x2="' + x(0) + '" y1="' + y(ymax) + '" y2="' + B + '"/>';
    [-z, z].forEach(function (v) { s += '<line class="mk" x1="' + x(v) + '" x2="' + x(v) + '" y1="' + y(S.pdfNorm(v)) + '" y2="' + (B + 4) + '"/>'; });
    var alpha = (100 - o.conf) / 2;
    s += '<text class="note" x="' + x(0) + '" y="' + (y(ymax * 0.45)) + '" text-anchor="middle">1 − α</text><text class="note b" x="' + x(0) + '" y="' + (y(ymax * 0.45) + 18) + '" text-anchor="middle">' + fmt(o.conf, o.conf % 1 ? 1 : 0) + '%</text>';
    s += '<text class="note" x="' + x(-z - 1.1) + '" y="' + (B - 36) + '" text-anchor="middle">α/2</text><text class="note b" x="' + x(-z - 1.1) + '" y="' + (B - 20) + '" text-anchor="middle">' + fmt(alpha, alpha % 1 ? 1 : 0) + '%</text>';
    s += '<text class="note" x="' + x(z + 1.1) + '" y="' + (B - 36) + '" text-anchor="middle">α/2</text><text class="note b" x="' + x(z + 1.1) + '" y="' + (B - 20) + '" text-anchor="middle">' + fmt(alpha, alpha % 1 ? 1 : 0) + '%</text>';
    s += '<text class="tk b" x="' + x(-z) + '" y="' + (B + 20) + '" text-anchor="middle">Lᵢ = ' + o.lo + '</text>';
    s += '<text class="tk b" x="' + x(0) + '" y="' + (B + 20) + '" text-anchor="middle">' + o.center + '</text>';
    s += '<text class="tk b" x="' + x(z) + '" y="' + (B + 20) + '" text-anchor="middle">Lₛ = ' + o.hi + '</text>';
    s += '<text class="tk z" x="' + x(-z) + '" y="' + (B + 37) + '" text-anchor="middle">z = −' + fmt(z, 2) + '</text><text class="tk z" x="' + x(z) + '" y="' + (B + 37) + '" text-anchor="middle">z = +' + fmt(z, 2) + '</text>';
    return wrap(o.title, W, H, s, '', o.cap);
  }

  /* ---------- curva do qui-quadrado (RA / RC) ---------- */
  function lgamma(z) {
    var c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var x = z, y = z, t = x + 5.5; t -= (x + 0.5) * Math.log(t); var ser = 1.000000000190015;
    for (var j = 0; j < 6; j++) ser += c[j] / ++y;
    return -t + Math.log(2.5066282746310005 * ser / x);
  }
  function chiPdf(v, k) { return v <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(v) - v / 2 - (k / 2) * Math.log(2) - lgamma(k / 2)); }
  function chi(o) {
    var W = 640, H = 290, L = 30, R = 610, T = 34, B = 220;
    var kd = Math.max(o.gl, 3) + (o.gl < 3 ? 1 : 0), xmax = Math.max(o.crit, o.calc) * 1.55 + 2;
    var x = lin(0, xmax, L, R), N = 200, i, mx = 0, pts = [];
    for (i = 0; i <= N; i++) { var v = xmax * i / N, p = chiPdf(v, kd); pts.push([v, p]); if (p > mx) mx = p; }
    var y = lin(0, mx * 1.12, B, T), s = '';
    function ar(a, b, cls) {
      var q = pts.filter(function (p) { return p[0] >= a && p[0] <= b; });
      return '<path class="' + cls + '" d="M' + x(a) + ',' + B + ' L' + x(a) + ',' + y(chiPdf(a, kd)) + ' ' + q.map(function (p) { return 'L' + x(p[0]) + ',' + y(p[1]); }).join(' ') + ' L' + x(b) + ',' + y(chiPdf(b, kd)) + ' L' + x(b) + ',' + B + ' Z"/>';
    }
    s += ar(0.02, o.crit, 'area ra') + ar(o.crit, xmax, 'area rc');
    s += '<path class="curve" d="' + pts.map(function (p, k) { return (k ? 'L' : 'M') + x(p[0]) + ',' + y(p[1]); }).join(' ') + '"/>';
    s += '<line class="axis" x1="' + L + '" x2="' + R + '" y1="' + B + '" y2="' + B + '"/>';
    s += '<line class="crit" x1="' + x(o.crit) + '" x2="' + x(o.crit) + '" y1="' + (T + 6) + '" y2="' + B + '"/>';
    s += '<text class="note b" x="' + (x(o.crit) / 2 + L / 2) + '" y="' + (B - 40) + '" text-anchor="middle">RA</text>';
    s += '<text class="note b" x="' + (x(o.crit) + (R - x(o.crit)) * 0.4) + '" y="' + (B - 22) + '" text-anchor="middle">RC</text>';
    s += '<text class="tk b" x="' + x(o.crit) + '" y="' + (B + 20) + '" text-anchor="middle">χ² tabelado = ' + fmt(o.crit, 2) + '</text>';
    s += '<text class="tk" x="' + x(0) + '" y="' + (B + 20) + '" text-anchor="middle">0</text>';
    var cy = y(chiPdf(Math.max(o.calc, 0.15), kd)) ;
    s += '<line class="calc" x1="' + x(o.calc) + '" x2="' + x(o.calc) + '" y1="' + (T + 24) + '" y2="' + B + '"/><circle class="dot" cx="' + x(o.calc) + '" cy="' + (T + 24) + '" r="5"/>';
    s += '<text class="note b" x="' + x(o.calc) + '" y="' + (T + 14) + '" text-anchor="' + (o.calc > o.crit ? 'middle' : 'middle') + '">χ²(c) = ' + fmt(o.calc, 3) + '</text>';
    s += '<text class="sg" x="' + (R) + '" y="' + (T + 8) + '" text-anchor="end">curva esquemática, g.l. = ' + o.gl + '</text>';
    return wrap(o.title, W, H, s, '', o.cap);
  }

  global.EAP.C = { col: col, hist: hist, line: line, line2: line2, pie: pie, scatter: scatter, box: box, bell: bell, ci: ci, chi: chi, esc: esc };
})(window);
