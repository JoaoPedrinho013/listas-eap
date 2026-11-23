/* Listas 7 a 10 — Dispersão · Boxplot · Distribuição normal · Amostra para estimar a média */
(function () {
  'use strict';
  const S = EAP.S, C = EAP.C, U = EAP.U, L = EAP.L, f = S.fmt, t = S.tex, T = U.tx;
  EAP.listas = EAP.listas || {};

  /* ================= LISTA 7 — Dispersão ================= */
  function sdBloco(v, cap, un, gabTxt) {
    const dt = U.dispTable(v, cap, un), n = v.length, sd = Math.sqrt(dt.sq / n);
    return { sd, mu: dt.mu, html: '<div class="tbl-wrap">' + dt.html + '</div>' +
      U.formula([`\\mu = \\dfrac{\\sum (X\\cdot F)}{\\sum F} = \\dfrac{${t(dt.sxf, 0)}}{${n}} = ${t(dt.mu, 2)}`, `\\sigma = \\sqrt{\\dfrac{\\sum\\left[F\\cdot(x-\\mu)^2\\right]}{n}} = \\sqrt{\\dfrac{${t(dt.sq, 2)}}{${n}}} = ${t(sd, 2)}`], true) +
      U.answer(T(`\\sigma = ${t(sd, 2)}\\ \\text{${un}}`)) + (gabTxt ? U.gab('ok', gabTxt) : '') };
  }
  function l7() {
    let h = '';
    const d1 = '35-26-39-25-39-22-42-40-39-22-21-40-16-32-39-21-28-39-18-37-23-14-27-44-30-32-21-15-26-43'.split('-').map(Number);
    h += U.question(1, '<p><b>1.</b> Tempo de resposta (ms) de 30 requisições a um microsserviço. Qual o desvio padrão?</p>' + U.dataBox(d1, true), U.part('', 'Desvio padrão (dados não agrupados com repetições)', sdBloco(d1, 'σ do tempo de resposta', 'ms', 'Resposta esperada: 9 ms').html));
    const dp = [123, 150, 148, 133, 139, 161];
    h += U.question(2, '<p><b>2.</b> Número de deploys em produção nos últimos 6 anos (2020 a 2025): 123 – 150 – 148 – 133 – 139 – 161. Qual o desvio padrão?</p>', U.part('', 'Desvio padrão', sdBloco(dp, 'σ dos deploys', 'deploys', 'Resposta esperada: 12 deploys').html));
    const ed = [0, 2, 4, 6, 8, 10], F = [4, 12, 24, 50, 8], cl = { rows: F.map((v, i) => ({ lo: ed[i], hi: ed[i + 1], F: v, pm: (ed[i] + ed[i + 1]) / 2, last: i === 4 })) }, tg = L.tabAgrup(cl, 'Tamanho dos pacotes', 'Tamanho (KB)');
    h += U.question(3, '<p><b>3.</b> Desvio padrão do tamanho de pacotes (KB) que trafegam em um switch:</p>' + U.table({ head: ['Tamanho (KB)', 'Frequência'], left: [0], rows: cl.rows.map(r => [S.classLabel(r), r.F]) }),
      U.part('', 'Desvio padrão para dados agrupados com intervalo', U.calc('Usa-se o ponto médio (Pm) de cada classe.') + tg.html +
        U.formula([`\\mu = \\dfrac{${t(tg.g.sxf, 0)}}{${tg.g.n}} = ${t(tg.g.mu, 2)}`, `\\sigma = \\sqrt{\\dfrac{${t(tg.g.sq, 2)}}{${tg.g.n}}} = ${t(tg.g.sdPop, 2)}\\ \\text{KB}`], true) + U.answer(T(`\\sigma = ${t(tg.g.sdPop, 2)}\\ \\text{KB}`)) + U.gab('ok', 'Resposta esperada: 1,90 KB')));
    const cvB = 1500 / 3500 * 100, cvF = 1100 / 3000 * 100;
    h += U.question(4, '<p><b>4.</b> Salário médio dos back-end: R$ 3.500, desvio R$ 1.500. Front-end: média R$ 3.000, desvio R$ 1.100. Qual cargo tem a menor dispersão relativa (CV)?</p>',
      U.part('', 'Coeficiente de variação', U.formula([`CV = \\dfrac{\\sigma}{\\mu}`, `CV_{back} = \\dfrac{1.500}{3.500} = ${t(cvB, 2)}\\%\\qquad CV_{front} = \\dfrac{1.100}{3.000} = ${t(cvF, 2)}\\%`], true) +
        U.table({ head: ['Cargo', 'CV'], rows: [['Back-end', f(cvB) + '%'], ['Front-end', f(cvF) + '%']], hl: [1], left: [0] }) + U.answer('Front-end (menor CV)') + U.gab('ok', 'Resposta esperada: Front-end')));
    const ca = 1 / 7 * 100, cb = 3 / 8 * 100;
    h += U.question(5, '<p><b>5.</b> Code smells: Módulo A — média 7, desvio 1; Módulo B — média 8, desvio 3. Qual tem a média mais representativa?</p>',
      U.part('', 'Coeficiente de variação', U.formula(`CV_A = \\dfrac{1}{7} = ${t(ca, 2)}\\%\\qquad CV_B = \\dfrac{3}{8} = ${t(cb, 2)}\\%`, true) +
        U.table({ head: ['Módulo', 'CV'], rows: [['A', f(ca) + '%'], ['B', f(cb) + '%']], hl: [0], left: [0] }) + U.answer('Módulo A (menor CV)') + U.gab('ok', 'Resposta esperada: Módulo A') +
        U.calc('Quanto menor o CV, mais representativa é a média e menor a dispersão.')));
    return h;
  }

  /* ================= LISTA 8 — Boxplot ================= */
  function l8() {
    let h = '';
    const sal = [10.53, 10.73, 11.06, 11.59, 12.00, 12.79, 13.23, 13.60, 13.85, 14.69, 14.71, 15.99, 16.22, 16.61, 17.26, 18.75, 19.40, 24.30];
    const ida = [25, 37, 30, 34, 41, 26, 32, 35, 46, 29, 40, 35, 31, 36, 43, 33, 48, 42];
    const bs = S.boxplot(sal), bi = S.boxplot(ida);
    const pos = (b) => U.calc(`n = ${b.n}: Q1 → posição ${b.n}·0,25 = ${b.n * 0.25} ⇒ ${b.q1info.txt}; Q3 → posição ${b.n}·0,75 = ${b.n * 0.75} ⇒ ${b.q3info.txt}.`);
    h += U.question(1, '<p><b>1.</b> Salário (mil R$) e idade (anos) de 18 profissionais da equipe de desenvolvimento. Construa o BOXPLOT para cada variável e analise a distribuição.</p>' + U.table({ head: ['Salário (mil R$)', 'Idade (anos)'], rows: sal.map((v, i) => [f(v), ida[i]]) }),
      U.part('', 'Salário (mil R$)', U.calc('Rol:') + U.dataBox(bs.rol) + pos(bs) + L.boxTable(bs, 'SALÁRIO') +
        C.box({ title: 'BoxPlot — salário (mil R$)', boxes: [{ label: 'Salário', s: bs }], yLabel: 'mil R$' }) +
        U.note(`<b>Análise:</b> há um outlier superior (${f(bs.outliers[0])}), o que alonga a cauda para cima: assimetria positiva. A caixa (50% centrais) vai de ${f(bs.q1)} a ${f(bs.q3)} mil R$ e a mediana é ${f(bs.md)}.`, 'info')) +
      U.part('', 'Idade (anos)', U.calc('Rol:') + U.dataBox(bi.rol) + pos(bi) + L.boxTable(bi, 'IDADE', 0) +
        C.box({ title: 'BoxPlot — idade (anos)', boxes: [{ label: 'Idade', s: bi }], yLabel: 'anos', dec: 0 }) +
        U.note(`<b>Análise:</b> não há outliers; a mediana (${f(bi.md, 0)}) fica próxima do centro da caixa (${bi.q1}–${bi.q3}) e os bigodes têm comprimentos parecidos: distribuição aproximadamente simétrica.`, 'info')));
    const a1 = '2.0 2.8 3.6 4.0 5.0 6.0 6.5 7.0 7.8 9.0 2.0 2.9 3.8 4.0 5.2 6.0 6.8 7.0 8.0 9.0 2.2 2.9 3.8 4.0 6.0 6.2 7.0 7.2 8.0 9.0 2.4 3.6 4.0 5.0 6.0 6.5 7.0 7.5 8.0 9.0'.split(' ').map(Number);
    const a2 = '2.0 4.3 5.1 6.3 6.9 7.0 7.8 8.1 8.2 9.0 3.8 4.7 5.8 6.5 7.0 7.1 8.0 8.1 8.3 9.0 4.0 4.8 6.0 6.5 7.0 7.3 8.0 8.2 8.8 9.1 4.1 4.9 6.2 6.8 7.0 7.5 8.0 8.2 9.0 9.8'.split(' ').map(Number);
    const b1 = S.boxplot(a1), b2 = S.boxplot(a2);
    h += U.question(2, '<p><b>2.</b> Notas finais de Estatística de duas turmas (Ano 1 e Ano 2, 40 alunos cada). A) Construa os BOXPLOTS no mesmo plano. B) Faça uma análise comparativa.</p>' + U.cols('<p class="calc-note">Ano 1:</p>' + U.dataBox(a1, true), '<p class="calc-note">Ano 2:</p>' + U.dataBox(a2, true)),
      U.part('A', 'BOXPLOTS no mesmo plano cartesiano', U.cols(U.calc('Rol — Ano 1:') + U.dataBox(b1.rol, true), U.calc('Rol — Ano 2:') + U.dataBox(b2.rol, true)) +
        U.calc(`n = 40: Q1 → posição 40·0,25 = 10 (inteira ⇒ média do 10º e 11º); Q3 → posição 40·0,75 = 30 (média do 30º e 31º).`) +
        U.cols(L.boxTable(b1, 'ANO 1'), L.boxTable(b2, 'ANO 2')) +
        C.box({ title: 'BoxPlot — notas finais', boxes: [{ label: 'Ano 1', s: b1 }, { label: 'Ano 2', s: b2 }], yLabel: 'nota', dec: 2 })) +
      U.part('B', 'Análise comparativa',
        U.table({ head: ['', 'Ano 1', 'Ano 2'], left: [0], rows: [['Mediana', f(b1.md, 1), f(b2.md, 1)], ['AIQ (dispersão central)', f(b1.aiq, 2), f(b2.aiq, 2)], ['Outliers', '–', b2.outliers.join(' ; ')]] }) +
        U.note(`A turma do <b>Ano 2</b> teve desempenho melhor (mediana ${f(b2.md, 1)} contra ${f(b1.md, 1)}) e mais homogêneo (AIQ ${f(b2.aiq, 2)} contra ${f(b1.aiq, 2)}); a única exceção é a nota ${b2.outliers[0]}, um outlier inferior isolado. No Ano 1 a mesma nota 2,0 não é outlier (o LI é ${f(b1.li, 2)}), pois as notas são mais espalhadas.`)));
    return h;
  }

  /* ================= LISTA 9 — Normal ================= */
  function l9() {
    U.ask.on = true; try { return l9_(); } finally { U.ask.on = false; }
  }
  function l9_() {
    let h = '';
    const mu = 55.3, sg = 4.5, fx = v => f(v, 1) + ' ms';
    const it = (l, x1, x2, k, esp, ctx) => U.part(l, ctx, (() => { const r = L.nProb({ mu, sigma: sg, kind: k, x1, x2, fmtX: fx, label: k === 'entre' ? `P(${x1} < X < ${x2})` : k === 'menor' ? `P(X < ${x1})` : `P(X > ${x1})`, N: 500, unit: 'requisições' }); return r.html + U.answer(r.count + ' requisições') + U.gab('ok', 'Esperado: ' + esp); })());
    h += U.question(1, '<p><b>1.</b> Tempos de resposta de 500 requisições a um servidor web: normal com média 55,3 ms e desvio padrão 4,5 ms. Quantas requisições têm tempo de resposta:</p>',
      it('a', 50, 60, 'entre', 366, 'Entre 50 e 60 ms') + it('b', 53.2, 0, 'maior', 340, 'Mais que 53,2 ms') + it('c', 58, 0, 'menor', 363, 'Menos que 58 ms') + it('d', 57, 0, 'maior', 176, 'Mais que 57 ms') + it('e', 53, 54, 'entre', 40, 'Entre 53 e 54 ms'));
    const m2 = 48000, s2 = 2000, fx2 = v => f(v, 0) + ' h';
    const r2a = L.nProb({ mu: m2, sigma: s2, kind: 'menor', x1: 46000, fmtX: fx2, label: 'P(X < 46.000)' }), r2b = L.nProb({ mu: m2, sigma: s2, kind: 'entre', x1: 44000, x2: 49000, fmtX: fx2, label: 'P(44.000 < X < 49.000)' });
    const area = 0.5 - 0.281, zc = L.invZ(area), muc = 34 - zc * 8.57;
    h += U.question(2, '<p><b>2.</b> A vida útil de SSDs é normal, média 48.000 h e desvio 2.000 h. Probabilidade de um SSD: a) durar menos que 46.000 h; b) durar entre 44.000 e 49.000 h; c) em uma normal, 28,1% das medições de uso de CPU são superiores a 34%; achar a média sabendo que σ = 8,57.</p>',
      U.part('a', 'Menos que 46.000 horas', r2a.html + U.answer(f(r2a.p * 100, 2) + '%') + U.gab('ok', 'Esperado: 15,87%')) +
      U.part('b', 'Entre 44.000 e 49.000 horas', r2b.html + U.answer(f(r2b.p * 100, 2) + '%') + U.gab('ok', 'Esperado: 66,87%')) +
      U.part('c', 'Encontrar a média (problema inverso)',
        U.calc('P(X &gt; 34) = 28,1% ⇒ a área entre a média e 34 é 0,5 − 0,281 = 0,2190. Procuramos 0,2190 no <i>corpo</i> da Tabela Z para achar o Z:') +
        C.bell({ title: 'P(X > 34) = 28,1%', mu: 29.03, sigma: 8.57, marks: [34], shade: [{ from: 34, to: null }], fmt: v => f(v, 1) + '%', notes: [{ x: 29.03 + 2.6 * 8.57, y: 70, text: '28,1%' }] }) +
        U.formula([`0{,}5 - 0{,}281 = ${t(area, 4)} \\;\\Rightarrow\\; Z = ${t(zc, 2)}\\ \\text{(tabela)}`, `Z = \\dfrac{x-\\mu}{\\sigma} \\Rightarrow ${t(zc, 2)} = \\dfrac{34-\\mu}{8{,}57} \\Rightarrow \\mu = 34 - ${t(zc, 2)}\\cdot 8{,}57 = ${t(muc, 2)}`], true) +
        U.answer(T(`\\mu \\approx ${t(muc, 2)}\\%`)) + U.gab('approx', 'Esperado: 29,02% (diferença de arredondamento)')));
    const r3 = L.nProb({ mu: 500, sigma: 100, kind: 'menor', x1: 300, fmtX: v => f(v, 0) + ' dias', label: 'P(X < 300)', N: 10000, unit: 'servidores' });
    h += U.question(3, '<p><b>3.</b> Tempo médio de uptime: 500 dias, desvio 100 dias (normal). Garantia de 300 dias. Com 10.000 servidores por mês, quantos precisarão de compensação?</p>', U.part('', 'Servidores abaixo de 300 dias', r3.html + U.answer(r3.count + ' servidores') + U.gab('ok', 'Esperado: 228')));
    const r4 = L.nProb({ mu: 2.5, sigma: 0.5, kind: 'maior', x1: 3, fmtX: v => f(v, 2) + ' s', label: 'P(X > 3)', N: 320, unit: 'requisições' });
    const a4 = 1 / 320, ar = 0.5 - a4, z4 = L.invZ(ar), x4 = 2.5 + z4 * 0.5;
    h += U.question(4, '<p><b>4.</b> API com tempo médio de 2,5 s e desvio 0,5 s; 320 requisições diárias. Se não responder em 3 s, o usuário ganha cupom. a) Quantas requisições resultarão em cupom? b) Qual o tempo de espera para que, no máximo, 1 requisição por dia resulte em cupom?</p>',
      U.part('a', 'Requisições com cupom', r4.html + U.answer(r4.count + ' requisições') + U.gab('ok', 'Esperado: 51')) +
      U.part('b', 'Tempo de espera (problema inverso)',
        U.formula([`P(X > x) = \\dfrac{1}{320} = ${t(a4, 6)}`, `\\text{área na tabela} = 0{,}5 - ${t(a4, 6)} = ${t(ar, 4)} \\;\\Rightarrow\\; Z = ${t(z4, 2)}`, `x = \\mu + Z\\cdot\\sigma = 2{,}5 + ${t(z4, 2)}\\cdot 0{,}5 = ${t(x4, 2)}\\ \\text{s}`], true) +
        C.bell({ title: 'P(X > x) = 1/320', mu: 2.5, sigma: 0.5, marks: [x4], shade: [{ from: x4, to: null }], fmt: v => f(v, 2) + ' s', notes: [{ x: 2.5 + 2.9 * 0.5, y: 70, text: '0,31%' }] }) +
        U.answer(T(`x = ${t(x4, 2)}\\ \\text{segundos}`)) + U.gab('ok', 'Esperado: 3,87 segundos')));
    return h;
  }

  /* ================= LISTA 10 — Amostra para estimar a média ================= */
  function l10() {
    let h = '';
    const q1 = L.nMedia(2.24, 12.4, 5, 250, 97.5), n1 = Math.round(q1.n);
    h += U.question(1, '<p><b>1.</b> Amostra de 20 programadores, de um total de 250 colaboradores: média 56,7 anos, desvio padrão 12,4 anos. A amostra é suficiente para estimar a média populacional com N/C de 97,5% e erro máximo de 5 anos? Se não, qual o tamanho mínimo?</p>',
      U.part('', 'Tamanho da amostra (população finita)', q1.html + U.answer(`Não é suficiente — necessários n = ${n1}; a amostra tem 20`) + U.gab('ok', 'Esperado: n = 28') +
        U.formula(`\\text{Prova real: } e = Z\\cdot\\dfrac{S}{\\sqrt{n}}\\cdot\\sqrt{\\dfrac{N-n}{N-1}} = ${t(2.24, 2)}\\cdot\\dfrac{12{,}4}{\\sqrt{${n1}}}\\cdot\\sqrt{\\dfrac{250-${n1}}{250-1}} = ${t(2.24 * 12.4 / Math.sqrt(n1) * Math.sqrt((250 - n1) / 249), 2)}`)));
    const q2 = L.nMedia(1.96, 6, 0.4, null, 95);
    h += U.question(2, '<p><b>2.</b> Estimar o tempo médio (h) de desenvolvimento de módulos com N/C de 95% e erro máximo de 0,4 h. Amostra piloto com variância 36. Tamanho mínimo da amostra?</p>',
      U.part('', 'Tamanho da amostra', U.calc('Variância = 36 ⇒ S = √36 = 6 h.') + q2.html + U.answer(T(`n = ${t(q2.nc, 0)}\\ \\text{módulos}`)) + U.gab('ok', 'Esperado: n = 864') + U.calc(`O cálculo dá ${f(q2.nc, 2)}; a lista considera 864 (arredondando para cima seria 865).`)));
    const e3 = 2.33 * 2000 / Math.sqrt(1400), q3 = L.nMedia(2.33, 2000, 100, null, 98);
    h += U.question(3, '<p><b>3.</b> Custo médio mensal com serviços de TI das empresas de uma cidade. Amostra piloto de 1.400 empresas: média € 3.200, desvio € 2.000. a) Erro da estimativa com N/C de 98%. b) Tamanho da amostra para erro máximo de € 100?</p>',
      U.part('a', 'Erro da estimativa', U.calc('N/C = 98% ⇒ Z = 2,33.') + U.formula(`e = Z\\cdot\\dfrac{S}{\\sqrt{n}} = 2{,}33\\cdot\\dfrac{2.000}{\\sqrt{1.400}} = ${t(e3, 2)}`) + U.answer(T(`e \\approx ${t(e3, 2)}\\ \\text{€}`)) + U.gab('approx', 'Esperado: € 124,00 (valor truncado)')) +
      U.part('b', 'Tamanho da amostra para e = € 100', q3.html + U.answer(T(`n = ${t(Math.ceil(q3.nc - 0.5), 0)}\\ \\text{empresas}`)) + U.gab('ok', 'Esperado: n = 2172')));
    const ed = [10, 11, 12, 13, 14, 15], F = [7, 12, 17, 15, 10], rows = F.map((v, i) => ({ lo: ed[i], hi: ed[i + 1], F: v, pm: ed[i] + 0.5, last: i === 4 })), tg = L.tabAgrup({ rows }, 'Diâmetro das peças', 'Diâmetro (cm)', 0);
    const s4 = tg.g.sdSamp, q4 = L.nMedia(2.58, s4, 0.5, null, 99);
    h += U.question(4, '<p><b>4.</b> Diâmetro (cm) de peças para servidores: 10–11 (7), 11–12 (12), 12–13 (17), 13–14 (15), 14–15 (10). A amostra é suficiente para estimar o diâmetro médio com N/C de 99% e erro máximo de 0,5 cm?</p>',
      U.part('', 'Estimar S e o tamanho da amostra', tg.html + U.formula([`\\bar{x} = \\dfrac{${t(tg.g.sxf, 1)}}{${tg.g.n}} = ${t(tg.g.mu, 2)}`, `S = \\sqrt{\\dfrac{\\sum F(x-\\bar{x})^2}{n-1}} = \\sqrt{\\dfrac{${t(tg.g.sq, 2)}}{${tg.g.n - 1}}} = ${t(s4, 2)}`], true) + q4.html +
        U.answer(`n = ${Math.round(q4.nc)} necessários — a amostra (${tg.g.n}) é suficiente`) + U.gab('ok', 'Esperado: n = 42') + U.note('Por ser amostra, S usa n − 1.', 'info')));
    return h;
  }

  EAP.listas[7] = { id: 7, title: 'Lista 7 — Dispersão', sub: 'Desvio padrão e coeficiente de variação', toc: [['1', 'σ do tempo de resposta'], ['2', 'σ dos deploys'], ['3', 'σ agrupado (pacotes)'], ['4', 'CV salários'], ['5', 'CV code smells']], render: l7 };
  EAP.listas[8] = { id: 8, title: 'Lista 8 — BOXPLOT', sub: 'Quartis, LS/LI, outliers e comparação', toc: [['1', 'Salário e idade'], ['2', 'Notas das turmas']], render: l8 };
  EAP.listas[9] = { id: 9, title: 'Lista 9 — Distribuição normal', sub: 'Curva normal reduzida e Tabela Z', toc: [['1', 'Requisições (5 itens)'], ['2', 'SSDs e CPU'], ['3', 'Uptime'], ['4', 'API e cupom']], render: l9 };
  EAP.listas[10] = { id: 10, title: 'Lista 10 — Amostra para estimar a média', sub: 'Tamanho da amostra e população finita', toc: [['1', 'Programadores'], ['2', 'Módulos'], ['3', 'Custos de TI'], ['4', 'Diâmetro das peças']], render: l10 };
})();
