 document.addEventListener("DOMContentLoaded", () => {

    const ctx = document.getElementById("graficoLinha").getContext("2d");

    var dataSolvedCalls = [12, 19, 3, 5, 2];//Matrizes de exemplo
    var dataCreatedCalls = [5, 6, 13, 15, 17];

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            datasets: [{
                label: "Chamados Resolvidos",
                data: dataSolvedCalls,
                borderColor: "#2f5cf3",
                tension: 0.4,
                pointBackgroundColor: "#2f5cf3",
            },
            {
                label: "Chamados criados",
                data: dataCreatedCalls,
                borderColor: "#ca502e",
                tension: 0.4,
                pointBackgroundColor: "rgba(227, 93, 56, 0.1)"
            }
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20
                }
            },
        }
    });

});