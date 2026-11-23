/* Simulado 1 — Exercício Geral 1 (25/09/2026) */
(function (global) {
  'use strict';
  const S = EAP.S, C = EAP.C, U = EAP.U, f = S.fmt, t = S.tex, T = U.tx;

  /* ---------------- Questão 1 ---------------- */
  function q1() {
    const resp = ('MF E MF E E F E MF N R E  N F R F N E R F E F N  E N E R E N E E F N R  R E R R E MF R F E R E').split(/\s+/);
    const ordem = ['MF', 'F', 'E', 'R', 'N'];
    const nome = { MF: 'Muito frequentemente', F: 'Frequentemente', E: 'Eventualmente', R: 'Raramente', N: 'Nunca' };
    const tab = S.freqDiscrete(resp, ordem), n = resp.length;
    const fMF = tab[0].F, fF = tab[1].F, pos = fMF + fF;
    const stmt = '<p><b>1.</b> Pesquisa com estudantes de DSM sobre o AVA: <i>“O ambiente virtual de aprendizagem e os recursos oferecidos atendem às suas expectativas?”</i> Respostas: Muito frequentemente (MF) – Frequentemente (F) – Eventualmente (E) – Raramente (R) – Nunca (N).</p>' +
      U.dataBox(resp, true) +
      '<p style="margin-top:8px">a) Faça a distribuição de frequência das respostas obtidas. b) Construa o gráfico de coluna. c) Qual a % de respostas positivas (Muito Frequentemente – Frequentemente)?</p>';
    let body = '';
    body += U.part('a', 'Distribuição de frequência',
      U.calc('Variável <b>qualitativa ordinal</b> (existe ordenação): ordenamos de “Muito frequentemente” a “Nunca”. F = nº de vezes que a resposta aparece; F% = F ÷ n × 100.') +
      U.formula('F\\% = \\dfrac{F}{\\sum F}\\times 100') +
      U.table({
        caption: 'Percepção sobre o AVA',
        head: ['Resposta (X)', 'F', 'F%'], left: [0],
        rows: tab.map(r => [`${r.x} <small>— ${nome[r.x]}</small>`, r.F, f(r.Fp)]),
        foot: ['Σ', n, '100,00']
      }) +
      U.gab('ok', 'Gabarito: MF 4 · F 7 · E 16 · R 10 · N 7 · Σ 44') +
      U.calc('Moda (dado qualitativo): <b>Mo = Eventualmente</b> (maior frequência, F = ' + tab[2].F + ').'));
    body += U.part('b', 'Gráfico de coluna',
      C.col({ title: 'Percepção sobre o AVA', cats: ordem, vals: tab.map(r => r.F), xLabel: 'Respostas', yLabel: 'Frequência (F)' }));
    body += U.part('c', '% de respostas positivas (MF + F)',
      U.formula(`P(\\text{positivas}) = \\dfrac{F_{MF}+F_{F}}{n} = \\dfrac{${fMF}+${fF}}{${n}} = \\dfrac{${pos}}{${n}} = ${t(pos / n, 2)}`) +
      U.answer(T(`${t(pos / n * 100, 0)}\\%`)) + U.gab('ok', 'Gabarito: 11/44 = 25%'));
    return U.question(1, stmt, body);
  }

  /* ---------------- Questão 2 ---------------- */
  const D2 = [120, 250, 252, 260, 181, 197, 279, 223, 160, 170, 170, 282, 368, 220, 220, 220, 235, 293, 240, 250, 250, 300, 300, 305, 310, 220, 330, 340, 350, 301, 180, 180, 190, 200, 210, 223];
  function q2() {
    const n = D2.length, cl = S.classes(D2), rows = cl.rows, rol = S.sorted(D2);
    const stmt = '<p><b>2.</b> Tempo de resposta (ms) do sistema para diferentes requisições ao servidor backend (testes em diferentes dispositivos e conexões):</p>' +
      U.dataBox(D2, true) +
      '<p style="margin-top:8px">a) Distribuição de frequência com intervalo de classe; b) gráfico da FAC; c) desvio padrão; d) tempo de resposta mediano; e) tempo médio de resposta com N/C de 95%; f) a amostra é suficiente para estimar o tempo médio com N/C de 95% e erro máximo de 20 ms? Justifique.</p>';
    let body = '';

    /* a */
    body += U.part('a', 'Distribuição de frequência com intervalo de classe',
      U.calc(`Número de classes, amplitude total e amplitude das classes (n = ${n}):`) +
      U.formula([`K = \\sqrt{n} = \\sqrt{${n}} = ${t(cl.K, 0)}`, `AT = (>\\text{valor}) - (<\\text{valor}) = ${cl.max} - ${cl.min} = ${cl.AT}`, `h = \\dfrac{AT}{K} = \\dfrac{${cl.AT}}{${cl.K}} = ${t(cl.hraw, 2)} \\;\\Rightarrow\\; h = ${cl.h}\\ \\text{(arredondado para cima, para cobrir o maior valor)}`], true) +
      U.table({
        caption: 'Levantamento do tempo de resposta',
        head: ['Tempo (ms)', 'F', 'F%', 'FAC', 'Pm (X)'], left: [0],
        rows: rows.map(r => [S.classLabel(r), r.F, f(r.Fp), r.FAC, f(r.pm, 0)]),
        foot: ['Σ', n, '100,00', '', '']
      }) +
      C.hist({ title: 'Levantamento do tempo de resposta (histograma)', rows, xLabel: 'Tempo de resposta (ms)', yLabel: 'F' }) +
      U.gab('ok', 'Gabarito: F = 2 · 8 · 9 · 7 · 6 · 4') +
      U.note('O gabarito usa h = 248/6 = 41,33 (limites 120; 161; 203; 244; 285; 327; 368). Aqui arredondamos h para 42 — as frequências são exatamente as mesmas.', 'info'));

    /* b */
    body += U.part('b', 'Gráfico da FAC (frequência acumulada)',
      U.calc('A FAC é lançada sobre o <b>limite superior</b> de cada classe.') +
      U.table({ caption: 'Levantamento do tempo de resposta', head: ['Tempo (ms)', 'F', 'FAC'], left: [0], rows: rows.map(r => [S.classLabel(r), r.F, r.FAC]) }) +
      C.line({ title: 'Levantamento do tempo de resposta', points: rows.map(r => ({ x: r.hi, y: r.FAC })), xTicks: rows.map(r => r.hi), xLabel: 'Limite superior (ms)', yLabel: 'FAC', valueLabels: true, dec: 0 }));

    /* c */
    const dt = U.dispTable(D2, 'σ do tempo de resposta', 'ms'), mu = dt.mu, sdp = Math.sqrt(dt.sq / n);
    const sdG = S.groupedStats(rows).sdPop;
    body += U.part('c', 'Desvio padrão do tempo de resposta',
      U.calc('Para dados não agrupados com valores repetidos: tabela X · F · F(x−μ)².') +
      U.formula(['\\mu = \\dfrac{\\sum (X\\cdot F)}{\\sum F} = ' + `\\dfrac{${f(dt.sxf, 0)}}{${n}} = ${t(mu, 2)}\\ \\text{ms}`, '\\sigma = \\sqrt{\\dfrac{\\sum \\left[F\\cdot (x-\\mu)^2\\right]}{n}} = ' + `\\sqrt{\\dfrac{${t(dt.sq, 2)}}{${n}}} = \\sqrt{${t(dt.sq / n, 2)}} = ${t(sdp, 2)}\\ \\text{ms}`], true) +
      '<div class="tbl-wrap">' + dt.html + '</div>' +
      U.answer(T(`\\sigma = ${t(sdp, 1)}\\ \\text{ms}`)) + U.gab('ok', 'Gabarito: 58,5 ms') +
      U.note(`Pelos pontos médios das classes (dados agrupados) o resultado seria ${f(sdG, 1)} ms — por isso usamos os dados originais, que é o que o gabarito faz.`, 'info'));

    /* d */
    const gm = S.groupedMedian(rows), md = S.median(D2), p1 = n / 2, p2 = n / 2 + 1;
    body += U.part('d', 'Tempo de resposta mediano',
      U.calc('Rol (dados em ordem crescente):') + U.dataBox(rol, true) +
      U.formula([`n = ${n}\\ (\\text{par}) \\Rightarrow \\text{1º elemento central: } \\dfrac{n}{2} = ${p1}^{\\text{º}},\\quad \\text{2º elemento central: } \\dfrac{n}{2}+1 = ${p2}^{\\text{º}}`,
        `Md = \\dfrac{${rol[p1 - 1]} + ${rol[p2 - 1]}}{2} = ${t(md, 1)}\\ \\text{ms}`], true) +
      U.answer(T(`Md = ${t(md, 1)}\\ \\text{ms}`)) +
      U.gab('diff', 'Gabarito traz 216 ms') +
      U.note(`<b>Conferência:</b> com os 36 dados ordenados, o 18º é ${rol[17]} e o 19º é ${rol[18]}, então a mediana é ${f(md, 1)} ms. O valor 216 do gabarito não bate com os dados (nem pelo cálculo agrupado: ${f(gm.value, 1)} ms com as classes acima). Vale confirmar com o professor.`) +
      U.calc('Pela fórmula de dados agrupados (aproximação): ') +
      U.formula(`Md = L + \\dfrac{\\left(\\frac{\\sum F}{2} - FAC_{ant}\\right)\\cdot h}{F} = ${gm.L} + \\dfrac{(${gm.half} - ${gm.facAnt})\\cdot ${gm.h}}{${gm.F}} = ${t(gm.value, 1)}\\ \\text{ms}`));

    /* e */
    const xb = S.mean(D2), z = 1.96, e = z * sdp / Math.sqrt(n), li = xb - e, ls = xb + e, sA = S.sdSamp(D2);
    body += U.part('e', 'Tempo médio de resposta com N/C de 95% (intervalo de confiança)',
      U.calc('N/C = 95% ⇒ α = 5% ⇒ α/2 = 2,5% ⇒ 0,95 ÷ 2 = 0,4750 na tabela Z ⇒ <b>Z = 1,96</b>.') +
      U.formula([`\\bar{x} = ${t(xb, 2)}\\ \\text{ms}\\qquad S = ${t(sdp, 1)}\\ \\text{ms}\\qquad n = ${n}`,
        `IC = \\bar{x} \\pm Z\\cdot\\dfrac{S}{\\sqrt{n}} = ${t(xb, 2)} \\pm 1{,}96\\cdot\\dfrac{${t(sdp, 1)}}{\\sqrt{${n}}} = ${t(xb, 2)} \\pm ${t(e, 2)}`,
        `IC = \\{${t(li, 2)}\\ \\text{a}\\ ${t(ls, 2)}\\}\\ \\text{ms}`], true) +
      C.ci({ title: 'Tempo médio de resposta — N/C de 95%', z: 1.96, conf: 95, lo: f(li, 2), center: f(xb, 2), hi: f(ls, 2) }) +
      U.answer(T(`IC = (${t(li, 0)}\\ \\text{a}\\ ${t(ls, 0)})\\ \\text{ms}`)) + U.gab('ok', 'Gabarito: IC = (225 a 263) ms') +
      U.note(`S = ${f(sdp, 1)} ms é o desvio padrão do item (c), o mesmo usado no gabarito. Com o S amostral (n − 1 = ${f(sA, 2)}) o IC seria (${f(xb - z * sA / Math.sqrt(n), 1)} ; ${f(xb + z * sA / Math.sqrt(n), 1)}) — praticamente igual.`, 'info'));

    /* f */
    const nn = Math.pow(z * sdp / 20, 2), nc = Math.ceil(nn - 1e-9), prova = z * sdp / Math.sqrt(nc);
    body += U.part('f', 'A amostra é suficiente? (N/C 95%, erro máximo e = 20 ms)',
      U.formula([`n = \\left(\\dfrac{Z\\cdot S}{e}\\right)^2 = \\left(\\dfrac{1{,}96\\cdot ${t(sdp, 1)}}{20}\\right)^2 = ${t(nn, 2)} \\;\\Rightarrow\\; n = ${nc}\\ \\text{dispositivos}`,
        `\\text{Prova real: erro da estimativa} = Z\\cdot\\dfrac{S}{\\sqrt{n}} = 1{,}96\\cdot\\dfrac{${t(sdp, 1)}}{\\sqrt{${nc}}} = ${t(prova, 1)}\\ \\text{ms} \\approx 20\\ \\text{ms}`], true) +
      U.answer(`Sim — seriam necessários ${nc} e a amostra tem ${n}`) + U.gab('ok', 'Gabarito: 33 necessários; amostra de 36'));
    return U.question(2, stmt, body);
  }

  /* ---------------- Questão 3 ---------------- */
  const D3 = [168, 118, 195, 200, 201, 215, 209, 205, 198, 185, 212, 200];
  function q3() {
    const n = D3.length, rol = S.sorted(D3);
    const stmt = '<p><b>3.</b> Custos com treinamento da equipe de suporte da filial no ano passado (investimento em mil R$):</p>' +
      U.table({ head: ['Mês', ...D3.map((_, i) => (i + 1) + 'º')], rows: [['Investimento (mil R$)', ...D3]], left: [0] }) +
      '<p>a) Média mensal; b) moda mensal; c) BOXPLOT; d) na matriz o coeficiente de variação foi de 17,43%: onde (matriz ou filial) a média mensal de investimento é mais representativa?</p>';
    let body = '';
    const sum = S.sum(D3), mu = sum / n;
    body += U.part('a', 'Média mensal do investimento',
      U.formula(`\\bar{x} = \\dfrac{\\sum X}{n} = \\dfrac{${D3.join('+')}}{${n}} = \\dfrac{${sum}}{${n}} = ${t(mu, 2)}`) +
      U.answer(T(`\\bar{x} = ${t(mu, 0)}\\ \\text{mil R\\$}`)) + U.gab('ok', 'Gabarito: 192 mil R$ (' + f(mu, 2) + ' sem arredondar)'));
    const m = S.modes(D3);
    body += U.part('b', 'Moda mensal do investimento',
      U.calc('Moda = valor que aparece mais vezes. Rol:') + U.dataBox(rol.map(v => m.values.includes(v) ? '<b>' + v + '</b>' : v)) +
      U.answer(T(`Mo = ${m.values.join(' ; ')}\\ \\text{mil R\\$}`) + ` <small>(aparece ${m.freq}×)</small>`) + U.gab('ok', 'Gabarito: 200 mil R$'));

    const b = S.boxplot(D3);
    body += U.part('c', 'BOXPLOT do investimento em treinamentos',
      U.calc('Rol:') + U.dataBox(rol) +
      U.calc(`Posição dos quartis: n·0,25 = ${n}·0,25 = ${n * 0.25} (inteiro ⇒ média do ${b.q1info.pos}º e do ${b.q1info.pos + 1}º) e n·0,75 = ${n * 0.75} (inteiro ⇒ média do ${b.q3info.pos}º e do ${b.q3info.pos + 1}º).`) +
      U.table({
        caption: 'FILIAL (mil R$)', left: [0], head: ['Medida', 'Valor'],
        rows: [['Mediana', f(b.md, 1)], ['Quartil 1', f(b.q1, 1)], ['Quartil 3', f(b.q3, 1)],
          ['AIQ (Amplitude interquartil) = Q3 – Q1', f(b.aiq, 1)], ['LS (limite superior) = Q3 + (1,5 · AIQ)', f(b.ls, 2)],
          ['LI (limite inferior) = Q1 – (1,5 · AIQ)', f(b.li, 2)], ['Maior valor antes do LS', f(b.maxIn, 0)], ['Menor valor antes do LI', f(b.minIn, 0)],
          ['Outlier – inferior e/ou superior', b.outliers.length ? b.outliers.join(' ; ') : '–']]
      }) +
      U.formula([`AIQ = ${t(b.q3, 0)} - ${t(b.q1, 0)} = ${t(b.aiq, 0)}`, `LS = ${t(b.q3, 0)} + 1{,}5\\cdot ${t(b.aiq, 0)} = ${t(b.ls, 1)}`, `LI = ${t(b.q1, 0)} - 1{,}5\\cdot ${t(b.aiq, 0)} = ${t(b.li, 1)}`], true) +
      C.box({ title: 'BoxPlot — investimento em treinamento (filial)', boxes: [{ label: 'Filial', s: b }], yLabel: 'mil R$', dec: 1 }) +
      U.gab('ok', 'Gabarito: caixa entre ~188 e ~208, bigodes 168–215 e outlier 118') +
      U.note('O 118 está abaixo do LI (164,5), então é <b>outlier inferior</b>; o menor valor “normal” é 168 e o maior é 215. O gráfico do gabarito (Excel) usa outro método de quartil e desenha a caixa em ≈187,5–208; pelo método do professor (slides do boxplot) Q1 = 190 e Q3 = 207.', 'info'));

    const sd = Math.sqrt(S.sum(D3.map(v => Math.pow(v - mu, 2))) / n), cv = sd / mu * 100;
    const dt = U.dispTable(D3, 'σ do investimento (filial)', 'mil R$');
    body += U.part('d', 'Média mais representativa: matriz ou filial?',
      U.calc('Quanto menor o CV, mais representativa é a média e menor a dispersão. Calculamos o CV da filial:') +
      '<div class="tbl-wrap">' + dt.html + '</div>' +
      U.formula([`\\sigma = \\sqrt{\\dfrac{\\sum F(x-\\mu)^2}{n}} = \\sqrt{\\dfrac{${t(dt.sq, 2)}}{${n}}} = ${t(sd, 2)}`, `CV = \\dfrac{\\sigma}{\\mu} = \\dfrac{${t(sd, 2)}}{${t(mu, 2)}} = ${t(cv, 2)}\\%`], true) +
      U.table({ head: ['', 'CV'], rows: [['Filial', f(cv, 2) + '%'], ['Matriz', '17,43%']], hl: [0], left: [0] }) +
      U.answer(`Filial — CV = ${f(cv, 2)}% &lt; 17,43%`) + U.gab('ok', 'Gabarito: CV da filial = 13,22% → média mais representativa na filial'));
    return U.question(3, stmt, body);
  }

  /* ---------------- Questão 4 ---------------- */
  function q4() {
    const cpu = [51, 40, 79, 60, 50, 80, 93, 70, 87], tr = [145, 178, 201, 252, 281, 320, 279, 250, 263];
    const stmt = '<p><b>4.</b> Desempenho de um servidor web: uso da CPU (%) e tempo de resposta (ms) ao longo de vários dias.</p>' +
      U.table({ head: ['Uso da CPU (%)', ...cpu], rows: [['Tempo de resposta (ms)', ...tr]], left: [0] }) +
      '<p>a) Mediana do uso da CPU (%); b) média do tempo de resposta; c) classifique as variáveis quanto ao tipo.</p>';
    const rol = S.sorted(cpu), n = cpu.length, pos = (n + 1) / 2, md = S.median(cpu), sum = S.sum(tr);
    let body = '';
    body += U.part('a', 'Mediana do uso da CPU',
      U.calc('Rol:') + U.dataBox(rol) +
      U.formula(`\\text{Posição do elemento mediano} = \\dfrac{n+1}{2} = \\dfrac{${n}+1}{2} = ${pos}^{\\text{ª}}\\ \\text{posição} \\Rightarrow Md = ${md}`) +
      U.answer(T(`Md = ${md}\\%`)) + U.gab('ok', 'Gabarito: 70%'));
    body += U.part('b', 'Média do tempo de resposta',
      U.formula(`\\bar{x} = \\dfrac{\\sum X}{n} = \\dfrac{${tr.join('+')}}{${n}} = \\dfrac{${sum}}{${n}} = ${t(sum / n, 0)}`) +
      U.answer(T(`\\bar{x} = ${t(sum / n, 0)}\\ \\text{ms}`)) + U.gab('ok', 'Gabarito: 241 ms'));
    body += U.part('c', 'Classificação das variáveis',
      U.table({
        head: ['Variável', 'Tipo', 'Por quê'], left: [0, 1, 2],
        rows: [['Uso da CPU (%)', 'Quantitativa contínua', 'medição; pode assumir infinitos valores num intervalo'], ['Tempo de resposta (ms)', 'Quantitativa contínua', 'medição; pode assumir infinitos valores num intervalo']]
      }) + U.gab('ok', 'Gabarito: Quantitativa contínua'));
    return U.question(4, stmt, body);
  }

  /* ---------------- Questão 5 e 7 (curva normal) ---------------- */
  function normalQ(num, stmt, mu, sg, x, tail, fmtX, unit, label) {
    const z = (x - mu) / sg, zr = S.zRound(z), a = S.zTable(z);
    const p = tail === 'menor' ? (z < 0 ? 0.5 - a : 0.5 + a) : (z > 0 ? 0.5 - a : 0.5 + a);
    const pExato = tail === 'menor' ? S.phi(z) : 1 - S.phi(z);
    const shade = tail === 'menor' ? [{ from: null, to: x }] : [{ from: x, to: null }];
    const ns = tail === 'menor' ? [{ x: mu - 2.7 * sg, text: label + ' = ' + f(p * 100, 2) + '%', y: 150, arrowTo: mu - 2.3 * sg }] : [{ x: mu + 2.7 * sg, text: label + ' = ' + f(p * 100, 2) + '%', y: 150, arrowTo: mu + 2.3 * sg }];
    const side = tail === 'menor' ? (z < 0 ? `0{,}5 - ${t(a, 4)}` : `0{,}5 + ${t(a, 4)}`) : (z > 0 ? `0{,}5 - ${t(a, 4)}` : `0{,}5 + ${t(a, 4)}`);
    return {
      z, zr, a, p, pExato,
      html:
        U.calc('Distribuição normal: padronizamos com o escore Z e consultamos a Tabela Z — P(0 ≤ Z ≤ z₀).') +
        U.formula(`Z = \\dfrac{x-\\mu}{\\sigma} = \\dfrac{${t(x, x % 1 ? 2 : 0)} - ${t(mu, mu % 1 ? 2 : 0)}}{${t(sg, sg % 1 ? 2 : 0)}} = ${t(z, 2)}\\ \\left(${t(a, 4)}\\right)`) +
        C.bell({ title: 'Distribuição normal — ' + label, mu, sigma: sg, marks: [x], shade, fmt: fmtX, notes: ns }) +
        U.calc(`Tabela Z: z = ${f(Math.abs(zr), 2)} → área entre a média e z = <b>${f(a, 4)}</b>. Como queremos a cauda ${tail === 'menor' ? 'à esquerda' : 'à direita'}, subtraímos a área de 0,5 (metade da curva).`) +
        U.formula(`P(E) = ${side} = ${t(p, 4)}\\ \\text{ou}\\ ${t(p * 100, 2)}\\%`) +
        U.answer(T(`P(E) = ${t(p * 100, 2)}\\%`)) +
        U.gab('approx', `Gabarito: ${f(pExato * 100, 2)}% (z sem arredondar = ${f(z, 3)})`)
    };
  }
  function q5() {
    const stmt = '<p><b>5.</b> Em média, uma escola técnica investe R$ 57.500,00 por ano na formação continuada dos professores do curso de DSM, com desvio padrão de R$ 9.700,00. Qual a probabilidade de, em um determinado ano, esse investimento ser <b>menor que R$ 50.000,00</b>?</p>';
    const r = normalQ(5, stmt, 57500, 9700, 50000, 'menor', v => 'R$ ' + f(v, 0), 'R$', 'P(X < 50.000)');
    return U.question(5, stmt, U.part('', 'Resolução com a curva normal reduzida', r.html +
      U.note('Pelo método dos slides (z arredondado em 2 casas: −0,77 → 0,2794) obtém-se 22,06%. O gabarito usa o z exato (−0,773) e chega a 21,97%: a diferença é só de arredondamento.', 'info')));
  }
  function q7() {
    const stmt = '<p><b>7.</b> A capacidade atual de armazenamento do servidor é de 2,73 TB. Para o próximo mês a estimativa de armazenamento é, em média, 1,95 TB com desvio de 0,5 TB. Qual a chance de a capacidade ser ultrapassada já no próximo mês?</p>';
    const r = normalQ(7, stmt, 1.95, 0.5, 2.73, 'maior', v => f(v, 2) + ' TB', 'TB', 'P(X > 2,73)');
    return U.question(7, stmt, U.part('', 'Resolução com a curva normal reduzida', r.html));
  }

  /* ---------------- Questão 6 ---------------- */
  function q6() {
    const meses = ['Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro'], v = [29, 35, 46, 51, 72, 79], n = v.length;
    const stmt = '<p><b>6.</b> Custos com treinamento da equipe de suporte (mil R$):</p>' +
      U.table({ head: ['Mês', ...meses], rows: [['Custos (mil R$)', ...v]], left: [0] }) +
      '<p>a) Desvio padrão dos custos; b) represente o levantamento com um gráfico de setores; c) o mesmo levantamento no ano retrasado teve um coeficiente de determinação de 17% (entenda-se <i>variação</i>). Em qual ano a dispersão foi maior? Justifique.</p>';
    const mu = S.mean(v), dt = U.dispTable(v, 'σ dos custos com treinamento', 'mil R$'), sd = Math.sqrt(dt.sq / n), cv = sd / mu * 100, tot = S.sum(v);
    let body = '';
    body += U.part('a', 'Desvio padrão dos custos',
      '<div class="tbl-wrap">' + dt.html + '</div>' +
      U.formula([`\\mu = \\dfrac{${tot}}{${n}} = ${t(mu, 0)}`, `\\sigma = \\sqrt{\\dfrac{\\sum F(x-\\mu)^2}{n}} = \\sqrt{\\dfrac{${t(dt.sq, 0)}}{${n}}} = \\sqrt{${t(dt.sq / n, 2)}} = ${t(sd, 3)}`], true) +
      U.answer(T(`\\sigma = ${t(sd, 3)}\\ \\text{mil R\\$}`)) + U.gab('ok', 'Gabarito: 18,184 mil R$'));
    body += U.part('b', 'Gráfico de setores',
      U.calc('Cada fatia = (valor ÷ total) × 360°. Exemplo: 29/312 × 360° = ' + f(29 / tot * 360, 2) + '°.') +
      U.table({ caption: 'Custos com treinamento', head: ['Mês', 'Custo', '%', 'Graus'], left: [0], rows: meses.map((m, i) => [m, v[i], f(v[i] / tot * 100, 2), f(v[i] / tot * 360, 2)]), foot: ['Σ', tot, '100,00', '360,00'] }) +
      C.pie({ title: 'Custos com treinamento (mil R$)', items: meses.map((m, i) => ({ label: m, value: v[i] })) }) +
      U.gab('ok', 'Gabarito: 9,29% · 11,22% · 14,74% · 16,35% · 23,08% · 25,32%'));
    body += U.part('c', 'Em qual ano a dispersão foi maior?',
      U.formula(`CV = \\dfrac{\\sigma}{\\mu} = \\dfrac{${t(sd, 3)}}{${t(mu, 0)}} = ${t(cv, 2)}\\%`) +
      U.table({ head: ['Ano', 'CV'], left: [0], rows: [['Ano passado', f(cv, 2) + '%'], ['Ano retrasado', '17,00%']], hl: [0] }) +
      U.answer(`Ano passado — CV = ${f(cv, 2)}% &gt; 17%`) +
      U.calc('Justificativa: o coeficiente de variação do ano passado é maior, logo seus custos foram mais dispersos (média menos representativa).') +
      U.gab('ok', 'Gabarito: no ano passado, CV = 34,97%'));
    return U.question(6, stmt, body);
  }

  EAP.normalQ = normalQ;
  EAP.sims[1] = {
    id: 1, title: 'Simulado 1 — Exercício Geral 1', date: '25/09/2026',
    toc: [['1', 'Distribuição, coluna e %'], ['2', 'Classes, FAC, σ, Md, IC e n'], ['3', 'Média, moda, BOXPLOT e CV'], ['4', 'Mediana, média e variáveis'], ['5', 'Curva normal (P < x)'], ['6', 'σ, setores e CV'], ['7', 'Curva normal (P > x)']],
    render: () => [q1(), q2(), q3(), q4(), q5(), q6(), q7()].join('')
  };
})(window);
