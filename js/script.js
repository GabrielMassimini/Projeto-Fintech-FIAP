// Dashboard MassPay: menu mobile e gráficos.
// Os valores exibidos são fictícios; a integração com o backend fica para uma próxima etapa.

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  configurarMenuMobile();
  inicializarGraficoFluxoDeCaixa();
  inicializarGraficoDistribuicaoDeGastos();
});

// ---------- MENU MOBILE ----------

function configurarMenuMobile() {
  const botaoMenu = document.getElementById('botao-menu');
  const sobreposicao = document.getElementById('sobreposicao');

  botaoMenu.addEventListener('click', abrirMenu);
  sobreposicao.addEventListener('click', fecharMenu);

  // Esc fecha o menu, como em qualquer painel lateral
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharMenu();
  });
}

function abrirMenu() {
  document.getElementById('barra-lateral').classList.add('barra-lateral--aberta');
  document.getElementById('sobreposicao').classList.remove('escondido');
  document.getElementById('botao-menu').setAttribute('aria-expanded', 'true');
}

function fecharMenu() {
  document.getElementById('barra-lateral').classList.remove('barra-lateral--aberta');
  document.getElementById('sobreposicao').classList.add('escondido');
  document.getElementById('botao-menu').setAttribute('aria-expanded', 'false');
}

// ---------- GRÁFICOS ----------

function inicializarGraficoFluxoDeCaixa() {
  const canvas = document.getElementById('grafico-fluxo');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const gradienteEntrada = ctx.createLinearGradient(0, 0, 0, 260);
  gradienteEntrada.addColorStop(0, 'rgba(34,197,94,0.15)');
  gradienteEntrada.addColorStop(1, 'rgba(34,197,94,0)');

  const gradienteSaida = ctx.createLinearGradient(0, 0, 0, 260);
  gradienteSaida.addColorStop(0, 'rgba(237,20,91,0.12)');
  gradienteSaida.addColorStop(1, 'rgba(237,20,91,0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['01 Mai', '05 Mai', '10 Mai', '15 Mai', '20 Mai', '25 Mai', '30 Mai'],
      datasets: [
        {
          label: 'Entradas',
          data: [1200, 4700, 4700, 5300, 6800, 7200, 7850],
          borderColor: '#22c55e',
          backgroundColor: gradienteEntrada,
          fill: true,
          tension: 0.45,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2.5
        },
        {
          label: 'Saídas',
          data: [300, 800, 1400, 1900, 2400, 2900, 3169],
          borderColor: '#ED145B',
          backgroundColor: gradienteSaida,
          fill: true,
          tension: 0.45,
          pointBackgroundColor: '#ED145B',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { font: { family: 'Poppins', size: 12 }, usePointStyle: true, padding: 20, color: '#4b5563' }
        },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#111827',
          bodyColor: '#6b7280',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 14,
          titleFont: { family: 'Poppins', weight: '600', size: 13 },
          bodyFont: { family: 'Poppins', size: 12 },
          callbacks: {
            label: c => ` ${c.dataset.label}: R$ ${c.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { family: 'Poppins', size: 11 }, color: '#9ca3af', padding: 8 }
        },
        y: {
          grid: { color: '#f3f4f6' },
          border: { display: false },
          ticks: {
            font: { family: 'Poppins', size: 11 },
            color: '#9ca3af',
            padding: 10,
            callback: v => 'R$ ' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
          }
        }
      }
    }
  });
}

function inicializarGraficoDistribuicaoDeGastos() {
  const canvas = document.getElementById('grafico-rosca');
  if (!canvas) return;

  new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Outros'],
      datasets: [{
        data: [35, 25, 15, 10, 8, 7],
        backgroundColor: ['#ED145B', '#60a5fa', '#facc15', '#4ade80', '#c084fc', '#94a3b8'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#111827',
          bodyColor: '#6b7280',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 12,
          titleFont: { family: 'Poppins', weight: '600' },
          bodyFont: { family: 'Poppins' },
          callbacks: { label: c => ` ${c.label}: ${c.raw}%` }
        }
      }
    }
  });
}
