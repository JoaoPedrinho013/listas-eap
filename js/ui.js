/* ui.js — blocos de apresentação (tabelas, fórmulas, respostas, conferência) */
(function (global) {
  'use strict';
  var S = global.EAP.S, C = global.EAP.C;
  var U_ask = { on: false };  // listas cujo item (a, b, c…) é a própria pergunta

  // fórmula (KaTeX) — usa renderToString; se a biblioteca não carregar, mostra o TeX cru
  function tx(t, display) {
    if (global.katex) {
      try { return global.katex.renderToString(t, { displayMode: !!display, throwOnError: false, strict: 'ignore' }); } catch (e) { /* cai no cru */ }
    }
    return '<code>' + C.esc(t) + '</code>';
  }
  function formula(list, row) {
    var arr = Array.isArray(list) ? list : [list];
    return '<div class="formula' + (row ? ' row' : '') + '">' + arr.map(function (t) { return tx(t, true); }).join('') + '</div>';
  }
  // tabela no estilo dos slides
  function table(o) {
    var h = '<div class="tbl-wrap"><table class="t">';
    if (o.caption) h += '<caption>' + o.caption + '</caption>';
    if (o.head) h += '<thead><tr>' + o.head.map(function (c, i) { return '<th' + (o.left && o.left.indexOf(i) >= 0 ? ' class="l"' : '') + '>' + c + '</th>'; }).join('') + '</tr></thead>';
    h += '<tbody>' + o.rows.map(function (r, ri) {
      return '<tr' + (o.hl && o.hl.indexOf(ri) >= 0 ? ' class="hl"' : '') + '>' + r.map(function (c, i) { return '<td' + (o.left && o.left.indexOf(i) >= 0 ? ' class="l"' : '') + '>' + c + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody>';
    if (o.foot) h += '<tfoot><tr>' + o.foot.map(function (c, i) { return '<td' + (o.left && o.left.indexOf(i) >= 0 ? ' class="l"' : '') + '>' + c + '</td>'; }).join('') + '</tr></tfoot>';
    return h + '</table></div>';
  }
  function answer(html) { return '<div class="answer-line"><span class="answer">' + html + '</span></div>'; }
  // conferência com o gabarito: kind = ok | approx | diff | info
  function gab(kind, text) {
    var ic = { ok: '✓', approx: '≈', diff: '≠', info: 'ℹ' }[kind];
    return '<span class="gab ' + kind + '"><span aria-hidden="true">' + ic + '</span>' + text + '</span>';
  }
  function note(html, kind) { return '<div class="note-box' + (kind ? ' ' + kind : '') + '">' + html + '</div>'; }
  function sub(t) { return '<div class="sub">' + t + '</div>'; }
  function calc(t) { return '<p class="calc-note">' + t + '</p>'; }
  function part(letter, title, body) {
    return '<section class="part' + (letter && U_ask.on ? ' ask' : '') + '"><h3>' + (letter ? '<span class="l">' + letter + ')</span>' : '') + '<span class="t">' + title + '</span></h3>' + body + '</section>';
  }
  function dataBox(arr, compact) {
    return '<div class="data-box' + (compact ? ' compact' : '') + '">' + (compact ? arr.map(function (v) { return '<span>' + v + '</span>'; }).join('') : arr.join(' – ')) + '</div>';
  }
  function cols(a, b) { return '<div class="cols"><div>' + a + '</div><div>' + b + '</div></div>'; }
  function question(n, stmt, body) {
    return '<article class="q" id="q' + n + '"><header><div class="n">' + n + '</div><div class="stmt">' + stmt + '</div></header><div class="body">' + body + '</div></article>';
  }
  // “de onde vem o μ”: a média é calculada antes da coluna F·(x−μ)²
  function passoMedia(sxf, n, mu) {
    return '<p class="calc-note"><b>Passo 1 — a média μ.</b> Ela sai das colunas <b>X·F</b> e <b>F</b> (some cada coluna e divida): é o valor usado em “x − μ” na última coluna.</p>' +
      formula('\\mu = \\dfrac{\\sum X\\cdot F}{\\sum F} = \\dfrac{' + S.tex(sxf, 2).replace(/\{,\}00$/, '') + '}{' + S.tex(n, 0) + '} = ' + S.tex(mu, 2)) +
      '<p class="calc-note"><b>Passo 2 — a coluna F·(x−μ)²:</b> para cada linha, (x − μ)² multiplicado por F.</p>';
  }
  // tabela de "X | F | X·F | F(x−μ)²" para valores distintos (jeito do slide 36)
  function dispTable(values, caption, unit) {
    var m = S.mean(values), freq = S.freqDiscrete(values), s = 0, sq = 0;
    var rows = freq.map(function (f) {
      var xf = f.x * f.F, d = f.F * Math.pow(f.x - m, 2); s += xf; sq += d;
      return [S.fmt(f.x, Number.isInteger(f.x) ? 0 : 1), f.F, S.fmt(xf, Number.isInteger(xf) ? 0 : 1), S.fmt(d, 2)];
    });
    return {
      html: passoMedia(s, values.length, m) + table({ caption: caption, head: ['X' + (unit ? ' (' + unit + ')' : ''), 'F', 'X·F', 'F·(x−μ)²'], rows: rows, foot: ['Σ', values.length, S.fmt(s, 0), S.fmt(sq, 2)] }),
      n: values.length, sxf: s, mu: m, sq: sq
    };
  }

  global.EAP.U = { passoMedia: passoMedia, ask: U_ask, tx: tx, formula: formula, table: table, answer: answer, gab: gab, note: note, sub: sub, calc: calc, part: part, dataBox: dataBox, cols: cols, question: question, dispTable: dispTable };
  global.EAP.sims = global.EAP.sims || {};
})(window);
