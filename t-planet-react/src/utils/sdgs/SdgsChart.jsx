import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { list_plan_tasks, getProjectWeight } from "../Plan";
import { getTaskWeight } from "../Task";

// 註冊 ChartJS 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// SDG 映射常量
const SDG_MAPPINGS = {
  "sdgs-18": "人",
  "sdgs-19": "文",
  "sdgs-20": "地",
  "sdgs-21": "產",
  "sdgs-22": "景",
  "sdgs-23": "德",
  "sdgs-24": "智",
  "sdgs-25": "體",
  "sdgs-26": "群",
  "sdgs-27": "美",
};

// 顏色配置
const SDG_COLORS = [
  "#e5243b",
  "#DDA63A",
  "#4C9F38",
  "#C5192D",
  "#FF3A21",
  "#26BDE2",
  "#FCC30B",
  "#A21942",
  "#FD6925",
  "#DD1367",
  "#FD9D24",
  "#BF8B2E",
  "#3F7E44",
  "#0A97D9",
  "#56C02B",
  "#00689D",
  "#19486A",
  "#0075A1",
  "#0075A1",
  "#0075A1",
  "#0075A1",
  "#0075A1",
  "#0075A1",
  "#0075A1",
  "#0075A1",
  "#0075A1",
  "#0075A1",
];

const SDGChart = ({ projectUuid, title = "專案指標累積", id }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        // 獲取任務數據
        const parentTasks = await list_plan_tasks(projectUuid, 1);
        // 計算權重
        let weight;
        if (id === "project") {
          weight = await getProjectWeight(parentTasks.tasks);
        } else {
          weight = await getTaskWeight(parentTasks.tasks);
        }

        // 處理數據用於圖表
        const processedData = prepareChartData(weight);
        setChartData(processedData);
      } catch (error) {
        console.error("Error processing project data:", error);
      }
    };

    if (projectUuid) {
      fetchAndProcessData();
    }
  }, [projectUuid]);

  // 數據轉換函數
  const mapSdgData = (data) => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      const mappedKey = SDG_MAPPINGS[key] || key;
      acc[mappedKey] = value;
      return acc;
    }, {});
  };

  // 過濾零值數據
  const filterZeroValues = (data) => {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== "0") {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  // 準備圖表數據
  const prepareChartData = (rawData) => {
    const mappedData = mapSdgData(rawData);
    const filteredData = filterZeroValues(mappedData);
    const labels = Object.keys(filteredData);
    const values = Object.values(filteredData);
    const colors = SDG_COLORS.slice(0, labels.length);
    const datasetTitle = id === "project" ? "專案指標累積" : "永續指標";

    return {
      labels,
      datasets: [
        {
          label: datasetTitle,
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
        },
      ],
    };
  };

  // 圖表配置
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: { size: 16 },
        position: "bottom",
        padding: { bottom: 50 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "關係人口數",
        },
        ticks: {
          precision: 0,
        },
        grid: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "指標",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  if (!chartData) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-96">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SDGChart;
