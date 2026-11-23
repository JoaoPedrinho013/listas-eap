/* Listas 14 a 16 — Correlação · Regressão · Teste do qui-quadrado */
(function () {
  'use strict';
  const S = EAP.S, C = EAP.C, U = EAP.U, L = EAP.L, f = S.fmt, t = S.tex, T = U.tx;
  EAP.listas = EAP.listas || {};

  function forca(r) { const a = Math.abs(r); return (r > 0 ? 'positiva' : 'negativa') + (a >= 0.9 ? ' muito forte' : a >= 0.7 ? ' forte' : a >= 0.4 ? ' moderada' : ' fraca'); }
  function tabCorr(xs, ys, xn, yn) {
    const co = S.correlacao(xs, ys);
    return { co, html: U.table({ head: [xn, yn, '(X−X̄)', '(Y−Ȳ)', '(X−X̄)·(Y−Ȳ)', '(X−X̄)²', '(Y−Ȳ)²'], rows: xs.map((x, i) => [x, ys[i], f(co.dx[i], 2), f(co.dy[i], 2), f(co.dx[i] * co.dy[i], 2), f(co.dx[i] ** 2, 2), f(co.dy[i] ** 2, 2)]), foot: ['∑ = ' + f(S.sum(xs), 0), '∑ = ' + f(S.sum(ys), 1), '0', '0', f(co.sxy, 2), f(co.sxx, 2), f(co.syy, 2)] }) };
  }

  /* ================= LISTA 14 ================= */
  function l14() {
    let h = '';
    const x1 = [6, 11, 15, 21, 27], y1 = [6, 9, 6, 17, 12], c1 = tabCorr(x1, y1, 'X', 'Y'), rg1 = S.regressao(x1, y1);
    h += U.question(1, '<p><b>1.</b> Sistema computacional: X = nº de funcionalidades implementadas num módulo; Y = nº de erros registrados nos testes.</p>' + U.table({ head: ['Observação', 1, 2, 3, 4, 5], rows: [['X', ...x1], ['Y', ...y1]], left: [0] }) + '<p>a) Diagrama de dispersão. b) O que ele indica? c) Calcule e interprete o coeficiente de correlação amostral.</p>',
      U.part('a', 'Diagrama de dispersão', C.scatter({ title: 'Funcionalidades × erros', xs: x1, ys: y1, line: { a: rg1.a, b: rg1.b }, xLabel: 'Funcionalidades implementadas (X)', yLabel: 'Erros registrados (Y)' })) +
      U.part('b', 'Interpretação do gráfico', U.calc('Os pontos sobem da esquerda para a direita (linha de tendência crescente), mas não ficam alinhados: existe uma <b>correlação positiva</b>, não perfeita — quanto mais funcionalidades, tendem a ocorrer mais erros.')) +
      U.part('c', 'Coeficiente de correlação', U.formula(['r = \\dfrac{COV}{\\sigma(x)\\cdot\\sigma(y)}', `COV = \\dfrac{\\sum(X-\\bar{X})(Y-\\bar{Y})}{n}\\qquad \\sigma(x)=\\sqrt{\\dfrac{\\sum(x-\\bar{X})^2}{n}}\\qquad \\sigma(y)=\\sqrt{\\dfrac{\\sum(y-\\bar{Y})^2}{n}}`], true) +
        U.calc(`X̄ = ${f(c1.co.mx, 0)}; Ȳ = ${f(c1.co.my, 0)}; n = 5`) + '<div class="tbl-wrap">' + c1.html + '</div>' +
        U.formula([`COV = \\dfrac{${t(c1.co.sxy, 2)}}{5} = ${t(c1.co.cov, 2)}\\qquad \\sigma(x) = ${t(c1.co.sx, 2)}\\qquad \\sigma(y) = ${t(c1.co.sy, 2)}`, `r = \\dfrac{${t(c1.co.cov, 2)}}{${t(c1.co.sx, 2)}\\cdot ${t(c1.co.sy, 2)}} = ${t(c1.co.r, 4)}`], true) +
        U.answer(T(`r = ${t(c1.co.r * 100, 0)}\\%`)) + U.gab('ok', 'Esperado: 69%') + U.calc(`Interpretação: correlação ${forca(c1.co.r)} (r = ${f(c1.co.r, 2)}).`)));
    const x2 = [12, 16, 18, 20, 28, 30, 40, 48, 50, 54], y2 = [7.2, 7.4, 7.0, 6.5, 6.6, 6.7, 6.0, 5.6, 6.0, 5.5], c2 = tabCorr(x2, y2, 'Orçamento (X)', '% manut. (Y)'), rg2 = S.regressao(x2, y2), n = 10;
    const covA = c2.co.sxy / (n - 1), sxA = Math.sqrt(c2.co.sxx / (n - 1)), syA = Math.sqrt(c2.co.syy / (n - 1));
    h += U.question(2, '<p><b>2.</b> Orçamento mensal para infraestrutura de TI (mil R$) e % gasta em manutenção e suporte, em 10 empresas.</p>' + U.table({ head: ['Empresa', ...x2.map((_, i) => i + 1)], rows: [['Orçamento (mil R$)', ...x2], ['% em manutenção', ...y2.map(v => f(v, 1))]], left: [0] }) + '<p>a) Gráfico de dispersão. b) Covariância da amostra. c) Tipo de correlação e justificativa. d) Coeficiente de correlação.</p>',
      U.part('a', 'Gráfico de dispersão', C.scatter({ title: 'Orçamento × % em manutenção', xs: x2, ys: y2, line: { a: rg2.a, b: rg2.b }, xLabel: 'Orçamento mensal (mil R$)', yLabel: '% em manutenção' })) +
      U.part('b', 'Covariância da amostra', U.calc(`X̄ = ${f(c2.co.mx, 1)}; Ȳ = ${f(c2.co.my, 2)}; n = 10`) + '<div class="tbl-wrap">' + c2.html + '</div>' +
        U.formula(`COV = \\dfrac{\\sum(X-\\bar{X})(Y-\\bar{Y})}{n-1} = \\dfrac{${t(c2.co.sxy, 2)}}{9} = ${t(covA, 2)}`) + U.answer(T(`COV = ${t(covA, 2)}`)) + U.gab('ok', 'Esperado: −9,53')) +
      U.part('c', 'Tipo de correlação', U.calc('Quando o orçamento aumenta, o percentual gasto em manutenção diminui: os pontos descem da esquerda para a direita. Correlação <b>negativa</b>.') + U.answer('Correlação negativa')) +
      U.part('d', 'Coeficiente de correlação', U.formula([`\\sigma(x) = \\sqrt{\\dfrac{${t(c2.co.sxx, 2)}}{9}} = ${t(sxA, 2)}\\qquad \\sigma(y) = \\sqrt{\\dfrac{${t(c2.co.syy, 2)}}{9}} = ${t(syA, 3)}`, `r = \\dfrac{COV}{\\sigma(x)\\cdot\\sigma(y)} = \\dfrac{${t(covA, 2)}}{${t(sxA, 2)}\\cdot ${t(syA, 3)}} = ${t(c2.co.r, 4)}`], true) +
        U.answer(T(`r = ${t(c2.co.r * 100, 0)}\\%`)) + U.gab('ok', 'Esperado: −94%') + U.calc(`Correlação ${forca(c2.co.r)}.`) +
        U.note('Como a covariância esperada (−9,53) divide por n − 1, os desvios também usam n − 1. Os slides dividem tudo por n; o valor de r é o mesmo nos dois casos.', 'info')));
    return h;
  }

  /* ================= LISTA 15 ================= */
  function l15() {
    let h = '';
    const a1 = [2020, 2021, 2022, 2023, 2024, 2025], y1 = [100000, 105000, 106000, 110000, 120000, 132000], x1 = [0, 1, 2, 3, 4, 5];
    const r1 = L.regBloco(x1, y1, [{ x: 6, label: 'Procura em 2026' }], 'X (anos desde 2020)', 'Procura por acessos', 'acessos', a1);
    h += U.question(1, '<p><b>1.</b> Procura por acessos ao sistema educacional nos últimos 6 anos: ' + a1.map((a, i) => a + ' = ' + f(y1[i], 0)).join(' · ') + '. Utilizando regressão linear, estime a procura em 2026.</p>',
      U.part('', 'Previsão de uma série temporal', U.calc('Série temporal: transformamos o ano em X começando de 0 (2020 = 0, …, 2025 = 5); 2026 corresponde a X = 6.') + r1.html + U.gab('ok', 'Esperado: 133.066')));
    const m = ['Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto'], y2 = [800, 1000, 1280, 1520, 1740, 2100];
    const r2 = L.regBloco(x1, y2, [{ x: 6, label: 'Setembro' }, { x: 7, label: 'Outubro' }], 'X (meses desde março)', 'Nº de utilizadores', 'utilizadores', m);
    h += U.question(2, '<p><b>2.</b> Usuários ativos de um sistema de reservas: ' + m.map((a, i) => a + ' = ' + f(y2[i], 0)).join(' · ') + '. Com regressão linear, estime o número de usuários em setembro e outubro.</p>',
      U.part('', 'Previsão de uma série temporal', U.calc('Março = 0, …, Agosto = 5; setembro = 6 e outubro = 7.') + r2.html + U.gab('ok', 'Esperado: setembro = 2.303 · outubro = 2.559')));
    const x3 = [200, 180, 165, 210, 215, 240, 260, 300], y3 = [172, 160, 150, 180, 185, 200, 220, 250];
    const r3 = L.regBloco(x3, y3, [{ x: 250, label: 'Produção com 250' }], 'Nº de programadores (X)', 'Produção (milhões de un.)', 'milhões de unidades');
    h += U.question(3, '<p><b>3.</b> Relação entre nº de programadores e produção mensal de módulos (milhões de unidades): X = 200, 180, 165, 210, 215, 240, 260, 300; Y = 172, 160, 150, 180, 185, 200, 220, 250. Estime a produção com 250 programadores.</p>',
      U.part('', 'Regressão linear simples', r3.html + U.gab('ok', 'Esperado: 211 milhões de unidades')));
    return h;
  }

  /* ================= LISTA 16 ================= */
  function qui(tab, linhas, colunas, rotL, rotC, crit, alpha, nome) {
    const r = S.quiQuadrado(tab); let h = '';
    h += U.table({ caption: nome, head: [rotL, ...colunas, 'Total'], left: [0], rows: tab.map((row, i) => [linhas[i], ...row, r.rt[i]]), foot: ['Total', ...r.ct, r.N] });
    h += U.formula(['F(E) = \\dfrac{(\\text{total da linha})\\cdot(\\text{total da coluna})}{\\text{total geral}}', '\\chi^2_{(c)} = \\sum \\dfrac{\\left[F(O)-F(E)\\right]^2}{F(E)}'], true);
    h += U.table({ head: ['', rotL, rotC, 'F(O)', 'F(E)', 'χ² (c)'], rows: r.cells.map(c => ['', linhas[c.i], colunas[c.j], c.fo, f(c.fe, 2), f(c.chi, 3)]), foot: ['Σ', '–', '–', r.N, f(S.sum(r.cells.map(c => c.fe)), 0), f(r.chi, 3)] });
    h += U.formula([`GL = (\\text{nº de colunas}-1)\\cdot(\\text{nº de linhas}-1) = (${r.C}-1)\\cdot(${r.R}-1) = ${r.gl}`, `\\text{N/C} = ${f(100 - alpha, 1)}\\% \\Rightarrow \\alpha = ${f(alpha, 1)}\\% \\Rightarrow \\chi^2_{(tab)} = ${t(crit, 3)}`]);
    h += C.chi({ title: 'Teste do qui-quadrado — N/C de ' + f(100 - alpha, 1) + '%', gl: r.gl, crit, calc: r.chi });
    const dep = r.chi > crit;
    h += U.calc(`χ²(c) = ${f(r.chi, 3)} ${dep ? '&gt;' : '&lt;'} ${f(crit, 3)}: está na região ${dep ? 'crítica (RC)' : 'de aceitação (RA)'}.`);
    h += U.answer(dep ? 'As variáveis são DEPENDENTES (existe relação)' : 'As variáveis são INDEPENDENTES (não existe relação)');
    return { html: h, r, dep };
  }
  function l16() {
    let h = '';
    const q1 = qui([[23, 15, 13], [48, 23, 20], [17, 8, 18]], ['Windows', 'Linux', 'MacOS'], ['Web', 'Mobile', 'Data Science / IA'], 'Sistema operacional', 'Categoria', 9.488, 5, 'Sistema operacional × categoria do projeto');
    h += U.question(1, '<p><b>1.</b> O sistema operacional do desenvolvedor está relacionado à categoria do projeto que ele desenvolve? Teste de qui-quadrado com α = 5% (valor crítico 9,488).</p>' + U.table({ head: ['Sistema operacional', 'Web (Front/Back)', 'Mobile (App)', 'Data Science / IA'], left: [0], rows: [['Windows', 23, 15, 13], ['Linux (Ubuntu/Debian)', 48, 23, 20], ['MacOS', 17, 8, 18]] }), U.part('', 'Teste do qui-quadrado', q1.html + U.gab('ok', 'Valor crítico informado: 9,488')));
    const q2 = qui([[80, 55, 70], [65, 85, 45]], ['Masculino', 'Feminino'], ['Java', 'Python', 'Javascript'], 'Gênero', 'Linguagem', 5.991, 5, 'Gênero × linguagem principal');
    h += U.question(2, '<p><b>2.</b> Existe dependência entre o gênero e a linguagem de programação principal dos alunos? Teste com N/C de 95% (valor crítico 5,991).</p>' + U.table({ head: ['Gênero', 'Java', 'Python', 'Javascript'], left: [0], rows: [['Masculino', 80, 55, 70], ['Feminino', 65, 85, 45]] }), U.part('', 'Teste do qui-quadrado', q2.html));
    const q3 = qui([[289, 27], [737, 83]], ['AWS (Amazon)', 'Azure (Microsoft)'], ['Sucesso (200 OK)', 'Erro (500)'], 'Provedor cloud', 'Status', 3.841, 5, 'Provedor cloud × status de resposta');
    h += U.question(3, '<p><b>3.</b> Existe relação entre a origem do acesso (nuvem) e o status de resposta do servidor? N/C de 95% (valor crítico 3,841).</p>' + U.table({ head: ['Provedor cloud', 'Sucesso (200 OK)', 'Erro (500)'], left: [0], rows: [['AWS (Amazon)', 289, 27], ['Azure (Microsoft)', 737, 83]] }), U.part('', 'Teste do qui-quadrado', q3.html));
    const XP = [11, 12, 16, 13, 15, 2, 13, 8, 5, 6, 13, 10, 6, 6, 14, 12, 16, 18, 5, 5, 18, 15, 19, 14, 17, 15, 15, 2, 13, 8, 5, 6, 13, 10, 23, 7, 17, 4, 6, 6, 14, 12, 16, 18, 14, 16, 14, 5, 9, 11];
    const HO = [1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
    const cl = S.classes(XP), ho = cl.rows.map(r => 0), ph = cl.rows.map(r => 0);
    XP.forEach((x, i) => { cl.rows.forEach((r, k) => { if (x >= r.lo && (r.last ? x <= r.hi : x < r.hi)) (HO[i] ? ho : ph)[k]++; }); });
    const labs = cl.rows.map(r => S.classLabel(r, 0)), crit4 = 14.449;
    const q4 = qui(cl.rows.map((_, k) => [ho[k], ph[k]]), labs, ['Home Office', 'Presencial/Híbrido'], 'Anos de XP', 'Modelo de trabalho', crit4, 2.5, 'Anos de experiência × modelo de trabalho');
    h += U.question(4, '<p><b>4.</b> Existe relacionamento entre a senioridade (anos de experiência) e o modelo de trabalho preferido? Faça a tabela de contingência (agrupando os anos de XP em classes) e use α = 2,5%.</p>' + U.dataBox(XP.map((x, i) => x + (HO[i] ? ' HO' : ' P/H')), true),
      U.part('', 'Tabela de contingência e teste',
        U.calc(`Variável quantitativa agrupada em classes: n = 50 ⇒ K = √50 ≈ 7 classes; AT = ${cl.max} − ${cl.min} = ${cl.AT}; h = ${cl.AT}/7 = 3. (HO = Home Office; P/H = Presencial/Híbrido.)`) + q4.html +
        U.gab('ok', 'χ² calculado = 10,10 (o “valor crítico 10,10” da lista é, na verdade, esse χ²c)') +
        U.note(`Com GL = ${q4.r.gl} e α = 2,5% o χ² tabelado é 14,449 (fora da tabela dos slides, que traz até GL = 8 sem a coluna de 2,5%). Como 10,10 &lt; 14,449, não há evidência de relação entre senioridade e modelo de trabalho.`, 'info')));
    return h;
  }

  EAP.listas[14] = { id: 14, title: 'Lista 14 — Correlação', sub: 'Diagrama de dispersão, covariância e coeficiente r', toc: [['1', 'Funcionalidades × erros'], ['2', 'Orçamento × manutenção']], render: l14 };
  EAP.listas[15] = { id: 15, title: 'Lista 15 — Regressão', sub: 'Equações normais, previsão e série temporal', toc: [['1', 'Procura em 2026'], ['2', 'Usuários setembro/outubro'], ['3', 'Programadores × produção']], render: l15 };
  EAP.listas[16] = { id: 16, title: 'Lista 16 — Teste do qui-quadrado', sub: 'Tabela de contingência, F(E), χ², RA/RC', toc: [['1', 'SO × categoria'], ['2', 'Gênero × linguagem'], ['3', 'Cloud × status'], ['4', 'Anos de XP × modelo']], render: l16 };
})();
