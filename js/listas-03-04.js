/* Listas 3 e 4 — Representação gráfica · Média */
(function () {
  'use strict';
  const S = EAP.S, C = EAP.C, U = EAP.U, f = S.fmt, t = S.tex, T = U.tx;
  EAP.listas = EAP.listas || {};

  /* ================= LISTA 3 ================= */
  function l3() {
    let h = '';
    const ex = [140, 146, 133, 142, 169, 177, 165, 167, 182, 168], im = [153, 148, 160, 162, 158, 157, 163, 168, 157, 177], anos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const dx = U.dispTable(ex, 'σ da exportação', '1000 t'), di = U.dispTable(im, 'σ da importação', '1000 t');
    const sx = Math.sqrt(dx.sq / 10), si = Math.sqrt(di.sq / 10), cx = sx / dx.mu * 100, ci = si / di.mu * 100;
    h += U.question(1, '<p><b>1. Comércio exterior (ano 1 a 10)</b> — exportação e importação em 1000 toneladas:</p>' +
      U.table({ head: ['Ano', ...anos], rows: [['Exportação', ...ex], ['Importação', ...im]], left: [0] }) +
      '<p>a) Gráfico de linha com as duas séries no mesmo plano cartesiano. b) Qual das duas séries tem a maior dispersão?</p>',
      U.part('a', 'Gráfico de linha (série temporal)', U.calc('Cada série é uma linha; as duas dividem o mesmo plano para comparar a tendência ao longo dos anos.') +
        C.line2({ title: 'Comércio exterior', xs: anos, series: [{ name: 'Exportação', ys: ex }, { name: 'Importação', ys: im }], xLabel: 'Ano', yLabel: '1000 toneladas' })) +
      U.part('b', 'Maior dispersão — desvio padrão e coeficiente de variação',
        U.calc('Como as médias são diferentes, comparamos pelo <b>CV</b> (quanto maior, maior a dispersão).') +
        U.cols(dx.html, di.html) +
        U.formula([`\\sigma_{exp} = \\sqrt{\\dfrac{${t(dx.sq, 1)}}{10}} = ${t(sx, 2)}\\qquad CV_{exp} = \\dfrac{${t(sx, 2)}}{${t(dx.mu, 1)}} = ${t(cx, 2)}\\%`, `\\sigma_{imp} = \\sqrt{\\dfrac{${t(di.sq, 1)}}{10}} = ${t(si, 2)}\\qquad CV_{imp} = \\dfrac{${t(si, 2)}}{${t(di.mu, 1)}} = ${t(ci, 2)}\\%`], true) +
        U.answer('Exportação tem a maior dispersão') + U.calc(`CV da exportação (${f(cx, 2)}%) &gt; CV da importação (${f(ci, 2)}%); a exportação oscila mais.`)));

    const rows = [[5, 10, 5], [10, 15, 15], [15, 20, 20], [20, 25, 30], [25, 30, 10]];
    let fac = 0; const cl = rows.map((r, i) => { fac += r[2]; return { lo: r[0], hi: r[1], F: r[2], FAC: fac, last: i === rows.length - 1 }; });
    h += U.question(2, '<p><b>2.</b> Tempo de processamento (segundos):</p>' + U.table({ head: ['Tempo (s)', 'Frequência'], rows: cl.map(r => [S.classLabel(r), r.F]), left: [0] }) + '<p>a) Histograma &nbsp; b) Gráfico da FAC</p>',
      U.part('a', 'Histograma', U.calc('Barras coladas: a base é a amplitude da classe (h = 5) e a altura é a frequência F.') +
        C.hist({ title: 'Tempo de processamento', rows: cl, xLabel: 'Tempo (s)', yLabel: 'F' })) +
      U.part('b', 'Gráfico da FAC', U.calc('FAC lançada no <b>limite superior</b> de cada classe.') +
        U.table({ caption: 'Tempo de processamento', head: ['Tempo (s)', 'F', 'FAC'], left: [0], rows: cl.map(r => [S.classLabel(r), r.F, r.FAC]), foot: ['Σ', fac, ''] }) +
        C.line({ title: 'Tempo de processamento', points: cl.map(r => ({ x: r.hi, y: r.FAC })), xTicks: cl.map(r => r.hi), xLabel: 'Limite superior (s)', yLabel: 'FAC', valueLabels: true })));

    const cat = ['A', 'B', 'C', 'D', 'E'], F3 = [13, 25, 30, 18, 10], n3 = S.sum(F3);
    let a3 = 0; const fac3 = F3.map(v => (a3 += v));
    h += U.question(3, '<p><b>3.</b> Conceito escolar:</p>' + U.table({ head: ['Conceito', ...cat], rows: [['Frequência', ...F3]], left: [0] }) + '<p>a) Gráfico de setores &nbsp; b) Gráfico da FAC</p>',
      U.part('a', 'Gráfico de setores', U.formula('\\text{Graus} = \\dfrac{F}{\\sum F}\\times 360^\\circ') +
        U.table({ caption: 'Conceito escolar', head: ['Conceito', 'F', 'F%', 'Graus'], rows: cat.map((c, i) => [c, F3[i], f(F3[i] / n3 * 100), f(F3[i] / n3 * 360)]), foot: ['Σ', n3, '100,00', '360,00'] }) +
        U.calc(`Exemplo: ${F3[0]}/${n3} × 360° = ${f(F3[0] / n3 * 360, 2)}°.`) +
        C.pie({ title: 'Conceito escolar', items: cat.map((c, i) => ({ label: 'Conceito ' + c, value: F3[i] })) })) +
      U.part('b', 'Gráfico da FAC', U.table({ head: ['Conceito', 'F', 'FAC'], rows: cat.map((c, i) => [c, F3[i], fac3[i]]) }) +
        C.line({ title: 'Conceito escolar — frequência acumulada', points: cat.map((c, i) => ({ x: i + 1, y: fac3[i] })), xTicks: [1, 2, 3, 4, 5], xFmt: v => cat[v - 1], xLabel: 'Conceito', yLabel: 'FAC', valueLabels: true }) +
        U.note('Como a variável é qualitativa ordinal, a FAC acumula na ordem A → E.', 'info')));
    return h;
  }

  /* ================= LISTA 4 ================= */
  function l4() {
    let h = '';
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], ac = [32, 28, 41, 37, 28, 21, 48, 37, 29, 37, 18, 39];
    const s1 = S.sum(ac);
    h += U.question(1, '<p><b>1.</b> Número de usuários que acessaram um sistema de gestão em 2025. Qual foi a média mensal de acessos?</p>' + U.table({ head: ['Mês', ...meses], rows: [['Acessos', ...ac]], left: [0] }),
      U.part('', 'Média para dados não agrupados', U.formula(`\\bar{x} = \\dfrac{\\sum X}{n} = \\dfrac{${ac.join('+')}}{12} = \\dfrac{${s1}}{12} = ${t(s1 / 12, 2)}`) + U.answer(T(`\\bar{x} \\approx ${t(s1 / 12, 1)}\\ \\text{acessos por mês}`)) + U.gab('info', 'A lista deixa a resposta em branco')));

    const anos = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], vg = [32000, 29000, 28340, 32100, 37800, 40280, 31980, 48700, 29800], s2 = S.sum(vg);
    h += U.question(2, '<p><b>2.</b> Procura por vagas em cursos técnicos de TI nos últimos 9 anos. Qual foi a média anual?</p>' + U.table({ head: ['Ano', ...anos], rows: [['Vagas procuradas', ...vg.map(v => f(v, 0))]], left: [0] }),
      U.part('', 'Média para dados não agrupados', U.formula(`\\bar{x} = \\dfrac{\\sum X}{n} = \\dfrac{${t(s2, 0)}}{9} = ${t(s2 / 9, 2)}`) + U.answer(T(`\\bar{x} \\approx ${t(s2 / 9, 0)}\\ \\text{vagas por ano}`)) +
        U.note('A lista traz o primeiro ano como “1917”; tratei como 2017 (não altera a média, pois o ano não entra na conta).', 'info')));

    const xs = [0, 1, 2, 3, 4, 5, 6, 7], F3 = [289, 348, 529, 938, 843, 329, 132, 101], n3 = S.sum(F3), sxf3 = S.sum(xs.map((x, i) => x * F3[i]));
    h += U.question(3, '<p><b>3.</b> Quantidade de dispositivos digitais por família (amostra). Qual a média?</p>' + U.table({ head: ['Nº de dispositivos', ...xs], rows: [['Frequência', ...F3]], left: [0] }),
      U.part('', 'Média para dados agrupados (sem intervalo)', U.formula('\\bar{x} = \\dfrac{\\sum (X\\cdot F)}{\\sum F}') +
        U.table({ caption: 'Dispositivos por família', head: ['X', 'F', 'X·F'], rows: xs.map((x, i) => [x, F3[i], x * F3[i]]), foot: ['Σ', n3, sxf3] }) +
        U.formula(`\\bar{x} = \\dfrac{${t(sxf3, 0)}}{${t(n3, 0)}} = ${t(sxf3 / n3, 2)}`) + U.answer(T(`\\bar{x} \\approx ${t(sxf3 / n3, 2)}\\ \\text{dispositivos por família}`))));

    const ed = [45, 53, 61, 69, 77, 85, 93], F4 = [30, 110, 120, 90, 40, 10], n4 = S.sum(F4), pm = F4.map((_, i) => (ed[i] + ed[i + 1]) / 2), sxf4 = S.sum(pm.map((p, i) => p * F4[i]));
    h += U.question(4, '<p><b>4.</b> Capacidade de armazenamento (GB) dos dispositivos de alunos de Desenvolvimento de Sistemas. Qual a capacidade média?</p>' + U.table({ head: ['Capacidade (GB)', ...F4.map((_, i) => `${ed[i]} – ${ed[i + 1]}`)], rows: [['Frequência', ...F4]], left: [0] }),
      U.part('', 'Média para dados agrupados (com intervalo de classe)', U.calc('Usa-se o ponto médio (Pm) de cada classe como valor representativo: Pm = (limite inferior + limite superior) ÷ 2.') +
        U.table({ caption: 'Armazenamento dos dispositivos', head: ['Capacidade (GB)', 'F', 'Pm (X)', 'X·F'], left: [0], rows: F4.map((v, i) => [`${ed[i]} /----- ${ed[i + 1]}`, v, pm[i], f(pm[i] * v, 0)]), foot: ['Σ', n4, '', f(sxf4, 0)] }) +
        U.formula(`\\bar{x} = \\dfrac{\\sum (X\\cdot F)}{\\sum F} = \\dfrac{${t(sxf4, 0)}}{${n4}} = ${t(sxf4 / n4, 2)}`) + U.answer(T(`\\bar{x} = ${t(sxf4 / n4, 1)}\\ \\text{GB}`)) +
        U.note('O professor arredonda a média de dados agrupados (ex.: 632/30 = 21 dias), então 65,6 ≈ 66 GB é aceitável.', 'info')));
    return h;
  }

  EAP.listas[3] = { id: 3, title: 'Lista 3 — Representação gráfica', sub: 'Linha, histograma, FAC e setores', toc: [['1', 'Comércio exterior (linhas)'], ['2', 'Histograma e FAC'], ['3', 'Setores e FAC']], render: l3 };
  EAP.listas[4] = { id: 4, title: 'Lista 4 — Média', sub: 'Dados não agrupados, agrupados e com intervalo de classe', toc: [['1', 'Acessos mensais'], ['2', 'Vagas por ano'], ['3', 'Dispositivos por família'], ['4', 'Armazenamento (GB)']], render: l4 };
})();
