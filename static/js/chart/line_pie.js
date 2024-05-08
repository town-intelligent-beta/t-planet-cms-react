fetch(HOST_URL_TPLANET_DAEMON + "/dashboard/relational")
  .then((response) => response.json())
  .then((data) => {
    const lineData = {
      labels: data.content.labels,
      datasets: data.content.datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.borderColor,
        fill: dataset.fill,
      })),
    };
    const lineOptions = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "指標",
            font: {
              size: 18,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: "關係人口數",
            font: {
              size: 18,
            },
          },
        },
      },
    };
    const lineChart = new Chart(document.getElementById("lineChart"), {
      type: "line",
      data: lineData,
      options: lineOptions,
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

fetch(HOST_URL_TPLANET_DAEMON + "/dashboard/weight")
  .then((response) => response.json())
  .then((data) => {
    const pieData = {
      labels: data?.content?.labels,
      datasets: [
        {
          data: data?.content?.datasets[0]?.data,
          color: "#fff",
          align: "end",
          borderWidth: 2,
          backgroundColor: ["#215869"],
        },
      ],
    };
    const pieChart = new Chart(document.getElementById("pieChart"), {
      type: "pie",
      data: pieData,
    });
    pieChart.canvas.parentNode.style.width = "300px";
    pieChart.canvas.parentNode.style.display = "flex";
    pieChart.canvas.parentNode.style.alignItems = "center";
    pieChart.canvas.parentNode.style.flexDirection = "column";
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
