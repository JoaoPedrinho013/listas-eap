/* Simulado 2 — Exercício Geral 2 (12/11/2026) */
(function (global) {
  'use strict';
  const S = EAP.S, C = EAP.C, U = EAP.U, f = S.fmt, t = S.tex, T = U.tx;

  /* ---------------- Questão 1: IC da proporção ---------------- */
  function q1() {
    const n = 150, x = 135, p = x / n, q = 1 - p, z = 1.65, e = z * Math.sqrt(p * q / n), li = p - e, ls = p + e;
    const stmt = '<p><b>1.</b> Em uma amostra de 150 implantações de software, 135 foram bem-sucedidas (sem rollback). Calcule o intervalo de confiança de <b>90%</b> para a proporção de sucesso nas implantações.</p>';
    const body = U.part('', 'Estimativa da proporção populacional (P)',
      U.calc('Estimativa pontual: f% = f(absoluta) ÷ n. N/C = 90% ⇒ α = 10% ⇒ α/2 = 5% ⇒ 0,90 ÷ 2 = 0,45 na tabela Z ⇒ <b>Z = 1,65</b>.') +
      U.formula([`f\\% = \\dfrac{${x}}{${n}} = ${t(p, 2)}\\ (90\\%)\\qquad q\\% = 1 - ${t(p, 2)} = ${t(q, 2)}`,
        `IC = f\\% \\pm Z\\cdot\\sqrt{\\dfrac{f\\%\\cdot q\\%}{n}} = ${t(p, 2)} \\pm 1{,}65\\cdot\\sqrt{\\dfrac{${t(p, 2)}\\cdot ${t(q, 2)}}{${n}}} = ${t(p, 2)} \\pm ${t(e, 4)}`,
        `IC = \\{${t(li, 4)}\\ ;\\ ${t(ls, 4)}\\} = \\{${t(li * 100, 2)}\\%\\ ;\\ ${t(ls * 100, 2)}\\%\\}`], true) +
      C.ci({ title: 'Proporção de implantações bem-sucedidas — N/C de 90%', z, conf: 90, lo: f(li * 100, 2) + '%', center: 'f = 90%', hi: f(ls * 100, 2) + '%' }) +
      U.answer(T(`IC = (${t(li, 4)}\\ ;\\ ${t(ls, 4)})`)) + U.gab('ok', 'Gabarito: IC = (0,8596 ; 0,9404)'));
    return U.question(1, stmt, body);
  }

  /* ---------------- Questão 2: IC da média ---------------- */
  function q2() {
    const n = 50, xb = 120, s = 15, z = 1.96, e = z * s / Math.sqrt(n), li = xb - e, ls = xb + e;
    const stmt = '<p><b>2.</b> Uma equipe de QA realizou 50 testes de desempenho e registrou os tempos de execução (s). A média foi de 120 s, com desvio padrão de 15 s. Qual é o intervalo de confiança de <b>95%</b> para o tempo médio de execução do sistema?</p>';
    const body = U.part('', 'Estimativa da média populacional (μ)',
      U.calc('N/C = 95% ⇒ α/2 = 2,5% ⇒ 0,95 ÷ 2 = 0,4750 na tabela Z ⇒ <b>Z = 1,96</b>.') +
      U.formula([`IC = \\bar{x} \\pm Z\\cdot\\dfrac{S}{\\sqrt{n}} = ${xb} \\pm 1{,}96\\cdot\\dfrac{${s}}{\\sqrt{${n}}} = ${xb} \\pm ${t(e, 2)}`, `IC = \\{${t(li, 2)}\\ \\text{a}\\ ${t(ls, 2)}\\}\\ \\text{s}`], true) +
      C.ci({ title: 'Tempo médio de execução — N/C de 95%', z, conf: 95, lo: f(li, 2), center: 'x̄ = 120', hi: f(ls, 2) }) +
      U.answer(T(`IC = (${t(li, 1)}\\ ;\\ ${t(ls, 1)})\\ \\text{s}`)) + U.gab('ok', 'Gabarito: IC = (115,8 ; 124,2)'));
    return U.question(2, stmt, body);
  }

  /* ---------------- Questão 3: tamanho da amostra (proporção) ---------------- */
  function q3() {
    const z = 2.58, e = 0.03, p = 0.2, q = 0.8, nn = Math.pow(z / e, 2) * p * q, n = Math.floor(nn), prova = z * Math.sqrt(p * q / n);
    const stmt = '<p><b>3.</b> Em uma pesquisa interna sobre bugs, a equipe deseja saber a proporção de erros identificados pelos desenvolvedores, com margem de erro de 3% e confiança de <b>99%</b>. Estima-se que a proporção inicial seja de 20%. Qual é o tamanho mínimo da amostra necessária?</p>';
    const body = U.part('', 'Tamanho da amostra para estimar a proporção (P)',
      U.calc('N/C = 99% ⇒ α/2 = 0,5% ⇒ 0,99 ÷ 2 = 0,495 na tabela Z ⇒ <b>Z = 2,58</b>. Margem de erro e = 3% = 0,03; f% = 20%; q% = 80%. Não foi informada a população total, então ela é considerada infinita (sem fator de correção).') +
      U.formula([`n = \\left(\\dfrac{Z}{e}\\right)^2\\cdot f\\%\\cdot q\\% = \\left(\\dfrac{2{,}58}{0{,}03}\\right)^2\\cdot 0{,}20\\cdot 0{,}80 = ${t(nn, 2)}`,
        `\\text{Prova real: erro da estimativa} = Z\\cdot\\sqrt{\\dfrac{f\\%\\cdot q\\%}{n}} = 2{,}58\\cdot\\sqrt{\\dfrac{0{,}20\\cdot 0{,}80}{${n}}} = ${t(prova * 100, 2)}\\%`], true) +
      U.answer(T(`n = ${t(n, 0)}\\ \\text{elementos}`)) + U.gab('ok', 'Gabarito: n = 1183') +
      U.note(`O cálculo dá ${f(nn, 2)}; o gabarito considera 1.183. Se você preferir arredondar sempre para cima (mais conservador), seria 1.184 — a diferença é irrelevante.`, 'info'));
    return U.question(3, stmt, body);
  }

  /* ---------------- Questão 4: tamanho da amostra (média) ---------------- */
  function q4() {
    const z = 1.96, s = 15, e = 5, nn = Math.pow(z * s / e, 2), n = Math.ceil(nn), prova = z * s / Math.sqrt(n);
    const stmt = '<p><b>4.</b> Uma empresa deseja estimar o tempo médio necessário para concluir um projeto usando uma nova tecnologia. Estima-se que o desvio padrão do tempo seja de 15 dias. Para uma estimativa com margem de erro de 5 dias e nível de confiança de 95%, qual deve ser o tamanho da amostra?</p>';
    const body = U.part('', 'Tamanho da amostra para estimar a média (μ)',
      U.calc('N/C = 95% ⇒ <b>Z = 1,96</b>; S = 15 dias; e = 5 dias. População não informada ⇒ infinita.') +
      U.formula([`n = \\left(\\dfrac{Z\\cdot S}{e}\\right)^2 = \\left(\\dfrac{1{,}96\\cdot ${s}}{${e}}\\right)^2 = (${t(z * s / e, 2)})^2 = ${t(nn, 2)} \\;\\Rightarrow\\; n = ${n}`,
        `\\text{Prova real: erro da estimativa} = Z\\cdot\\dfrac{S}{\\sqrt{n}} = 1{,}96\\cdot\\dfrac{${s}}{\\sqrt{${n}}} = ${t(prova, 2)}\\ \\text{dias} \\le 5`], true) +
      U.answer(T(`n = ${n}\\ \\text{projetos}`)) + U.gab('ok', 'Gabarito: n = 35'));
    return U.question(4, stmt, body);
  }

  /* ---------------- Questão 5: qui-quadrado ---------------- */
  function q5() {
    const tab = [[90, 23], [85, 15]], r = S.quiQuadrado(tab), crit = S.quiCrit(r.gl, 5), met = ['A2F', 'Biometria'], res = ['Sucesso', 'Falha'];
    const stmt = '<p><b>5.</b> Para avaliar a eficácia da autenticação de um software foram avaliados dois métodos: Autenticação de Dois Fatores (A2F) e Biometria. Tabela de contingência dos sucessos e falhas:</p>' +
      U.table({ head: ['Método', 'Sucesso', 'Falha'], rows: [['A2F', 90, 23], ['Biometria', 85, 15]], left: [0] }) +
      '<p>Com N/C de 95%, existe correlação entre o método e o resultado?</p>';
    let body = '';
    body += U.part('', 'Teste do qui-quadrado',
      U.sub('1) Tabela de contingência com totais') +
      U.table({
        caption: 'Método de autenticação × Resultado', head: ['Método', 'Sucesso', 'Falha', 'Total'], left: [0],
        rows: tab.map((row, i) => [met[i], ...row, r.rt[i]]), foot: ['Total', r.ct[0], r.ct[1], r.N]
      }) +
      U.sub('2) Frequência esperada F(E) de cada cruzamento') +
      U.calc(`Regra de três, como no slide do professor: dos ${r.N} testes, ${r.ct[0]} foram sucesso; se escolhermos ${r.rt[0]} autenticações com A2F, quantas seriam sucesso? &nbsp; ${r.N} — ${r.ct[0]} &nbsp;|&nbsp; ${r.rt[0]} — X ⇒ X = ${f(r.cells[0].fe, 2)}.`) +
      U.formula('F(E) = \\dfrac{(\\text{total da linha})\\cdot(\\text{total da coluna})}{\\text{total geral}}') +
      U.sub('3) Cálculo do χ² (c)') +
      U.formula('\\chi^2_{(c)} = \\sum \\dfrac{\\left[F(O)-F(E)\\right]^2}{F(E)}') +
      U.table({
        head: ['', 'Método', 'Resultado', 'F(O)', 'F(E)', 'χ² (c)'],
        rows: r.cells.map(c => ['', met[c.i], res[c.j], c.fo, f(c.fe, 2), f(c.chi, 3)]),
        foot: ['Σ', '–', '–', r.N, f(S.sum(r.cells.map(c => c.fe)), 0), f(r.chi, 3)]
      }) +
      U.formula(`\\chi^2_{(c)} = \\dfrac{(90-${t(r.cells[0].fe, 2)})^2}{${t(r.cells[0].fe, 2)}} + \\dfrac{(23-${t(r.cells[1].fe, 2)})^2}{${t(r.cells[1].fe, 2)}} + \\dfrac{(85-${t(r.cells[2].fe, 2)})^2}{${t(r.cells[2].fe, 2)}} + \\dfrac{(15-${t(r.cells[3].fe, 2)})^2}{${t(r.cells[3].fe, 2)}} = ${t(r.chi, 3)}`) +
      U.sub('4) χ² tabelado') +
      U.formula([`GL = (\\text{nº de colunas}-1)\\cdot(\\text{nº de linhas}-1) = (2-1)\\cdot(2-1) = ${r.gl}`, `\\text{N/C} = 95\\% \\Rightarrow \\alpha = 5\\%\\;\\Rightarrow\\; \\chi^2_{(tab)} = ${t(crit, 2)}\\ \\text{(tabela, GL = ${r.gl})}`]) +
      C.chi({ title: 'Teste do qui-quadrado — N/C de 95%', gl: r.gl, crit, calc: r.chi }) +
      U.sub('5) Tomada de decisão') +
      U.calc(`Se o χ²(c) estiver na região crítica (RC), as variáveis são <b>dependentes</b>. Aqui χ²(c) = ${f(r.chi, 3)} &lt; ${f(crit, 2)}: está na região de aceitação (RA).`) +
      U.answer('Não existe correlação — método e resultado são independentes') + U.gab('ok', 'Gabarito: não existe correlação'));
    return U.question(5, stmt, body);
  }

  /* ---------------- Questão 6: correlação, regressão, desvio ---------------- */
  const CPU = [51, 40, 79, 60, 70, 80, 93, 50, 87], TR = [145, 178, 201, 252, 281, 320, 279, 250, 263];
  function q6() {
    const stmt = '<p><b>6.</b> Desempenho de um servidor web: uso da CPU (%) e tempo de resposta (ms) ao longo de vários dias. Objetivo: entender se há relação entre o uso da CPU e o tempo de resposta.</p>' +
      U.table({ head: ['Uso da CPU (%)', ...CPU], rows: [['Tempo de resposta (ms)', ...TR]], left: [0] }) +
      '<p>a) Existe correlação? Justifique com o diagrama de dispersão; b) coeficiente de correlação; c) estimativa do tempo de resposta se for usado 30% da CPU; d) desvio padrão do tempo de resposta.</p>';
    const co = S.correlacao(CPU, TR), rg = S.regressao(CPU, TR), n = CPU.length;
    let body = '';

    /* a */
    body += U.part('a', 'Existe correlação? — diagrama de dispersão',
      U.calc('Variável independente X = uso da CPU (%); variável dependente Y = tempo de resposta (ms). A linha de tendência é crescente: quando X aumenta, Y também aumenta.') +
      C.scatter({ title: 'Diagrama de dispersão', xs: CPU, ys: TR, line: { a: rg.a, b: rg.b }, xLabel: 'Uso da CPU (%)', yLabel: 'Tempo de resposta (ms)' }) +
      U.answer('Sim, existe correlação positiva') + U.gab('ok', 'Gabarito: sim, existe correlação'));

    /* b */
    const rows = CPU.map((x, i) => [x, TR[i], f(co.dx[i], 2), f(co.dy[i], 2), f(co.dx[i] * co.dy[i], 1), f(co.dx[i] * co.dx[i], 1), f(co.dy[i] * co.dy[i], 1)]);
    body += U.part('b', 'Coeficiente de correlação',
      U.formula(['r = \\dfrac{COV}{\\sigma(x)\\cdot\\sigma(y)}', 'COV = \\dfrac{\\sum\\left[(X-\\bar{X})(Y-\\bar{Y})\\right]}{n}\\qquad \\sigma(x)=\\sqrt{\\dfrac{\\sum (x-\\bar{X})^2}{n}}\\qquad \\sigma(y)=\\sqrt{\\dfrac{\\sum (y-\\bar{Y})^2}{n}}'], true) +
      U.calc(`X̄ = ${f(co.mx, 2)} &nbsp; Ȳ = ${f(co.my, 0)} &nbsp; n = ${n}`) +
      U.table({ head: ['X', 'Y', '(X−X̄)', '(Y−Ȳ)', '(X−X̄)·(Y−Ȳ)', '(X−X̄)²', '(Y−Ȳ)²'], rows, foot: ['∑ = ' + f(S.sum(CPU), 0), '∑ = ' + f(S.sum(TR), 0), '0', '0', f(co.sxy, 1), f(co.sxx, 1), f(co.syy, 1)] }) +
      U.formula([`COV = \\dfrac{${t(co.sxy, 1)}}{${n}} = ${t(co.cov, 2)}`, `\\sigma(x) = \\sqrt{\\dfrac{${t(co.sxx, 1)}}{${n}}} = ${t(co.sx, 2)}\\qquad \\sigma(y) = \\sqrt{\\dfrac{${t(co.syy, 1)}}{${n}}} = ${t(co.sy, 2)}`, `r = \\dfrac{${t(co.cov, 2)}}{${t(co.sx, 2)}\\cdot ${t(co.sy, 2)}} = ${t(co.r, 4)}`], true) +
      U.answer(T(`r = ${t(co.r * 100, 2)}\\%`)) + U.gab('ok', 'Gabarito: r = 62,23%') +
      U.calc(`Interpretação: r = ${f(co.r, 2)} — correlação positiva moderada (quanto mais perto de +1, mais forte).`));

    /* c */
    const rw = CPU.map((x, i) => [x, TR[i], f(x * TR[i], 0), f(x * x, 0)]);
    const eq3 = rg.sxy - rg.k * rg.sy, eq3b = rg.sx2 - rg.k * rg.sx;
    body += U.part('c', 'Regressão linear — tempo de resposta para 30% da CPU',
      U.formula(['\\sum y = n\\cdot a + b\\cdot\\sum x', '\\sum (x\\cdot y) = a\\cdot\\sum x + b\\cdot\\sum x^2', 'Y = a + b\\cdot X'], true) +
      U.table({ head: ['X', 'Y', 'X·Y', 'X²'], rows: rw, foot: ['∑ = ' + f(rg.sx, 0), '∑ = ' + f(rg.sy, 0), f(rg.sxy, 0), f(rg.sx2, 0)] }) +
      U.sub('Equações normais (valores da tabela)') +
      U.formula([`${t(rg.sy, 0)} = ${n}\\cdot a + b\\cdot ${t(rg.sx, 0)}`, `${t(rg.sxy, 0)} = a\\cdot ${t(rg.sx, 0)} + b\\cdot ${t(rg.sx2, 0)}`]) +
      U.calc(`Para eliminar o “a”, multiplicamos a 1ª equação por −(Σx/n) = −(${f(rg.sx, 0)}/${n}) = −${f(rg.k, 2)} e somamos com a 2ª:`) +
      U.formula([`${t(rg.sxy, 0)} - ${t(rg.k * rg.sy, 1)} = b\\cdot(${t(rg.sx2, 0)} - ${t(rg.k * rg.sx, 1)}) \\;\\Rightarrow\\; ${t(eq3, 1)} = ${t(eq3b, 1)}\\cdot b \\;\\Rightarrow\\; b = ${t(rg.b, 4)}`,
        `${t(rg.sy, 0)} = ${n}\\cdot a + ${t(rg.b, 4)}\\cdot ${t(rg.sx, 0)} \\;\\Rightarrow\\; a = ${t(rg.a, 2)}`, `Y = ${t(rg.a, 2)} + ${t(rg.b, 2)}\\cdot X`, `Y = ${t(rg.a, 2)} + ${t(rg.b, 4)}\\cdot (30) = ${t(rg.f(30), 1)}\\ \\text{ms}`], true) +
      C.scatter({ title: 'Reta de regressão e ponto previsto (X = 30%)', xs: CPU, ys: TR, line: { a: rg.a, b: rg.b }, xLabel: 'Uso da CPU (%)', yLabel: 'Tempo de resposta (ms)', extra: (x, y) => `<circle cx="${x(30)}" cy="${y(rg.f(30))}" r="6.5" fill="none" stroke="var(--bad)" stroke-width="2.4"/><text class="vl" x="${x(30) + 12}" y="${y(rg.f(30)) + 26}">Previsão: ${f(rg.f(30), 0)} ms</text>` }) +
      U.answer(T(`\\text{Previsão} = ${t(rg.f(30), 0)}\\ \\text{ms}`)) + U.gab('ok', 'Gabarito: previsão = 170 ms'));

    /* d */
    const sdP = co.sy, sdA = Math.sqrt(co.syy / (n - 1));
    body += U.part('d', 'Desvio padrão do tempo de resposta',
      U.calc(`Σ(Y−Ȳ)² = ${f(co.syy, 1)} (coluna da tabela do item b). Os dados são uma <b>amostra</b>, então usamos o desvio padrão amostral (divide por n − 1):`) +
      U.formula([`S = \\sqrt{\\dfrac{\\sum (y-\\bar{y})^2}{n-1}} = \\sqrt{\\dfrac{${t(co.syy, 1)}}{${n - 1}}} = \\sqrt{${t(co.syy / (n - 1), 2)}} = ${t(sdA, 2)}\\ \\text{ms}`], true) +
      U.answer(T(`S = ${t(sdA, 2)}\\ \\text{ms}`)) + U.gab('ok', 'Gabarito: 55,63 ms') +
      U.note(`Se os dados fossem tratados como população (divide por n), seria σ = √(${f(co.syy, 1)}/${n}) = ${f(sdP, 2)} ms — foi o que o Simulado 1 usou nos itens “σ”. Aqui o gabarito usa a versão amostral (55,63).`, 'info'));
    return U.question(6, stmt, body);
  }

  /* ---------------- Questão 7 ---------------- */
  function q7() {
    const stmt = '<p><b>7.</b> Em média, uma escola técnica investe R$ 57.500,00 por ano na formação continuada dos professores do curso de DSM, com desvio padrão de R$ 9.700,00. Qual a probabilidade de, em um determinado ano, esse investimento ser <b>menor que R$ 50.000,00</b>?</p>';
    const r = EAP.normalQ(7, stmt, 57500, 9700, 50000, 'menor', v => 'R$ ' + f(v, 0), 'R$', 'P(X < 50.000)');
    return U.question(7, stmt, U.part('', 'Resolução com a curva normal reduzida', r.html +
      U.note('Z arredondado em 2 casas (−0,77 → 0,2794) dá 22,06%. O gabarito usa o z exato (−0,773) e obtém 21,97%: diferença só de arredondamento.', 'info')));
  }

  /* ---------------- Questão 8 ---------------- */
  function q8() {
    const edges = [120, 189, 258, 327, 396], F = [6, 14, 6, 4];
    const rows = []; let fac = 0;
    F.forEach((v, i) => { fac += v; rows.push({ lo: edges[i], hi: edges[i + 1], F: v, FAC: fac, pm: (edges[i] + edges[i + 1]) / 2, last: i === F.length - 1 }); });
    const n = S.sum(F), gm = S.groupedMedian(rows), gs = S.groupedStats(rows), cv = gs.sdPop / gs.mu * 100;
    const stmt = '<p><b>8.</b> Durante o desenvolvimento e testes de uma aplicação multiplataforma, foi monitorado o tempo de resposta do sistema (ms). A distribuição obtida é mostrada no histograma abaixo:</p>' +
      C.hist({ title: 'Tempo de resposta (ms)', rows, xLabel: 'Tempo de resposta (ms)', yLabel: 'Frequência', label: r => (r.last ? '(' + r.lo + ' ; ' + r.hi + ']' : (r.lo === 120 ? '[' + r.lo + ' ; ' + r.hi + ']' : '(' + r.lo + ' ; ' + r.hi + ']')) }) +
      '<p>a) Qual a mediana do tempo de resposta? &nbsp; e) Qual o coeficiente de variação do tempo de resposta?</p>';
    let body = '';
    body += U.part('', 'Tabela de frequência obtida do histograma',
      U.passoMedia(gs.sxf, n, gs.mu) + U.table({ caption: 'Tempo de resposta', head: ['Tempo (ms)', 'F', 'FAC', 'Pm (X)', 'X·F', 'F·(x−μ)²'], left: [0], rows: rows.map(r => [S.classLabel(r), r.F, r.FAC, f(r.pm, 1), f(r.pm * r.F, 1), f(r.F * Math.pow(r.pm - gs.mu, 2), 1)]), foot: ['Σ', n, '', '', f(gs.sxf, 1), f(gs.sq, 1)], hl: [gm.cls] }) +
      U.calc('Classe mediana (destacada): primeira classe cuja FAC alcança ΣF/2 = ' + gm.half + '.'));
    body += U.part('a', 'Mediana do tempo de resposta',
      U.formula([`\\dfrac{\\sum F}{2} = \\dfrac{${n}}{2} = ${gm.half}\\ \\Rightarrow\\ \\text{classe mediana: } ${edges[gm.cls]}\\,|\\!-\\!-\\,${edges[gm.cls + 1]}`,
        `Md = L + \\dfrac{\\left(\\frac{\\sum F}{2} - FAC_{ant}\\right)\\cdot h}{F} = ${gm.L} + \\dfrac{(${gm.half} - ${gm.facAnt})\\cdot ${gm.h}}{${gm.F}} = ${gm.L} + ${t((gm.half - gm.facAnt) * gm.h / gm.F, 2)} = ${t(gm.value, 2)}\\ \\text{ms}`], true) +
      U.answer(T(`Md = ${t(gm.value, 2)}\\ \\text{ms}`)) + U.gab('ok', 'Gabarito: Md = 233,36 ms'));
    body += U.part('e', 'Coeficiente de variação do tempo de resposta',
      U.formula([`\\mu = \\dfrac{\\sum (X\\cdot F)}{\\sum F} = \\dfrac{${t(gs.sxf, 1)}}{${n}} = ${t(gs.mu, 1)}\\ \\text{ms}`,
        `\\sigma = \\sqrt{\\dfrac{\\sum\\left[F\\cdot(x-\\mu)^2\\right]}{n}} = \\sqrt{\\dfrac{${t(gs.sq, 1)}}{${n}}} = \\sqrt{${t(gs.sq / n, 1)}} = ${t(gs.sdPop, 2)}\\ \\text{ms}`,
        `CV = \\dfrac{\\sigma}{\\mu} = \\dfrac{${t(gs.sdPop, 2)}}{${t(gs.mu, 1)}} = ${t(cv, 2)}\\%`], true) +
      U.answer(T(`CV = ${t(cv, 2)}\\%`)) + U.gab('approx', 'Gabarito: CV = 26,22%') +
      U.note(`Pelo método dos slides (ponto médio das classes, σ populacional) o resultado é ${f(cv, 2)}%; o gabarito traz 26,22% — diferença de ${f(Math.abs(cv - 26.22), 2)} ponto percentual, provavelmente por arredondamento ou por cálculo com dados brutos que não aparecem no enunciado.`, 'info'));
    return U.question(8, stmt, body);
  }

  EAP.sims[2] = {
    id: 2, title: 'Simulado 2 — Exercício Geral 2', date: '12/11/2026',
    toc: [['1', 'IC da proporção (90%)'], ['2', 'IC da média (95%)'], ['3', 'Tamanho da amostra (proporção)'], ['4', 'Tamanho da amostra (média)'], ['5', 'Qui-quadrado'], ['6', 'Correlação e regressão'], ['7', 'Curva normal'], ['8', 'Mediana e CV (histograma)']],
    render: () => [q1(), q2(), q3(), q4(), q5(), q6(), q7(), q8()].join('')
  };
})(window);
