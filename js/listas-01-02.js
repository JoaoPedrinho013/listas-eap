/* Listas 1 e 2 — Variáveis · Distribuição de frequência */
(function () {
  'use strict';
  const S = EAP.S, C = EAP.C, U = EAP.U, f = S.fmt, t = S.tex, T = U.tx;
  EAP.listas = EAP.listas || {};

  /* ---------- diagrama dos tipos de variável (slide 5) ---------- */
  function arvore(destaque) {
    const nodes = [
      ['VARIÁVEL', 320, 28, 130, 'r'], ['QUALITATIVA', 150, 100, 130, 'a'], ['QUANTITATIVA', 490, 100, 140, 'a'],
      ['NOMINAL', 70, 180, 100, 'b'], ['ORDINAL', 230, 180, 100, 'b'], ['DISCRETA', 410, 180, 100, 'b'], ['CONTÍNUA', 570, 180, 100, 'b']
    ];
    const lines = [[320, 44, 150, 84], [320, 44, 490, 84], [150, 116, 70, 164], [150, 116, 230, 164], [490, 116, 410, 164], [490, 116, 570, 164]];
    const ex = [['Sexo, religião, profissão', 70], ['Escolaridade, classe social', 230], ['Nº de filhos, de clientes', 410], ['Peso, estatura, salário', 570]];
    let s = lines.map(l => `<line class="axis" x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}"/>`).join('');
    nodes.forEach(n => { s += `<rect class="bar" x="${n[1] - n[3] / 2}" y="${n[2] - 16}" width="${n[3]}" height="32" rx="8"/><text class="vl" x="${n[1]}" y="${n[2] + 4}" text-anchor="middle">${n[0]}</text>`; });
    ex.forEach(e => { s += `<text class="tk" x="${e[1]}" y="226" text-anchor="middle">${e[0]}</text>`; });
    s += '<text class="sg" x="150" y="260" text-anchor="middle">rótulos / atributos</text><text class="sg" x="490" y="260" text-anchor="middle">medição ou contagem</text><text class="sg" x="70" y="206" text-anchor="middle">sem ordem</text><text class="sg" x="230" y="206" text-anchor="middle">com ordem</text><text class="sg" x="410" y="206" text-anchor="middle">nº finito de valores</text><text class="sg" x="570" y="206" text-anchor="middle">infinitos valores</text>';
    return `<figure class="chart"><svg viewBox="0 0 640 275" role="img" aria-label="Tipos de variáveis">${s}</svg></figure>`;
  }

  /* ================= LISTA 1 ================= */
  function l1() {
    let h = '';
    const q = (n, stmt, body) => U.question(n, stmt, body);
    const tipo = (v, k, why) => [v, k, why];

    h += q(1, '<p><b>1. Recall de sistemas embarcados em veículos.</b> Uma indústria automobilística identificou possíveis irregularidades no software de controle do chassi em todos os veículos do tipo perua fabricados em 2025. Por isso decidiu realizar um recall, solicitando a inspeção de 5.000 unidades, substituindo automaticamente os módulos com falhas.</p><p>a) População &nbsp; b) Amostra &nbsp; c) Variável de interesse</p>',
      U.part('', 'Conceitos: população, amostra e variável',
        U.calc('<b>População</b>: conjunto de elementos com características comuns, de interesse do estudo. <b>Amostra</b>: parte representativa da população. <b>Variável</b>: característica observada que pode assumir diferentes valores.') +
        U.table({ head: ['Item', 'Resposta'], left: [0, 1], rows: [
          ['a) População', 'Todos os veículos do tipo perua fabricados em 2025'],
          ['b) Amostra', 'As 5.000 unidades inspecionadas'],
          ['c) Variável de interesse', 'Existência de irregularidade (falha) no software de controle do chassi — <b>qualitativa nominal</b> (com falha / sem falha)']] }) +
        U.note('Parâmetros caracterizam a população (μ, σ, P); estimadores caracterizam a amostra (x̄, S, f). A inspeção das 5.000 unidades permite <i>estimar</i> a proporção de veículos com falha em toda a população.', 'info')));

    h += q(2, '<p><b>2. Estudo sobre perfil familiar de alunos de TI.</b> Pretende-se estudar o número de irmãos dos alunos do 9.º ano de uma Escola Secundária com ensino em Tecnologias da Informação. Foram questionados 60 alunos.</p><p>a) Amostra escolhida &nbsp; b) Variável em estudo e classificação &nbsp; c) População de estudo</p>',
      U.part('', 'Resolução',
        U.table({ head: ['Item', 'Resposta'], left: [0, 1], rows: [
          ['a) Amostra', 'Os 60 alunos questionados'],
          ['b) Variável e classificação', 'Número de irmãos — <b>quantitativa discreta</b> (contagem; valores 0, 1, 2, 3…)'],
          ['c) População', 'Todos os alunos do 9.º ano da Escola Secundária com ensino em Tecnologias da Informação']] })));

    const linhas = [
      tipo('a) Sexo do usuário', 'Qualitativa nominal', 'rótulo sem ordenação'),
      tipo('b) Sistema operativo (Windows, Linux, macOS)', 'Qualitativa nominal', 'rótulo sem ordenação'),
      tipo('c) Forma de pagamento (MBWay, Cartão, Transferência)', 'Qualitativa nominal', 'rótulo sem ordenação'),
      tipo('d) Lucro por ação de uma empresa de software (€)', 'Quantitativa contínua', 'medição em unidade monetária; infinitos valores num intervalo'),
      tipo('e) Plano de serviço (Básico, Intermédio, Premium)', 'Qualitativa ordinal', 'rótulo com ordenação (Básico &lt; Intermédio &lt; Premium)'),
      tipo('f) Número de clientes atendidos por um sistema', 'Quantitativa discreta', 'contagem')];
    h += q(3, '<p><b>3. Classifique as variáveis:</b> a) Sexo do usuário · b) Sistema operativo · c) Forma de pagamento · d) Lucro por ação (€) · e) Plano de serviço · f) Número de clientes atendidos.</p>',
      U.part('', 'Classificação', arvore() + U.table({ head: ['Variável', 'Classificação', 'Por quê'], left: [0, 1, 2], rows: linhas })));

    h += q(4, '<p><b>4. Dê exemplo das seguintes variáveis:</b> a) qualitativa nominal · b) qualitativa ordinal · c) quantitativa discreta · d) quantitativa contínua.</p>',
      U.part('', 'Exemplos (do contexto de TI)', U.table({ head: ['Tipo', 'Exemplo', 'Justificativa'], left: [0, 1, 2], rows: [
        ['a) Qualitativa nominal', 'Linguagem de programação principal (Java, Python, JavaScript)', 'rótulos, não há ordenação'],
        ['b) Qualitativa ordinal', 'Nível de certificação (Júnior, Pleno, Sênior)', 'rótulos com ordenação'],
        ['c) Quantitativa discreta', 'Número de bugs encontrados por módulo', 'contagem (0, 1, 2…)'],
        ['d) Quantitativa contínua', 'Tempo de resposta de um servidor (ms)', 'medição; qualquer valor num intervalo']] })));
    return h;
  }

  /* ================= LISTA 2 ================= */
  const CERT = '3 4 4 5 1 5 3 4 5 2 4 5 3 4 4 4 5 5 4 1 4 5 4 2 5 4 2 4 4 4 5 5 3 4 5 5 2 4 3 4 5 4 3 5 4 4 3 5 4 3 4 3 5 3 4 4 3 5 3 3'.split(' ').map(Number);
  const RT = '160 166 160 161 150 162 160 165 167 160 164 155 152 163 160 155 155 169 151 164 168 162 161 168 163 156 173 160 155 168 161 154 161 156 172 153 157 156 158 161'.split(' ').map(Number);
  const RAM = '10 10 10 20 30 30 30 30 30 30 30 40 40 40 40 40 40 50 50 60 60 60 60 60 60 70 70 70 70 80 80 80 80 80 90 100 100 100 100 110 110 110 110 110 120 120 130 130 130 140 140 150 160 160 170 170 170 170 170 170 180 180 180 180 180 190 190 190'.split(' ').map(Number);

  function tabClasses(cl, caption, unit, dec) {
    return U.table({ caption, head: [unit, 'F', 'F%', 'FAC', 'Pm (X)'], left: [0], rows: cl.rows.map(r => [S.classLabel(r, dec || 0), r.F, f(r.Fp), r.FAC, f(r.pm, dec ? 1 : 1)]), foot: ['Σ', cl.n, '100,00', '', ''] });
  }
  function passos(cl) {
    return U.formula([`K = \\sqrt{n} = \\sqrt{${cl.n}} = ${t(cl.Kraw, 2)} \\;\\Rightarrow\\; K = ${cl.K}\\ \\text{classes}`, `AT = (>\\text{valor}) - (<\\text{valor}) = ${cl.max} - ${cl.min} = ${cl.AT}`, `h = \\dfrac{AT}{K} = \\dfrac{${cl.AT}}{${cl.K}} = ${t(cl.hraw, 2)} \\;\\Rightarrow\\; h = ${cl.h}\\ \\text{(arredondado para cima)}`], true);
  }

  function l2() {
    let h = '';
    const nome = { 1: 'Júnior', 2: 'Pleno', 3: 'Sênior', 4: 'Especialista', 5: 'Master' };
    const tab = S.freqDiscrete(CERT, [1, 2, 3, 4, 5]), n = CERT.length;
    h += U.question(1, '<p><b>1.</b> Candidatos a uma vaga de Analista de Sistemas responderam a um questionário; uma das perguntas foi o nível de certificação (1 – Júnior, 2 – Pleno, 3 – Sênior, 4 – Especialista, 5 – Master). Faça um sumário através da distribuição de frequência:</p>' + U.dataBox(CERT, true),
      U.part('', 'Distribuição de frequência (variável qualitativa ordinal)',
        U.calc(`F = nº de vezes que o valor se repete; F% = F ÷ n × 100 (n = ${n}).`) +
        U.formula('F\\% = \\dfrac{F}{\\sum F}\\times 100') +
        U.table({ caption: 'Nível de certificação', head: ['Nível (X)', 'F', 'F%'], left: [0], rows: tab.map(r => [`${r.x} — ${nome[r.x]}`, r.F, f(r.Fp)]), foot: ['Σ', n, '100,00'] }) +
        C.col({ title: 'Nível de certificação dos candidatos', cats: tab.map(r => nome[r.x]), vals: tab.map(r => r.F), xLabel: 'Certificação', yLabel: 'F' }) +
        U.calc(`Moda (dado qualitativo): <b>Mo = ${nome[4]}</b> (F = ${tab[3].F}).`)));

    const c2 = S.classes(RT);
    h += U.question(2, '<p><b>2.</b> Tempos de resposta (ms) de servidores em ambiente de teste. Faça uma distribuição de frequência com intervalo de classe.</p>' + U.dataBox(RT, true),
      U.part('', 'Distribuição de frequência com intervalo de classe',
        passos(c2) + tabClasses(c2, 'Tempos de resposta dos servidores', 'Tempo (ms)') +
        C.hist({ title: 'Tempos de resposta dos servidores', rows: c2.rows, xLabel: 'Tempo (ms)', yLabel: 'F' }) +
        U.note(`A última classe é fechada nos dois lados (/-----/) para incluir o maior valor (${c2.max}). Com h = ${c2.h} e K = ${c2.K}, as classes cobrem de ${c2.min} a ${c2.rows[c2.K - 1].hi}.`, 'info')));

    const c3 = S.classes(RAM);
    h += U.question(3, '<p><b>3.</b> Consumo de memória RAM (MB) pelos processos de um servidor na última semana. Faça uma distribuição de frequência com intervalo de classe.</p>' + U.dataBox(RAM, true),
      U.part('', 'Distribuição de frequência com intervalo de classe',
        passos(c3) + tabClasses(c3, 'Consumo de memória RAM', 'Consumo (MB)') +
        C.hist({ title: 'Consumo de memória RAM dos processos', rows: c3.rows, xLabel: 'Consumo (MB)', yLabel: 'F' }) +
        U.note(`Temos n = ${c3.n} dados; o número de classes segue a regra K = √n. Se o professor aceitar outra escolha (por exemplo K = 6 com h = 30), as frequências mudam, mas o procedimento é o mesmo.`, 'info')));

    const pcts = [16.32, 27.35, 21.43, 19.03, 15.87], N = 2000, ed = [2, 3, 4, 5, 6, 7];
    const fs = pcts.map(p => Math.round(p * N / 100)), mais4 = pcts[2] + pcts[3] + pcts[4];
    h += U.question(4, '<p><b>4.</b> A distribuição abaixo apresenta o tempo de experiência (anos) de 2.000 desenvolvedores de uma empresa de tecnologia.</p>' + U.table({ head: ['Tempo de experiência (anos)', 'Frequência %'], rows: pcts.map((p, i) => [`${ed[i]} /----- ${ed[i + 1]}`, f(p)]) }) +
      '<p>A. Quantidade de desenvolvedores em cada faixa. &nbsp; B. % com experiência ≥ 4 anos. &nbsp; C. Quantos têm menos de 3 anos?</p>',
      U.part('A', 'Quantidade em cada faixa', U.formula('F = \\dfrac{F\\%}{100}\\times n') +
        U.table({ caption: 'Tempo de experiência', head: ['Anos', 'F%', 'Cálculo', 'F'], rows: pcts.map((p, i) => [`${ed[i]} /----- ${ed[i + 1]}`, f(p), `${f(p)}/100 × 2.000 = ${f(p * N / 100, 1)}`, fs[i]]), foot: ['Σ', '100,00', '', S.sum(fs)] }) +
        U.answer(fs.join(' – ')) + U.gab('ok', 'Resultado esperado: 326 – 547 – 429 – 381 – 317')) +
      U.part('B', 'Desenvolvedores com ≥ 4 anos', U.formula(`F\\%_{\\ge 4} = ${t(pcts[2])} + ${t(pcts[3])} + ${t(pcts[4])} = ${t(mais4)}\\%`) + U.answer(f(mais4) + '%') + U.gab('ok', 'Resultado esperado: 56,33%')) +
      U.part('C', 'Desenvolvedores com menos de 3 anos', U.calc('Menos de 3 anos = primeira classe (2 /----- 3).') + U.answer(String(fs[0]) + ' desenvolvedores') + U.gab('ok', 'Resultado esperado: 326')));
    return h;
  }

  EAP.listas[1] = { id: 1, title: 'Lista 1 — Variáveis', sub: 'População e amostra / classificação de variáveis', toc: [['1', 'Recall — população e amostra'], ['2', 'Perfil familiar de alunos'], ['3', 'Classifique as variáveis'], ['4', 'Dê exemplos']], render: l1 };
  EAP.listas[2] = { id: 2, title: 'Lista 2 — Distribuição de frequência', sub: 'Qualitativa, com intervalo de classe e a partir de F%', toc: [['1', 'Nível de certificação'], ['2', 'Tempo de resposta (classes)'], ['3', 'Memória RAM (classes)'], ['4', 'Desenvolvedores (F%)']], render: l2 };
})();
