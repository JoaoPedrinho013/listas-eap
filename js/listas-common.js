/* Auxiliares compartilhados pelas listas 7–16 */
(function () {
  'use strict';
  const S = EAP.S, C = EAP.C, U = EAP.U, f = S.fmt, t = S.tex, T = U.tx;
  const L = EAP.L = {};

  /* z a partir da área P(0≤Z≤z) pela tabela do professor */
  L.invZ = function (area) {
    let best = 0, bd = 9;
    for (let z = 0; z <= 3.99; z += 0.01) { const d = Math.abs(S.zTable(z) - area); if (d < bd - 1e-12) { bd = d; best = Math.round(z * 100) / 100; } }
    return best;
  };

  /* probabilidade na curva normal: kind = 'entre' | 'menor' | 'maior' */
  L.nProb = function (o) {
    const mu = o.mu, sg = o.sigma, fx = o.fmtX || (v => f(v, 2)), zs = [o.x1].concat(o.kind === 'entre' ? [o.x2] : []).map(x => (x - mu) / sg);
    const as = zs.map(z => S.zTable(z)), mk = o.kind === 'entre' ? [o.x1, o.x2] : [o.x1];
    let p, expr;
    if (o.kind === 'entre') {
      const same = zs[0] * zs[1] > 0;
      p = same ? Math.abs(as[0] - as[1]) : as[0] + as[1];
      expr = same ? `${t(Math.max(as[0], as[1]), 4)} - ${t(Math.min(as[0], as[1]), 4)}` : `${t(as[0], 4)} + ${t(as[1], 4)}`;
    } else if (o.kind === 'menor') { p = zs[0] < 0 ? 0.5 - as[0] : 0.5 + as[0]; expr = zs[0] < 0 ? `0{,}5 - ${t(as[0], 4)}` : `0{,}5 + ${t(as[0], 4)}`; }
    else { p = zs[0] > 0 ? 0.5 - as[0] : 0.5 + as[0]; expr = zs[0] > 0 ? `0{,}5 - ${t(as[0], 4)}` : `0{,}5 + ${t(as[0], 4)}`; }
    const shade = o.kind === 'entre' ? [{ from: Math.min(o.x1, o.x2), to: Math.max(o.x1, o.x2) }] : o.kind === 'menor' ? [{ from: null, to: o.x1 }] : [{ from: o.x1, to: null }];
    const nx = o.kind === 'entre' ? (o.x1 + o.x2) / 2 : o.kind === 'menor' ? mu - 2.6 * sg : mu + 2.6 * sg;
    const zl = zs.map((z, i) => `Z_${zs.length > 1 ? i + 1 : ''} = \\dfrac{${t(mk[i], 2)} - ${t(mu, 2)}}{${t(sg, 2)}} = ${t(z, 2)}\\ \\left(${t(as[i], 4)}\\right)`);
    const html = U.formula(zl, true) +
      C.bell({ title: o.label, mu, sigma: sg, marks: mk, shade, fmt: fx, notes: [{ x: nx, y: 70, text: o.label + ' = ' + f(p * 100, 2) + '%' }] }) +
      U.formula(`P(E) = ${expr} = ${t(p, 4)}\\ \\text{ou}\\ ${t(p * 100, 2)}\\%`) +
      (o.N ? U.formula(`${t(p, 4)}\\times ${t(o.N, 0)} = ${t(p * o.N, 2)} \\approx ${t(Math.round(p * o.N), 0)}\\ ${o.unit || ''}`) : '');
    return { p, html, count: o.N ? Math.round(p * o.N) : null };
  };

  /* tamanho da amostra */
  L.nMedia = function (z, s, e, N, conf) {
    const nc = Math.pow(z * s / e, 2); let h = U.calc(`N/C = ${conf}% ⇒ α/2 = ${f((100 - conf) / 2, 1)}% ⇒ área ${f(conf / 200, 4)} na tabela Z ⇒ <b>Z = ${f(z, 2)}</b>.`) +
      U.formula(`n_{(c)} = \\left(\\dfrac{Z\\cdot S}{e}\\right)^2 = \\left(\\dfrac{${t(z, 2)}\\cdot ${t(s, 2)}}{${t(e, 2)}}\\right)^2 = ${t(nc, 2)}`);
    let n = nc;
    if (N) {
      const r = nc / N * 100;
      h += U.calc(`População finita se n(c)/N &gt; 5%: ${f(nc, 2)} / ${f(N, 0)} = ${f(r, 1)}%.`);
      if (r > 5) { n = nc * N / (nc + N - 1); h += U.formula(`n = \\dfrac{n_{(c)}\\cdot N}{n_{(c)}+N-1} = \\dfrac{${t(nc, 2)}\\cdot ${t(N, 0)}}{${t(nc, 2)}+${t(N, 0)}-1} = ${t(n, 2)}`); }
    }
    return { n, nc, html: h };
  };
  L.nProp = function (z, p, e, N, conf) {
    const nc = Math.pow(z / e, 2) * p * (1 - p); let h = U.calc(`N/C = ${conf}% ⇒ <b>Z = ${f(z, 2)}</b>; f% = ${f(p * 100, 0)}%, q% = ${f((1 - p) * 100, 0)}%, e = ${f(e * 100, 0)}%.`) +
      U.formula(`n_{(c)} = \\left(\\dfrac{Z}{e}\\right)^2\\cdot f\\%\\cdot q\\% = \\left(\\dfrac{${t(z, 2)}}{${t(e, 2)}}\\right)^2\\cdot ${t(p, 2)}\\cdot ${t(1 - p, 2)} = ${t(nc, 2)}`);
    let n = nc;
    if (N) {
      const r = nc / N * 100; h += U.calc(`População finita se n(c)/N &gt; 5%: ${f(nc, 2)} / ${f(N, 0)} = ${f(r, 1)}%.`);
      if (r > 5) { n = nc * N / (nc + N - 1); h += U.formula(`n = \\dfrac{n_{(c)}\\cdot N}{n_{(c)}+N-1} = \\dfrac{${t(nc, 2)}\\cdot ${t(N, 0)}}{${t(nc, 2)}+${t(N, 0)}-1} = ${t(n, 2)}`); }
    }
    return { n, nc, html: h };
  };
  /* IC proporção */
  L.icProp = function (x, n, conf, z, title, mult, unit) {
    const p = x / n, q = 1 - p, e = z * Math.sqrt(p * q / n), lo = p - e, hi = p + e;
    let h = U.calc(`N/C = ${conf}% ⇒ <b>Z = ${f(z, 2)}</b>. Estimativa pontual: f% = ${t(x, 0)}/${t(n, 0)} = ${f(p, 4)} (${f(p * 100, 2)}%).`) +
      U.formula([`IC = f\\% \\pm Z\\cdot\\sqrt{\\dfrac{f\\%\\cdot q\\%}{n}} = ${t(p, 4)} \\pm ${t(z, 2)}\\cdot\\sqrt{\\dfrac{${t(p, 4)}\\cdot ${t(q, 4)}}{${t(n, 0)}}} = ${t(p, 4)} \\pm ${t(e, 4)}`, `IC = \\{${t(lo * 100, 2)}\\%\\ ;\\ ${t(hi * 100, 2)}\\%\\}`], true) +
      C.ci({ title, z, conf, lo: f(lo * 100, 2) + '%', center: 'f = ' + f(p * 100, 2) + '%', hi: f(hi * 100, 2) + '%' });
    if (mult) h += U.formula([`${t(lo, 4)}\\times ${t(mult, 0)} = ${t(lo * mult, 0)}`, `${t(hi, 4)}\\times ${t(mult, 0)} = ${t(hi * mult, 0)}`], true);
    return { p, e, lo, hi, html: h };
  };
  /* IC média */
  L.icMedia = function (xb, s, n, conf, z, title, un) {
    const e = z * s / Math.sqrt(n), lo = xb - e, hi = xb + e;
    const html = U.calc(`N/C = ${conf}% ⇒ <b>Z = ${f(z, 2)}</b>.`) +
      U.formula([`IC = \\bar{x} \\pm Z\\cdot\\dfrac{S}{\\sqrt{n}} = ${t(xb, 2)} \\pm ${t(z, 2)}\\cdot\\dfrac{${t(s, 2)}}{\\sqrt{${n}}} = ${t(xb, 2)} \\pm ${t(e, 2)}`, `IC = \\{${t(lo, 2)}\\ \\text{a}\\ ${t(hi, 2)}\\}\\ ${un ? '\\text{' + un + '}' : ''}`], true) +
      C.ci({ title, z, conf, lo: f(lo, 2), center: 'x̄ = ' + f(xb, 2), hi: f(hi, 2) });
    return { lo, hi, e, html };
  };
  /* tabela de classes com Pm, X·F, F(x−μ)² e estatísticas agrupadas */
  L.tabAgrup = function (cl, caption, unit, dec) {
    const g = S.groupedStats(cl.rows);
    return {
      g, html: U.passoMedia(g.sxf, g.n, g.mu) + U.table({ caption, head: [unit, 'F', 'Pm (X)', 'X·F', 'F·(x−μ)²'], left: [0], rows: cl.rows.map(r => [S.classLabel(r, dec || 0), r.F, f(r.pm, 1), f(r.pm * r.F, 1), f(r.F * Math.pow(r.pm - g.mu, 2), 2)]), foot: ['Σ', g.n, '', f(g.sxf, 1), f(g.sq, 2)] })
    };
  };
  L.boxTable = function (b, cap, d) {
    d = d === undefined ? 2 : d;
    return U.table({
      caption: cap, left: [0], head: ['Medida', 'Valor'], rows: [['Mediana', f(b.md, d)], ['Quartil 1', f(b.q1, d)], ['Quartil 3', f(b.q3, d)], ['AIQ (Amplitude interquartil) = Q3 – Q1', f(b.aiq, d)],
        ['LS (limite superior) = Q3 + (1,5 · AIQ)', f(b.ls, d)], ['LI (limite inferior) = Q1 – (1,5 · AIQ)', f(b.li, d)], ['Maior valor antes do LS', f(b.maxIn, d)], ['Menor valor antes do LI', f(b.minIn, d)],
        ['Outlier – inferior e/ou superior', b.outliers.length ? b.outliers.map(v => f(v, d)).join(' ; ') : '–']]
    });
  };
  /* regressão completa no jeito do professor */
  L.regBloco = function (xs, ys, preds, xLabel, yLabel, un, xNames) {
    const rg = S.regressao(xs, ys), n = xs.length, eq3 = rg.sxy - rg.k * rg.sy, eq3b = rg.sx2 - rg.k * rg.sx;
    let h = U.formula(['\\sum y = n\\cdot a + b\\cdot\\sum x', '\\sum (x\\cdot y) = a\\cdot\\sum x + b\\cdot\\sum x^2', 'Y = a + b\\cdot X'], true) +
      U.table({ head: ['X', 'Y', 'X·Y', 'X²'], rows: xs.map((x, i) => [xNames ? xNames[i] + ' (' + x + ')' : x, f(ys[i], 0), f(x * ys[i], 0), f(x * x, 0)]), foot: ['∑ = ' + f(rg.sx, 0), '∑ = ' + f(rg.sy, 0), f(rg.sxy, 0), f(rg.sx2, 0)] }) +
      U.formula([`${t(rg.sy, 0)} = ${n}\\cdot a + b\\cdot ${t(rg.sx, 0)}`, `${t(rg.sxy, 0)} = a\\cdot ${t(rg.sx, 0)} + b\\cdot ${t(rg.sx2, 0)}`]) +
      U.calc(`Multiplicando a 1ª equação por −(Σx/n) = −${f(rg.k, 2)} e somando com a 2ª, eliminamos “a”:`) +
      U.formula([`${t(eq3, 2)} = ${t(eq3b, 2)}\\cdot b \\;\\Rightarrow\\; b = ${t(rg.b, 4)}`, `a = \\dfrac{${t(rg.sy, 0)} - ${t(rg.b, 4)}\\cdot ${t(rg.sx, 0)}}{${n}} = ${t(rg.a, 4)}`, `Y = ${t(rg.a, 2)} + ${t(rg.b, 2)}\\cdot X`], true);
    preds.forEach(p => { h += U.formula(`Y = ${t(rg.a, 2)} + ${t(rg.b, 4)}\\cdot(${t(p.x, 0)}) = ${t(rg.f(p.x), 2)}`) + U.answer(T(`${p.label} = ${t(rg.f(p.x), 0)}\\ \\text{${un}}`)); });
    h += C.scatter({ title: 'Linha de tendência e previsão', xs, ys, include: preds.map(p => ({ x: p.x, y: rg.f(p.x) })), line: { a: rg.a, b: rg.b }, xLabel, yLabel, extra: (x, y) => preds.map(p => `<circle cx="${x(p.x)}" cy="${y(rg.f(p.x))}" r="6" fill="none" stroke="var(--bad)" stroke-width="2.4"/><text class="vl" x="${x(p.x) - 8}" y="${y(rg.f(p.x)) - 12}" text-anchor="end">${p.label}: ${f(rg.f(p.x), 0)}</text>`).join('') });
    return { html: h, rg };
  };
})();
