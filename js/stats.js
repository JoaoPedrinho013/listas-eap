/* ============================================================
   stats.js — biblioteca estatística no "jeito do professor"
   (Prof. Carlos Cesar Cavalcante Dias — Estatística Aplicada)
   Tudo é calculado a partir dos dados; nada é "digitado na mão".
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- formatação pt-BR ---------- */
  function fmt(n, d) {
    if (d === undefined) d = 2;
    if (n === null || n === undefined || isNaN(n)) return '—';
    var s = Number(n).toFixed(d);
    var neg = s[0] === '-';
    if (neg) s = s.slice(1);
    var parts = s.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (neg ? '−' : '') + parts.join(',');
  }
  // inteiro com separador de milhar
  function fmtInt(n) { return fmt(n, 0); }
  // versão TeX (vírgula decimal protegida)
  function tex(n, d) {
    var s = fmt(n, d === undefined ? 2 : d).replace('−', '-');
    var i = s.lastIndexOf(',');
    var ip = i >= 0 ? s.slice(0, i) : s, dp = i >= 0 ? '{,}' + s.slice(i + 1) : '';
    return ip.replace(/\./g, '\\,') + dp;
  }

  /* ---------- básicas ---------- */
  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
  function mean(a) { return sum(a) / a.length; }
  function sorted(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function median(a) {
    var s = sorted(a), n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  function modes(a) {
    var c = {}, m = 0, k;
    a.forEach(function (v) { c[v] = (c[v] || 0) + 1; if (c[v] > m) m = c[v]; });
    var r = [];
    for (k in c) if (c[k] === m) r.push(Number(k));
    return { values: r, freq: m };
  }
  function varPop(a) { var m = mean(a); return sum(a.map(function (x) { return (x - m) * (x - m); })) / a.length; }
  function varSamp(a) { var m = mean(a); return sum(a.map(function (x) { return (x - m) * (x - m); })) / (a.length - 1); }
  function sdPop(a) { return Math.sqrt(varPop(a)); }
  function sdSamp(a) { return Math.sqrt(varSamp(a)); }

  /* ---------- quartis do professor ----------
     posição = n·p ; se fracionária → arredonda p/ cima ;
     se inteira → média entre o elemento k e o k+1.
     (reproduz os slides 53-55: Q1=13, Q3=18 / Q1=15, Q3=17)      */
  function quartilProf(rol, p) {
    var n = rol.length, pos = n * p;
    if (Math.abs(pos - Math.round(pos)) < 1e-9) {
      var k = Math.round(pos);
      return { value: (rol[k - 1] + rol[k]) / 2, pos: k, mode: 'media', txt: 'média do ' + k + 'º e do ' + (k + 1) + 'º' };
    }
    var c = Math.ceil(pos);
    return { value: rol[c - 1], pos: c, mode: 'ceil', txt: c + 'º elemento' };
  }
  function boxplot(data) {
    var rol = sorted(data), n = rol.length;
    var md = median(rol);
    var q1 = quartilProf(rol, 0.25), q3 = quartilProf(rol, 0.75);
    var aiq = q3.value - q1.value;
    var ls = q3.value + 1.5 * aiq, li = q1.value - 1.5 * aiq;
    var dentro = rol.filter(function (x) { return x >= li && x <= ls; });
    return {
      rol: rol, n: n, md: md, q1: q1.value, q3: q3.value, q1info: q1, q3info: q3,
      aiq: aiq, ls: ls, li: li,
      maxIn: Math.max.apply(null, dentro), minIn: Math.min.apply(null, dentro),
      outliers: rol.filter(function (x) { return x < li || x > ls; }),
      mean: mean(rol), min: rol[0], max: rol[n - 1]
    };
  }

  /* ---------- distribuição de frequência ---------- */
  function freqDiscrete(data, order) {
    var c = {};
    data.forEach(function (v) { c[v] = (c[v] || 0) + 1; });
    var keys = order || Object.keys(c).map(Number).sort(function (a, b) { return a - b; });
    var n = data.length, fac = 0;
    return keys.map(function (k) {
      var f = c[k] || 0; fac += f;
      return { x: k, F: f, Fp: f / n * 100, FAC: fac };
    });
  }
  // classes: K = √n (arredondado), AT = max − min, h = AT / K (arredonda p/ cima)
  function classes(data, opt) {
    opt = opt || {};
    var n = data.length, mn = Math.min.apply(null, data), mx = Math.max.apply(null, data);
    var AT = mx - mn;
    var Kraw = Math.sqrt(n);
    var K = opt.K || Math.round(Kraw);
    var hraw = AT / K;
    var h = opt.h || Math.ceil(hraw);
    var rows = [], fac = 0;
    for (var i = 0; i < K; i++) {
      var lo = mn + i * h, hi = lo + h;
      var last = i === K - 1;
      var F = data.filter(function (x) { return x >= lo && (last ? x <= hi : x < hi); }).length;
      fac += F;
      rows.push({ lo: lo, hi: hi, F: F, Fp: F / n * 100, FAC: fac, pm: (lo + hi) / 2, last: last });
    }
    return { n: n, min: mn, max: mx, AT: AT, Kraw: Kraw, K: K, hraw: hraw, h: h, rows: rows };
  }
  function classLabel(r, dec) {
    dec = dec || 0;
    return fmt(r.lo, dec) + (r.last ? ' /-----/ ' : ' /----- ') + fmt(r.hi, dec);
  }
  // média / desvio / mediana para dados agrupados (usa linhas com F e pm)
  function groupedStats(rows) {
    var n = sum(rows.map(function (r) { return r.F; }));
    var sxf = sum(rows.map(function (r) { return r.pm * r.F; }));
    var mu = sxf / n;
    var sq = sum(rows.map(function (r) { return r.F * Math.pow(r.pm - mu, 2); }));
    return { n: n, sxf: sxf, mu: mu, sq: sq, sdPop: Math.sqrt(sq / n), sdSamp: Math.sqrt(sq / (n - 1)) };
  }
  function groupedMedian(rows) {
    var n = sum(rows.map(function (r) { return r.F; })), half = n / 2, fac = 0;
    for (var i = 0; i < rows.length; i++) {
      var prev = fac; fac += rows[i].F;
      if (fac >= half) {
        var h = rows[i].hi - rows[i].lo;
        return { value: rows[i].lo + ((half - prev) * h) / rows[i].F, cls: i, L: rows[i].lo, half: half, facAnt: prev, h: h, F: rows[i].F };
      }
    }
  }

  /* ---------- Normal / Tabela Z do professor ----------
     Tabela A6.2: P(0 ≤ Z ≤ z0), z com 2 casas, área com 4 casas.   */
  function erf(x) {
    var s = x < 0 ? -1 : 1; x = Math.abs(x);
    if (x > 6) return s;
    // série de termos positivos (estável): erf(x)=2/√π·e^(−x²)·Σ 2ⁿx^(2n+1)/(2n+1)!!
    var term = x, total = x, n = 0;
    while (term > 1e-17 * total && n < 400) { n++; term *= 2 * x * x / (2 * n + 1); total += term; }
    return s * 2 / Math.sqrt(Math.PI) * Math.exp(-x * x) * total;
  }
  function phi(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }           // acumulada exata
  function zTable(z) { return Math.round(0.5 * erf(Math.abs(Math.round(z * 100) / 100) / Math.SQRT2) * 10000) / 10000; }
  function zRound(z) { return Math.round(z * 100) / 100; }
  function pdfNorm(x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); }
  // Z para nível de confiança (mesmos valores usados nas listas do professor)
  var Z_CONF = { 90: 1.65, 95: 1.96, 96: 2.05, 97: 2.17, 97.5: 2.24, 98: 2.33, 99: 2.58 };

  /* ---------- Qui-quadrado ---------- */
  // Tabela do professor (g.l. 1-8) para 20%,10%,5%,2%,1%,0,1%
  var QUI_TAB = {
    1: [1.64, 2.71, 3.84, 5.41, 6.64, 10.83], 2: [3.22, 4.60, 5.99, 7.82, 9.21, 13.82],
    3: [4.64, 6.25, 7.82, 9.84, 11.34, 16.27], 4: [5.99, 7.78, 9.49, 11.67, 13.28, 18.46],
    5: [7.29, 9.24, 11.07, 13.39, 15.09, 20.52], 6: [8.56, 10.64, 12.59, 15.03, 16.81, 22.46],
    7: [9.80, 12.02, 14.07, 16.62, 18.48, 24.32], 8: [11.03, 13.36, 15.51, 18.17, 20.09, 26.12]
  };
  var QUI_COL = { 20: 0, 10: 1, 5: 2, 2: 3, 1: 4, 0.1: 5 };
  function quiCrit(gl, alphaPct) { return QUI_TAB[gl][QUI_COL[alphaPct]]; }
  function quiQuadrado(tab) {
    var R = tab.length, C = tab[0].length;
    var rt = tab.map(sum), ct = [], j, i;
    for (j = 0; j < C; j++) ct.push(sum(tab.map(function (r) { return r[j]; })));
    var N = sum(rt), cells = [], chi = 0;
    for (i = 0; i < R; i++) for (j = 0; j < C; j++) {
      var fe = rt[i] * ct[j] / N, fo = tab[i][j], c = Math.pow(fo - fe, 2) / fe;
      chi += c; cells.push({ i: i, j: j, fo: fo, fe: fe, chi: c, rt: rt[i], ct: ct[j] });
    }
    return { R: R, C: C, rt: rt, ct: ct, N: N, cells: cells, chi: chi, gl: (R - 1) * (C - 1) };
  }

  /* ---------- correlação e regressão ---------- */
  function correlacao(x, y) {
    var n = x.length, mx = mean(x), my = mean(y);
    var dx = x.map(function (v) { return v - mx; }), dy = y.map(function (v) { return v - my; });
    var sxy = sum(dx.map(function (v, i) { return v * dy[i]; }));
    var sxx = sum(dx.map(function (v) { return v * v; })), syy = sum(dy.map(function (v) { return v * v; }));
    var cov = sxy / n, sx = Math.sqrt(sxx / n), sy = Math.sqrt(syy / n);
    return { n: n, mx: mx, my: my, dx: dx, dy: dy, sxy: sxy, sxx: sxx, syy: syy, cov: cov, sx: sx, sy: sy, r: cov / (sx * sy) };
  }
  function regressao(x, y) {
    var n = x.length, sx = sum(x), sy = sum(y);
    var sxy = sum(x.map(function (v, i) { return v * y[i]; })), sx2 = sum(x.map(function (v) { return v * v; }));
    var k = sx / n;                         // fator do professor: multiplica a 1ª equação por Σx/n
    var b = (sxy - k * sy) / (sx2 - k * sx);
    var a = (sy - b * sx) / n;
    return { n: n, sx: sx, sy: sy, sxy: sxy, sx2: sx2, k: k, b: b, a: a, f: function (v) { return a + b * v; } };
  }

  global.EAP = global.EAP || {};
  global.EAP.S = {
    fmt: fmt, fmtInt: fmtInt, tex: tex, sum: sum, mean: mean, sorted: sorted, median: median, modes: modes,
    varPop: varPop, varSamp: varSamp, sdPop: sdPop, sdSamp: sdSamp,
    quartilProf: quartilProf, boxplot: boxplot,
    freqDiscrete: freqDiscrete, classes: classes, classLabel: classLabel, groupedStats: groupedStats, groupedMedian: groupedMedian,
    phi: phi, zTable: zTable, zRound: zRound, pdfNorm: pdfNorm, Z_CONF: Z_CONF,
    quiCrit: quiCrit, quiQuadrado: quiQuadrado,
    correlacao: correlacao, regressao: regressao
  };
})(window);
