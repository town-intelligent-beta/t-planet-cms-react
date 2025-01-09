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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 自定義插件來處理圖片渲染
const imagePlugin = {
  id: "customBarTopImage",
  afterDraw: (chart) => {
    const {
      ctx,
      scales: { x, y },
      data,
    } = chart;
    const imageSize = 30;

    // 確保有圖片數組
    if (!data.images) return;

    data.datasets[0].data.forEach((value, index) => {
      const xPos = x.getPixelForValue(index);
      const yPos = y.getPixelForValue(value);

      const imageSrc = data.images[index];
      if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
          ctx.drawImage(
            image,
            xPos - imageSize / 2,
            yPos - imageSize - 10,
            imageSize,
            imageSize
          );
        };
      }
    });
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
  const [images, setImages] = useState({});
  const [fiveLifeImages, setFiveLifeImages] = useState({});
  const [communityImages, setCommunityImages] = useState({});

  const imageNames = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
  ];
  const fiveLifeImageNames = [
    "morality",
    "intelligence",
    "physique",
    "social-skills",
    "aesthetics",
  ];
  const communityImageNames = [
    "people",
    "culture",
    "place",
    "specialty",
    "landscape",
  ];

  useEffect(() => {
    fetchTotalProjectWeight().then(setTotalProjectWeight);
    loadImages(imageNames, setImages);
    loadImages(fiveLifeImageNames, setFiveLifeImages);
    loadImages(communityImageNames, setCommunityImages);
  }, []);

  const loadImages = async (names, setState) => {
    const imagePromises = names.map((name) =>
      import(`../../../assets/weight/${name}.svg`).then((module) => ({
        key: `weight_${name}`,
        src: module.default,
      }))
    );

    const loadedImages = await Promise.all(imagePromises);
    const imagesObject = loadedImages.reduce((acc, image) => {
      acc[image.key] = image.src;
      return acc;
    }, {});

    setState(imagesObject);
  };

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
      },
    ],
    images: imageNames.map((name) => images[`weight_${name}`]),
  };

  const fiveData = {
    labels: Object.keys(fiveWeights),
    datasets: [
      {
        label: "人文地產景",
        data: Object.values(getMappedSdgData(fiveWeights)),
        backgroundColor: "#0075A1",
        borderWidth: 1,
      },
    ],
    images: fiveLifeImageNames.map((name) => fiveLifeImages[`weight_${name}`]),
  };

  const commData = {
    labels: Object.keys(commWeights),
    datasets: [
      {
        label: "德智體群美",
        data: Object.values(getMappedSdgData(commWeights)),
        backgroundColor: "#28a745",
        borderWidth: 1,
      },
    ],
    images: communityImageNames.map(
      (name) => communityImages[`weight_${name}`]
    ),
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
