import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarChart = ({ elementId, title, data, backgroundColor, labels }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: title,
            data,
            backgroundColor,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // 清理 Chart 實例
    return () => {
      ctx?.chart?.destroy?.();
    };
  }, [data, backgroundColor, labels, title]);

  return <canvas id={elementId} ref={chartRef}></canvas>;
};

export default BarChart;
