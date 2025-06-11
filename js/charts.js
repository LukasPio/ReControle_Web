// POR ENQUANTO NÃO ESTÁ SENDO USADO, MAS É BOM MANTER O CÓDIGO PARA FUTURAS REFERÊNCIAS
//
/*const ctx = document.getElementById("graficoLinha").getContext("2d");
const grafico = new Chart(ctx, {
  type: "line",
  data: {
    labels: Array.from({ length: 60 }, (_, i) => `${(i + 1) * 1000}`),
    datasets: [
      {
        label: "Chamados",
        data: Array.from({ length: 60 }, () => Math.random() * 100),
        fill: true,
        backgroundColor: "rgba(47, 92, 243, 0.1)",
        borderColor: "#2f5cf3",
        tension: 0.4,
        pointBackgroundColor: "#2f5cf3",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw.toFixed(2);
          },
        },
      },
    },
  },
});
*/
