/* print.js — botões "Baixar PDF das perguntas" (PDF original do professor) e "Imprimir esta página" */
(function () {
  'use strict';
  var host = document.querySelector('.page-title');
  if (!host) return;
  var page = document.body.getAttribute('data-page');
  var NOMES = ['Variáveis', 'Distribuição de frequência', 'Representação gráfica', 'Média', 'Mediana', 'Moda', 'Dispersão', 'Boxplot', 'Distribuição normal',
    'Amostra para estimar a média', 'Amostra para estimar a proporção', 'IC da média', 'IC da proporção', 'Correlação', 'Regressão', 'Teste do qui-quadrado'];
  var bar = document.createElement('div');
  bar.className = 'toolbar';
  bar.innerHTML = '<a class="btn" id="btn-pdf-q" target="_blank" rel="noopener">⬇ Baixar PDF das perguntas</a><button type="button" class="btn ghost" id="btn-print">🖨 Imprimir esta página</button>';
  host.appendChild(bar);
  var a = document.getElementById('btn-pdf-q');
  function atualiza() {
    var n = parseInt((location.hash || '#1').slice(1), 10) || 1;
    if (page === 'simulados') { n = Math.min(Math.max(n, 1), 2); a.href = 'pdf/simulado-' + n + '.pdf' ; }
    else { n = Math.min(Math.max(n, 1), 16); a.href = 'pdf/lista-' + (n < 10 ? '0' : '') + n + '.pdf' ; }
  }
  atualiza();
  window.addEventListener('hashchange', atualiza);
  document.getElementById('btn-print').addEventListener('click', function () { window.print(); });
})();
