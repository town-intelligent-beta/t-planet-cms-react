import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { fetchTotalProjectWeight } from "../../../utils/KpiApi";
import { Row, Col, Container } from "react-bootstrap";
import User from "../../../assets/weight/1.svg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const imagePlugin = {
  id: "customBarTopImage",
  beforeDatasetsDraw: (chart) => {
    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    if (!meta.data || meta.data.length === 0) return;

    const loadAndDrawImage = (src, x, y) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const size = 25;
          ctx.drawImage(img, x - size / 2, y - size - 5, size, size);
          resolve();
        };
        img.src = src;
      });
    };

    const drawImages = async () => {
      const promises = dataset.images.map((src, i) => {
        const { x, y } = meta.data[i];
        return loadAndDrawImage(src, x, y);
      });
      await Promise.all(promises);
    };

    drawImages();
  },
};

const createChartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
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
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: title,
      font: { size: 24 },
      padding: {
        bottom: 50,
      },
    },
  },
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
});

const getMappedSdgData = (data) => {
  return data;
};

const SDGsChart = () => {
  const [totalProjectWeight, setTotalProjectWeight] = useState({});

  const images = [
    "/src/assets/weight/1.svg",
    "/src/assets/weight/2.svg",
    "/src/assets/weight/3.svg",
    "/src/assets/weight/4.svg",
    "/src/assets/weight/5.svg",
    "/src/assets/weight/6.svg",
    "/src/assets/weight/7.svg",
    "/src/assets/weight/8.svg",
    "/src/assets/weight/9.svg",
    "/src/assets/weight/10.svg",
    "/src/assets/weight/11.svg",
    "/src/assets/weight/12.svg",
    "/src/assets/weight/13.svg",
    "/src/assets/weight/14.svg",
    "/src/assets/weight/15.svg",
    "/src/assets/weight/16.svg",
    "/src/assets/weight/17.svg",
  ];

  const fiveLifeImage = [
    "/src/assets/weight/morality.svg",
    "/src/assets/weight/intelligence.svg",
    "/src/assets/weight/physique.svg",
    "/src/assets/weight/social-skills.svg",
    "/src/assets/weight/aesthetics.svg",
  ];

  const communityImage = [
    "/src/assets/weight/people.svg",
    "/src/assets/weight/culture.svg",
    "/src/assets/weight/place.svg",
    "/src/assets/weight/specialty.svg",
    "/src/assets/weight/landscape.svg",
  ];

  useEffect(() => {
    fetchTotalProjectWeight().then(setTotalProjectWeight);
  }, []);

  // Filter weights for SDGs (1-17)
  const sdgsWeights = Object.fromEntries(
    Object.entries(totalProjectWeight).filter(
      ([key]) => parseInt(key.substring(5, 7)) <= 17
    )
  );

  // Filter weights for Five (18-22)
  const fiveWeights = Object.fromEntries(
    Object.entries(totalProjectWeight).filter(([key]) => {
      const num = parseInt(key.substring(5, 7));
      return num >= 18 && num <= 22;
    })
  );

  // Filter weights for Comm (23-28)
  const commWeights = Object.fromEntries(
    Object.entries(totalProjectWeight).filter(([key]) => {
      const num = parseInt(key.substring(5, 7));
      return num >= 23 && num <= 28;
    })
  );

  const sdgsData = {
    labels: Object.keys(sdgsWeights),
    datasets: [
      {
        label: "永續發展指標",
        data: Object.values(sdgsWeights),
        backgroundColor: [
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
        ],
        borderWidth: 1,
        images: images,
      },
    ],
  };

  const fiveData = {
    labels: Object.keys(fiveWeights),
    datasets: [
      {
        label: "人文地產景",
        data: Object.values(getMappedSdgData(fiveWeights)),
        backgroundColor: "#0075A1",
        borderWidth: 1,
        // images: fiveLifeImageNames.map(
        //   (name) => fiveLifeImages[`weight_${name}`]
        // ),
        images: fiveLifeImage,
      },
    ],
  };

  const commData = {
    labels: Object.keys(commWeights),
    datasets: [
      {
        label: "德智體群美",
        data: Object.values(getMappedSdgData(commWeights)),
        backgroundColor: "#28a745",
        borderWidth: 1,
        // images: communityImageNames.map(
        //   (name) => communityImages[`weight_${name}`]
        // ),
        images: communityImage,
      },
    ],
  };

  return (
    <div className="py-4">
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <h3 className="text-center fw-bold">關係人口數</h3>
          </Col>
        </Row>
        <Row className="mt-md-4 justify-content-center">
          <Col md={12} className="text-center">
            <div className="chart-container" style={{ height: "400px" }}>
              <Bar
                options={createChartOptions("永續發展指標")}
                data={sdgsData}
                plugins={[imagePlugin]}
              />
            </div>
          </Col>
        </Row>
        <Row className="mt-md-4 justify-content-center">
          <Col md={6} className="text-center">
            <div className="chart-container" style={{ height: "400px" }}>
              <Bar
                options={createChartOptions("人文地產景")}
                data={fiveData}
                plugins={[imagePlugin]}
              />
            </div>
          </Col>
          <Col md={6} className="text-center">
            <div className="chart-container" style={{ height: "400px" }}>
              <Bar
                options={createChartOptions("德智體群美")}
                data={commData}
                plugins={[imagePlugin]}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SDGsChart;
