/* Listas 5 e 6 — Mediana · Moda */
(function () {
  'use strict';
  const S = EAP.S, C = EAP.C, U = EAP.U, f = S.fmt, t = S.tex, T = U.tx;
  EAP.listas = EAP.listas || {};

  /* ---- mediana: série simples ---- */
  function serie(dados, un) {
    const rol = S.sorted(dados), n = rol.length;
    let h = U.calc('Rol (dados em ordem crescente):') + U.dataBox(rol);
    let md;
    if (n % 2) {
      const p = (n + 1) / 2; md = rol[p - 1];
      h += U.formula(`n = ${n}\\ (\\text{ímpar})\\qquad \\text{posição} = \\dfrac{n+1}{2} = \\dfrac{${n}+1}{2} = ${p}^{\\text{ª}} \\;\\Rightarrow\\; Md = ${t(md, 0)}`);
    } else {
      const a = n / 2, b = a + 1; md = (rol[a - 1] + rol[b - 1]) / 2;
      h += U.formula(`n = ${n}\\ (\\text{par})\\qquad 1^{\\text{o}}\\ \\text{central: } \\dfrac{n}{2} = ${a}^{\\text{º}}\\qquad 2^{\\text{o}}\\ \\text{central: } \\dfrac{n}{2}+1 = ${b}^{\\text{º}}`) +
        U.formula(`Md = \\dfrac{${rol[a - 1]} + ${rol[b - 1]}}{2} = ${t(md, 1)}`);
    }
    return { html: h + U.answer(T(`Md = ${t(md, md % 1 ? 1 : 0)}${un ? '\\ \\text{' + un + '}' : ''}`)), md };
  }
  /* ---- mediana: tabela X, F, FAC ---- */
  function agrup(xs, Fs, un, cap, head) {
    const n = S.sum(Fs); let ac = 0; const fac = Fs.map(v => (ac += v));
    const par = n % 2 === 0, p1 = par ? n / 2 : (n + 1) / 2, p2 = par ? n / 2 + 1 : p1;
    const idx = (p) => fac.findIndex(v => v >= p), i1 = idx(p1), i2 = idx(p2), md = (xs[i1] + xs[i2]) / 2;
    const tb = U.table({ caption: cap, head: [head, 'F', 'FAC'], rows: xs.map((x, i) => [x, Fs[i], fac[i]]), foot: ['Σ', n, ''], hl: i1 === i2 ? [i1] : [i1, i2] });
    const fm = par ? U.formula(`n = ${n}\\ (\\text{par}):\\ ${p1}^{\\text{º}}\\ \\text{e}\\ ${p2}^{\\text{º}}\\ \\text{elementos} \\Rightarrow Md = \\dfrac{${xs[i1]}+${xs[i2]}}{2} = ${t(md, md % 1 ? 1 : 0)}`)
      : U.formula(`n = ${n}\\ (\\text{ímpar}):\\ \\dfrac{n+1}{2} = \\dfrac{${n}+1}{2} = ${p1}^{\\text{ª}}\\ \\text{posição} \\Rightarrow Md = ${xs[i1]}`);
    return tb + fm + U.answer(T(`Md = ${t(md, md % 1 ? 1 : 0)}${un ? '\\ \\text{' + un + '}' : ''}`)) + U.calc('A posição cai na primeira linha cuja FAC alcança o valor (linha destacada).');
  }

  function l5() {
    U.ask.on = true; try { return l5_(); } finally { U.ask.on = false; }
  }
  function l5_() {
    let h = '';
    const a = serie([6, 4, 3, 1, 3, 6, 5], 'ms'), b = serie([1, 8, 3, 9, 8, 3, 6, 4]);
    h += U.question(1, '<p><b>1. Determine a mediana das séries e distribuições.</b></p>',
      U.part('a', 'Tempo de execução de um algoritmo (ms): 6 – 4 – 3 – 1 – 3 – 6 – 5', a.html) +
      U.part('b', 'Acessos simultâneos: 1 – 8 – 3 – 9 – 8 – 3 – 6 – 4', b.html) +
      U.part('c', 'Nº de erros por módulo de software — X: 2, 3, 4, 5, 6, 7 · F: 3, 5, 8, 4, 2, 1', agrup([2, 3, 4, 5, 6, 7], [3, 5, 8, 4, 2, 1], '', 'Erros por módulo', 'Nº de erros (X)')) +
      U.part('d', 'Pontuação de desempenho de servidores — X: 73, 75, 77, 79, 81 · F: 2, 10, 12, 5, 1', agrup([73, 75, 77, 79, 81], [2, 10, 12, 5, 1], 'pontos', 'Pontuação dos servidores', 'Pontuação (X)')) +
      (function () {
        const edges = [1, 3, 5, 7, 9, 11], F = [3, 5, 8, 6, 4]; let ac = 0;
        const rows = F.map((v, i) => ({ lo: edges[i], hi: edges[i + 1], F: v, FAC: (ac += v), last: i === 4 })), gm = S.groupedMedian(rows);
        return U.part('e', 'Tempo de resposta de uma aplicação (s) — classes 1–3 (F=3), 3–5 (5), 5–7 (8), 7–9 (6), 9–11 (4)',
          U.table({ caption: 'Tempo de resposta', head: ['Classe (s)', 'F', 'FAC'], left: [0], rows: rows.map(r => [S.classLabel(r), r.F, r.FAC]), foot: ['Σ', ac, ''], hl: [gm.cls] }) +
          U.formula([`\\dfrac{\\sum F}{2} = \\dfrac{${ac}}{2} = ${gm.half}^{\\text{ª}}\\ \\text{posição} \\Rightarrow \\text{classe mediana: } ${rows[gm.cls].lo}\\,|\\!-\\!-\\,${rows[gm.cls].hi}`,
            `Md = L + \\dfrac{\\left(\\frac{\\sum F}{2} - FAC_{ant}\\right)\\cdot h}{F} = ${gm.L} + \\dfrac{(${gm.half} - ${gm.facAnt})\\cdot ${gm.h}}{${gm.F}} = ${t(gm.value, 2)}`], true) +
          C.hist({ title: 'Tempo de resposta', rows, xLabel: 'Tempo (s)', yLabel: 'F' }) +
          U.answer(T(`Md \\approx ${t(gm.value, 2)}\\ \\text{s}`)));
      })());

    const w = '69 57 72 54 93 68 72 58 63 62 65 76 60 49 74 59 66 83 70 45 60 81 71 67 63 63 53 73 81 50 67 68 53 75 65 58 80 60 63 53'.split(' ').map(Number);
    const r = serie(w, 'kg');
    h += U.question(2, '<p><b>2. Análise de dados de hardware dos alunos.</b> Peso (kg) de equipamentos transportados diariamente por alunos de Desenvolvimento de Sistemas. Qual o peso mediano?</p>' + U.dataBox(w, true),
      U.part('', 'Mediana de dados não agrupados', r.html + U.note('São 40 elementos; os dois centrais (20º e 21º) são ambos 65, então a mediana é 65 kg.', 'info')));
    return h;
  }

  /* ================= LISTA 6 ================= */
  function modaSerie(dados, un) {
    const m = S.modes(dados), rol = S.sorted(dados);
    const tipo = m.freq === 1 ? 'amodal (nenhum valor se repete)' : m.values.length === 1 ? 'unimodal' : m.values.length === 2 ? 'bimodal' : 'multimodal';
    return U.calc('Moda = valor que aparece mais vezes. Rol (modas em destaque):') + U.dataBox(rol.map(v => m.values.includes(v) ? '<b>' + v + '</b>' : v)) +
      U.answer(T(`Mo = ${m.values.join(' ; ')}${un ? '\\ \\text{' + un + '}' : ''}`) + ` <small>(série ${tipo}, aparece ${m.freq}×)</small>`);
  }
  function modaClasses(edges, F, un, cap, label) {
    const rows = F.map((v, i) => ({ lo: edges[i], hi: edges[i + 1], F: v, last: i === F.length - 1 }));
    const i = F.indexOf(Math.max.apply(null, F)), d1 = F[i] - (i > 0 ? F[i - 1] : 0), d2 = F[i] - (i < F.length - 1 ? F[i + 1] : 0), hh = edges[i + 1] - edges[i], L = edges[i];
    const mo = L + d1 / (d1 + d2) * hh;
    return {
      mo, html: U.table({ caption: cap, head: [label, 'F'], left: [0], rows: rows.map(r => [S.classLabel(r), r.F]), hl: [i] }) +
        U.calc(`Classe modal (maior frequência, F = ${F[i]}): <b>${edges[i]} |-- ${edges[i + 1]}</b>.`) +
        U.formula(['Mo = L + \\left(\\dfrac{D_1}{D_1 + D_2}\\right)\\cdot h', `D_1 = ${F[i]} - ${i > 0 ? F[i - 1] : 0} = ${d1}\\qquad D_2 = ${F[i]} - ${i < F.length - 1 ? F[i + 1] : 0} = ${d2}\\qquad L = ${L}\\qquad h = ${hh}`,
          `Mo = ${L} + \\left(\\dfrac{${d1}}{${d1}+${d2}}\\right)\\cdot ${hh} = ${t(mo, 2)}\\ \\text{${un}}`], true) +
        C.hist({ title: cap, rows, xLabel: label, yLabel: 'F' }) + U.answer(T(`Mo \\approx ${t(mo, 2)}\\ \\text{${un}}`))
    };
  }
  function l6() {
    U.ask.on = true; try { return l6_(); } finally { U.ask.on = false; }
  }
  function l6_() {
    let h = '';
    const d = modaClasses([7, 10, 13, 16, 19, 22], [6, 10, 15, 10, 5], 'minutos', 'Tempo de uso diário de uma aplicação', 'Classe (min)');
    h += U.question(1, '<p><b>1. Moda de séries e distribuições.</b></p>',
      U.part('a', 'Tempo de resposta de um sistema (ms): 3 – 4 – 7 – 7 – 7 – 8 – 9 – 10', modaSerie([3, 4, 7, 7, 7, 8, 9, 10], 'ms') + U.gab('ok', 'Esperado: 7 (série unimodal)')) +
      U.part('b', 'Acessos diários a um servidor (centenas): 43 – 40 – 42 – 43 – 47 – 45 – 45 – 43 – 44 – 48', modaSerie([43, 40, 42, 43, 47, 45, 45, 43, 44, 48], '') + U.gab('ok', 'Esperado: 43 (série unimodal)')) +
      (function () {
        const xs = [72, 75, 78, 80], F = [8, 18, 28, 38], i = 3;
        return U.part('c', 'Pontuação de desempenho de sistemas — X: 72, 75, 78, 80 · F: 8, 18, 28, 38',
          U.table({ caption: 'Pontuação', head: ['Pontuação (X)', 'F'], rows: xs.map((x, k) => [x, F[k]]), hl: [i] }) +
          C.col({ title: 'Pontuação de desempenho', cats: xs.map(String), vals: F, xLabel: 'Pontuação (X)', yLabel: 'F' }) +
          U.answer(T('Mo = 80')) + U.calc('Valor com a maior frequência (F = 38).') + U.gab('ok', 'Esperado: 80'));
      })() +
      U.part('d', 'Tempo de uso diário (min) — classes 7–10 (F=6), 10–13 (10), 13–16 (15), 16–19 (10), 19–22 (5)', d.html + U.gab('ok', 'Esperado: classe modal 13 – 16; moda aproximada 14,5 minutos')));

    const s = modaClasses([500, 700, 900, 1100, 1300, 1500, 1700, 1900], [18, 31, 15, 3, 2, 1, 1], 'R\\$', 'Salários da empresa de tecnologia', 'Salários (R$)');
    h += U.question(2, '<p><b>2. Distribuição de salários numa empresa de tecnologia</b> (R$ / frequência): 500–700 (18), 700–900 (31), 900–1100 (15), 1100–1300 (3), 1300–1500 (2), 1500–1700 (1), 1700–1900 (1). Qual a moda dos salários da empresa?</p>',
      U.part('', 'Moda de dados agrupados com intervalo de classe', s.html + U.note('Moda ≈ R$ 789,66, que arredondamos para R$ 790.', 'info')));
    return h;
  }

  EAP.listas[5] = { id: 5, title: 'Lista 5 — Mediana', sub: 'Séries, distribuições sem intervalo e com intervalo de classe', toc: [['1', 'Séries e distribuições'], ['2', 'Peso de equipamentos']], render: l5 };
  EAP.listas[6] = { id: 6, title: 'Lista 6 — Moda', sub: 'Séries, distribuições e dados agrupados', toc: [['1', 'Séries e distribuições'], ['2', 'Salários na empresa']], render: l6 };
})();
