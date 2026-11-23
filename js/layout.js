/* layout.js — cabeçalho e rodapé compartilhados */
(function () {
  'use strict';
  var page = document.body.getAttribute('data-page') || '';
  var header =
    '<header class="site-header"><div class="wrap">' +
    '<a class="brand" href="index.html" aria-label="Início"><span class="logo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20c3 0 4-14 9-14s6 14 9 14"/><path d="M2 20h20"/></svg></span><span>Estatística Aplicada<small>EAP · listas e simulados</small></span></a>' +
    '<nav class="main" aria-label="Principal">' +
    '<a href="index.html"' + (page === 'home' ? ' class="on"' : '') + '>Home</a>' +
    '<div class="dd' + (page === 'listas' ? ' on' : '') + '"><button type="button" aria-haspopup="true">Listas ▾</button><div class="menu">' +
    '<a href="listas.html#1">Lista 1<span>Variáveis</span></a><a href="listas.html#2">Lista 2<span>Distribuição de frequência</span></a><a href="listas.html#3">Lista 3<span>Representação gráfica</span></a><a href="listas.html#4">Lista 4<span>Média</span></a><a href="listas.html#5">Lista 5<span>Mediana</span></a><a href="listas.html#6">Lista 6<span>Moda</span></a><a href="listas.html#7">Lista 7<span>Dispersão</span></a><a href="listas.html#8">Lista 8<span>Boxplot</span></a><a href="listas.html#9">Lista 9<span>Distribuição normal</span></a><a href="listas.html#10">Lista 10<span>Amostra p/ estimar a média</span></a><a href="listas.html#11">Lista 11<span>Amostra p/ estimar a proporção</span></a><a href="listas.html#12">Lista 12<span>IC da média</span></a><a href="listas.html#13">Lista 13<span>IC da proporção</span></a><a href="listas.html#14">Lista 14<span>Correlação</span></a><a href="listas.html#15">Lista 15<span>Regressão</span></a><a href="listas.html#16">Lista 16<span>Teste do qui-quadrado</span></a></div></div>' +
    '<div class="dd' + (page === 'simulados' ? ' on' : '') + '"><button type="button" aria-haspopup="true">Simulados ▾</button><div class="menu">' +
    '<a href="simulados.html#1">Simulado 1<span>Exercício Geral 1 · 25/09/2026</span></a>' +
    '<a href="simulados.html#2">Simulado 2<span>Exercício Geral 2 · 12/11/2026</span></a></div></div>' +
    '</nav></div></header>';
  var footer = '<footer class="site"><div class="wrap">Estatística Aplicada — resoluções no formato do Prof. Carlos Cesar Cavalcante Dias: tabelas, fórmulas, substituição e gráficos. Todos os números são calculados a partir dos dados do enunciado.</div></footer>';
  var h = document.getElementById('site-header'), f = document.getElementById('site-footer');
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;
  // dropdown também por clique/toque
  document.addEventListener('click', function (e) {
    var dd = e.target.closest ? e.target.closest('.dd') : null;
    document.querySelectorAll('.dd.open').forEach(function (d) { if (d !== dd) d.classList.remove('open'); });
    if (dd && e.target.closest('button')) dd.classList.toggle('open');
  });
})();
