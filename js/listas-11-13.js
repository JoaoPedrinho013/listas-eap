/* Listas 11 a 13 — Amostra para a proporção · IC da média · IC da proporção */
(function () {
  'use strict';
  const S = EAP.S, C = EAP.C, U = EAP.U, L = EAP.L, f = S.fmt, t = S.tex, T = U.tx;
  EAP.listas = EAP.listas || {};
  const gabN = (v) => U.gab('ok', 'Esperado: ' + v);

  /* ================= LISTA 11 ================= */
  function l11() {
    let h = '';
    const q1 = L.nProp(2.58, 0.55, 0.04, null, 99), n1 = Math.floor(q1.nc);
    h += U.question(1, '<p><b>1.</b> Amostra aleatória de 100 usuários de um sistema web: 55% aprovam uma nova funcionalidade. A amostra é suficiente para estimar a proporção populacional com N/C de 99% e erro máximo de 4%? Justifique.</p>',
      U.part('', 'Tamanho da amostra', q1.html + U.answer(`Não — seriam necessários ${n1}; a amostra tem 100`) + gabN('n = 1029') +
        U.formula(`\\text{Prova real: } e = Z\\cdot\\sqrt{\\dfrac{f\\%\\cdot q\\%}{n}} = 2{,}58\\cdot\\sqrt{\\dfrac{0{,}55\\cdot 0{,}45}{100}} = ${t(2.58 * Math.sqrt(.55 * .45 / 100) * 100, 2)}\\% > 4\\%`) +
        U.calc('Justificativa: com n = 100 o erro seria bem maior que 4%.')));
    const e2 = 2.05 * Math.sqrt(.37 * .63 / 250);
    h += U.question(2, '<p><b>2.</b> Em 250 execuções de um software, 37% apresentaram falhas não críticas. Qual o erro da estimativa da proporção populacional com N/C de 96%?</p>',
      U.part('', 'Erro da estimativa', U.calc('N/C = 96% ⇒ área 0,4800 ⇒ <b>Z = 2,05</b>.') + U.formula(`e = Z\\cdot\\sqrt{\\dfrac{f\\%\\cdot q\\%}{n}} = 2{,}05\\cdot\\sqrt{\\dfrac{0{,}37\\cdot 0{,}63}{250}} = ${t(e2, 4)}`) + U.answer(T(`e = ${t(e2 * 100, 2)}\\%`)) + U.gab('approx', 'Esperado: 6,25% (arredondamento)')));
    const q3 = L.nProp(1.96, 0.2, 0.02, 4000, 95), n3 = Math.ceil(q3.n), e3 = 1.96 * Math.sqrt(.2 * .8 / n3) * Math.sqrt((4000 - n3) / 3999);
    h += U.question(3, '<p><b>3.</b> Percentual de módulos com erro num lote de 4.000 componentes gerados automaticamente. Historicamente 20% têm defeito. Tamanho da amostra para erro máximo de 0,02 e N/C de 95%? Justifique com base no erro da estimativa.</p>',
      U.part('', 'Tamanho da amostra com população finita', q3.html + U.answer(T(`n = ${n3}\\ \\text{componentes}`)) + gabN('n = 1111') +
        U.formula(`\\text{Prova real: } e = Z\\cdot\\sqrt{\\dfrac{f\\%\\cdot q\\%}{n}}\\cdot\\sqrt{\\dfrac{N-n}{N-1}} = 1{,}96\\cdot\\sqrt{\\dfrac{0{,}2\\cdot 0{,}8}{${n3}}}\\cdot\\sqrt{\\dfrac{4.000-${n3}}{3.999}} = ${t(e3 * 100, 2)}\\%`)));
    const q4 = L.nProp(1.96, 57 / 150, 0.08, null, 95);
    h += U.question(4, '<p><b>4.</b> Aceitação de um novo sistema: 57 dos 150 usuários entrevistados pretendem utilizá-lo. A amostra é suficiente para estimar a proporção com erro máximo de 0,08 e N/C de 95%?</p>',
      U.part('', 'Tamanho da amostra', U.calc('f% = 57/150 = 0,38 (38%).') + q4.html + U.answer(`Sim — necessários ${Math.round(q4.nc)}; a amostra tem 150`) + gabN('n = 141')));
    const q5a = L.nProp(2.33, 0.7, 0.03, null, 98), q5b = L.nProp(2.33, 0.5, 0.03, null, 98);
    h += U.question(5, '<p><b>5.</b> Percentual de clientes que usam apenas o plano básico, com erro máximo de 0,03 e N/C de 98%. a) Tamanho da amostra sabendo que historicamente 70% usam só o plano básico. b) Tamanho da amostra sem histórico da proporção.</p>',
      U.part('a', 'Com histórico (f% = 70%)', q5a.html + U.answer(T(`n = ${t(Math.round(q5a.nc), 0)}`)) + gabN('n = 1267')) +
      U.part('b', 'Sem histórico (pior caso: f% = q% = 50%)', U.calc('Sem informação prévia usa-se f% = 50%, que maximiza o produto f%·q%.') + q5b.html + U.answer(T(`n = ${t(Math.round(q5b.nc), 0)}`)) + gabN('n = 1508')));
    return h;
  }

  /* ================= LISTA 12 ================= */
  function l12() {
    let h = '';
    const r1 = L.icMedia(110, 10, 10, 95, 1.96, 'Tempo médio de resposta — N/C de 95%', 'ms');
    h += U.question(1, '<p><b>1.</b> Tempo de resposta de um servidor web em 10 requisições (n = 10): média 110 ms, desvio padrão 10 ms. Intervalo de confiança de 95% para o tempo médio.</p>', U.part('', 'IC da média', r1.html + U.answer(T(`IC = (${t(r1.lo, 2)}\\ ;\\ ${t(r1.hi, 2)})\\ \\text{ms}`)) + gabN('103,80 a 116,19')));
    const d2 = [7, 7, 8, 9, 9, 9, 10, 11, 11, 11, 12, 13, 13, 14, 15, 15], dt2 = U.dispTable(d2, 'Tempos de execução', 's'), xb2 = dt2.mu, s2 = Math.sqrt(dt2.sq / 15);
    const r2 = L.icMedia(xb2, s2, 16, 95, 1.96, 'Tempo médio de execução — N/C de 95%', 's');
    h += U.question(2, '<p><b>2.</b> Amostra de 16 testes automatizados do login (tempos em s): 7 – 7 – 8 – 9 – 9 – 9 – 10 – 11 – 11 – 11 – 12 – 13 – 13 – 14 – 15 – 15. IC de 95% para o tempo médio.</p>',
      U.part('', 'IC da média', '<div class="tbl-wrap">' + dt2.html + '</div>' + U.formula([`\\bar{x} = \\dfrac{${t(dt2.sxf, 0)}}{16} = ${t(xb2, 3)}`, `S = \\sqrt{\\dfrac{\\sum F(x-\\bar{x})^2}{n-1}} = \\sqrt{\\dfrac{${t(dt2.sq, 2)}}{15}} = ${t(s2, 2)}`], true) + r2.html + U.answer(T(`IC = (${t(r2.lo, 2)}\\ ;\\ ${t(r2.hi, 2)})\\ \\text{s}`)) + gabN('9,59 ; 12,16')));

    function viaClasses(raw, opt, cap, unit, z, ttl) {
      const cl = S.classes(raw, opt), tg = L.tabAgrup(cl, cap, unit, 0), n = raw.length;
      const r = L.icMedia(tg.g.mu, tg.g.sdSamp, n, 95, z, ttl, unit.replace(/ \(.*/, ''));
      const rr = L.icMedia(S.mean(raw), S.sdSamp(raw), n, 95, z, ttl, '');
      return { cl, tg, r, rr, html: U.calc(`n = ${n}; amplitude das classes h = ${cl.h}.`) + tg.html + U.formula([`\\bar{x} = \\dfrac{${t(tg.g.sxf, 0)}}{${n}} = ${t(tg.g.mu, 2)}\\qquad S = \\sqrt{\\dfrac{${t(tg.g.sq, 2)}}{${n - 1}}} = ${t(tg.g.sdSamp, 2)}`], true) + r.html };
    }
    const d3 = '250 265 267 269 271 275 277 281 283 284 287 289 291 293 293 298 301 303 306 307 307 309 311 315 319 322 324 328 335 339'.split(' ').map(Number);
    const v3 = viaClasses(d3, { K: 5, h: 20 }, 'Tempo de resposta dos logs', 'Tempo (ms)', 1.96, 'Tempo médio de resposta — N/C de 95%');
    h += U.question(3, '<p><b>3.</b> 30 logs de acesso ao banco de dados (tempos de resposta em ms). Faça uma tabela com classes de amplitude 20 ms, construa o IC da média e determine se satisfaz a especificação de 300 ms (α = 5%).</p>' + U.dataBox(d3, true),
      U.part('', 'IC da média com dados em classes', v3.html + U.answer(T(`IC = (${t(v3.r.lo, 2)}\\ ;\\ ${t(v3.r.hi, 2)})\\ \\text{ms}`)) + U.gab('approx', 'Esperado: (288,57 ; 304,77) ms') +
        U.calc(`Como 300 ms <b>está dentro</b> do intervalo, a média pode ser 300 ms: o sistema satisfaz a especificação.`) +
        U.note(`Usando os 30 valores originais (x̄ = ${f(S.mean(d3), 2)}; S = ${f(S.sdSamp(d3), 2)}) o IC é (${f(v3.rr.lo, 2)} ; ${f(v3.rr.hi, 2)}), mais próximo do esperado; a diferença para o cálculo por classes vem do uso do ponto médio.`, 'info')));
    const d4 = '6.0 0.0 2.0 6.5 5.0 3.5 4.0 2.5 5.0 8.0 7.0 8.5 6.0 4.5 0.0 6.5 7.0 4.5 2.0 5.0 5.5 5.0 7.0 1.5 5.0 6.0 7.0'.split(' ').map(Number);
    const v4 = viaClasses(d4, { K: 5, h: 2 }, 'Qualidade de código dos módulos', 'Pontuação', 1.96, 'Pontuação média de qualidade — N/C de 95%');
    h += U.question(4, '<p><b>4.</b> Pontuações de qualidade de código de 27 módulos. Tabela com classes de amplitude 2 e IC de 95% para a média.</p>' + U.dataBox(d4, true),
      U.part('', 'IC da média com dados em classes', v4.html + U.answer(T(`IC = (${t(v4.r.lo, 2)}\\ ;\\ ${t(v4.r.hi, 2)})`)) + U.gab('diff', 'Esperado: (3,88 ; 5,64)') +
        U.note(`Não consegui reproduzir exatamente o resultado esperado. Pelos dados originais: x̄ = ${f(S.mean(d4), 2)}; S = ${f(S.sdSamp(d4), 2)}; IC = (${f(v4.rr.lo, 2)} ; ${f(v4.rr.hi, 2)}). Vale conferir com o professor como foram montadas as classes.`)));
    const ed = [15, 18, 21, 24, 27, 30, 33], F = [8, 9, 12, 15, 7, 4], rows = F.map((v, i) => ({ lo: ed[i], hi: ed[i + 1], F: v, pm: (ed[i] + ed[i + 1]) / 2, last: i === 5 })), tg = L.tabAgrup({ rows }, 'Tempo de conclusão das tarefas', 'Classe (h)');
    const r5 = L.icMedia(tg.g.mu, tg.g.sdSamp, tg.g.n, 95, 1.96, 'Tempo médio de conclusão — N/C de 95%', 'horas');
    h += U.question(5, '<p><b>5.</b> Tempos estimados para tarefas de um projeto de software (horas), em classes: 15–18 (8), 18–21 (9), 21–24 (12), 24–27 (15), 27–30 (7), 30–33 (4). IC de 95% para o tempo médio.</p>',
      U.part('', 'IC da média com dados em classes', tg.html + U.formula(`\\bar{x} = \\dfrac{${t(tg.g.sxf, 1)}}{${tg.g.n}} = ${t(tg.g.mu, 2)}\\qquad S = \\sqrt{\\dfrac{${t(tg.g.sq, 2)}}{${tg.g.n - 1}}} = ${t(tg.g.sdSamp, 2)}`, true) + r5.html +
        U.answer(T(`IC = (${t(r5.lo, 2)}\\ ;\\ ${t(r5.hi, 2)})\\ \\text{h}`)) + U.gab('diff', 'Esperado: (21,98 ; 24,08)') + U.note('Pelos pontos médios das classes a média é 23,37 h; o resultado esperado está centrado em 23,03 h, e não consegui reproduzi-lo. Mantive o cálculo pelo método dos slides.')));
    return h;
  }

  /* ================= LISTA 13 ================= */
  function l13() {
    let h = '';
    const a = L.icProp(93, 100, 95, 1.96, 'Proporção de módulos estáveis — N/C de 95%');
    h += U.question(1, '<p><b>1.</b> Em 100 módulos testados, 93 funcionaram por mais de 500 h sem falhas. IC de 95% para a proporção de módulos estáveis.</p>', U.part('', 'IC da proporção', a.html + U.answer(T(`IC = (${t(a.lo, 2)}\\ ;\\ ${t(a.hi, 2)})`)) + gabN('(0,88 ; 0,98)')));
    const b = L.icProp(100, 400, 95, 1.96, 'Domicílios que usam SaaS — N/C de 95%');
    h += U.question(2, '<p><b>2.</b> De 400 domicílios, 25% usam sistemas alugados (SaaS). Com α = 5%, IC da proporção.</p>', U.part('', 'IC da proporção', b.html + U.answer(T(`IC = (${t(b.lo * 100, 0)}\\%\\ ;\\ ${t(b.hi * 100, 0)}\\%)`)) + gabN('(21% ; 29%)')));
    const c = L.icProp(180, 300, 95, 1.96, 'Usuários favoráveis ao novo sistema — N/C de 95%');
    h += U.question(3, '<p><b>3.</b> De 300 usuários, 180 são favoráveis a um novo sistema informatizado. Proporção da população favorável com N/C de 95%.</p>', U.part('', 'IC da proporção', c.html + U.answer(T(`IC = (${t(c.lo, 2)}\\ ;\\ ${t(c.hi, 2)})`)) + gabN('(0,54 ; 0,66)')));
    const d = L.icProp(1700, 5000, 97, 2.17, 'Usuários com computador pessoal — N/C de 97%', 1500000);
    h += U.question(4, '<p><b>4.</b> População de 1.500.000 usuários; amostra de 5.000, dos quais 1.700 possuem computador pessoal. Estime a quantidade de pessoas na população com N/C de 97%.</p>',
      U.part('', 'IC da proporção e conversão para pessoas', d.html + U.answer(`${f(d.lo * 1500000, 0)} a ${f(d.hi * 1500000, 0)} pessoas`) + U.gab('approx', 'Esperado: 490.500 a 529.500') +
        U.note('O resultado esperado corresponde a Z ≈ 1,96 (N/C de 95%). Para 97%, Z = 2,17 (área 0,4850), que dá o intervalo acima.')));
    const F = [8, 12, 15, 18, 10], n5 = S.sum(F), x5 = F[0] + F[1];
    const e = L.icProp(x5, n5, 95, 1.96, 'Usuários com menos de 21 h semanais — N/C de 95%');
    h += U.question(5, '<p><b>5.</b> Tempo semanal (h) de utilização de um sistema: 15–18 (8), 18–21 (12), 21–24 (15), 24–27 (18), 27–30 (10). IC de 95% para a proporção que utiliza o sistema <b>menos de 21 horas</b> semanais.</p>',
      U.part('', 'IC da proporção', U.table({ head: ['Classe (h)', 'F'], left: [0], rows: [['15 /----- 18', 8], ['18 /----- 21', 12], ['21 /----- 24', 15], ['24 /----- 27', 18], ['27 /-----/ 30', 10]], foot: ['Σ', n5] }) +
        U.calc(`Menos de 21 h = as duas primeiras classes: ${F[0]} + ${F[1]} = ${x5} de ${n5}.`) + e.html + U.answer(T(`IC = (${t(e.lo * 100, 0)}\\%\\ ;\\ ${t(e.hi * 100, 0)}\\%)`)) + gabN('(20% ; 43%)')));
    const g = L.icProp(860, 2000, 95, 1.96, 'Preferência pelo sistema Y — N/C de 95%', 8000000);
    h += U.question(6, '<p><b>6.</b> De 2.000 usuários consultados, 860 preferem o sistema Y. Com N/C de 95%, estime quantos dos 8 milhões de usuários utilizariam o sistema Y.</p>',
      U.part('', 'IC da proporção e conversão para usuários', g.html + U.answer(`${f(g.lo * 8000000, 0)} a ${f(g.hi * 8000000, 0)} usuários`) + U.gab('approx', 'Esperado: 3.280.000 a 3.600.000 (limites arredondados para 41% e 45%)')));
    return h;
  }

  EAP.listas[11] = { id: 11, title: 'Lista 11 — Amostra para estimar a proporção', sub: 'Tamanho da amostra, erro da estimativa e população finita', toc: [['1', 'Usuários web (99%)'], ['2', 'Erro da estimativa'], ['3', 'Lote de 4.000'], ['4', 'Novo sistema'], ['5', 'Plano básico']], render: l11 };
  EAP.listas[12] = { id: 12, title: 'Lista 12 — Intervalo de confiança da média', sub: 'IC = x̄ ± Z·S/√n', toc: [['1', 'Servidor web'], ['2', 'Testes automatizados'], ['3', 'Logs (classes de 20 ms)'], ['4', 'Qualidade de código'], ['5', 'Tarefas do projeto']], render: l12 };
  EAP.listas[13] = { id: 13, title: 'Lista 13 — Intervalo de confiança da proporção', sub: 'IC = f% ± Z·√(f%·q%/n)', toc: [['1', 'Módulos estáveis'], ['2', 'SaaS'], ['3', 'Sistema de água'], ['4', 'Computador pessoal'], ['5', 'Horas semanais'], ['6', 'Sistema Y']], render: l13 };
})();
