import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import Account from "../../assets/Account.png";
import Index from "../../assets/index.svg";
import Cooperate from "../../assets/cooperate.svg";
import AI from "../../assets/ai.svg";
import News from "../../assets/news.svg";
import ContactUs from "../../assets/contact_us.svg";
import Logout from "../../assets/logout.svg";
import Exclamation from "../../assets/exclamation.svg";

// Register the scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    const fetchLineChartData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_HOST_URL_TPLANET}/dashboard/relational`
        );
        const data = await response.json();
        setLineChartData(data.content);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchPieChartData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_HOST_URL_TPLANET}/dashboard/weight`
        );
        const data = await response.json();

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

        setPieChartData(pieData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLineChartData();
    fetchPieChartData();
  }, []);

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
        ticks: {
          autoSkip: false,
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

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  const menuItems = [
    {
      id: "profile",
      icon: Account,
      title: "帳號資訊",
      link: "/backend/profile/username",
      show: true,
    },
    {
      id: "admin_index",
      icon: Index,
      title: "首頁管理",
      link: "/backend/admin_index",
      show: true,
    },
    {
      id: "sustainable",
      icon: Cooperate,
      title: "永續專案專區",
      link: "/backend/cms_agent",
      show: true,
    },
    {
      id: "llm",
      icon: AI,
      title: "AI Eval",
      link: "/backend/cms_ai_gpt",
      show: true,
    },
    {
      id: "cms_news_list",
      icon: News,
      title: "最新消息",
      link: "/backend/cms_news_list",
      show: true,
    },
    {
      id: "cms_contact_us",
      icon: ContactUs,
      title: "聯絡我們",
      link: "/backend/cms_contact_us",
      show: true,
    },
    {
      id: "logout",
      icon: Logout,
      title: "登出",
      onClick: handleLogout,
      show: true,
    },
    {
      id: "delete_account",
      icon: Exclamation,
      title: "刪除帳號",
      link: "/backend/admin_agent_accountDelete",
      show: true,
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="w-5/6 md:block">
          <div className="grid grid-cols-2 md:grid-cols-8 gap-2 my-10">
            {menuItems.map(
              (item) =>
                item.show && (
                  <div key={item.id} className="w-full">
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        className="block w-full bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-shadow no-underline"
                      >
                        <div className="flex justify-center items-center h-36">
                          <div className="text-center">
                            <img
                              src={item.icon}
                              alt=""
                              className="w-12 h-12 mx-auto"
                            />
                            <p className="mt-2 mb-0">{item.title}</p>
                          </div>
                        </div>
                      </button>
                    ) : (
                      <a
                        href={item.link}
                        className="block w-full bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-shadow no-underline"
                      >
                        <div className="flex justify-center items-center h-36">
                          <div className="text-center">
                            <img
                              src={item.icon}
                              alt=""
                              className="w-12 h-12 mx-auto"
                            />
                            <p className="mt-2 mb-0">{item.title}</p>
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 py-4 md:py-0">
          <h4 className="text-center mb-4">近三年永續指標對應關係人口比較</h4>
          <div className="h-64 flex items-center justify-center">
            {lineChartData && (
              <Line
                data={lineChartData}
                options={lineOptions}
                className="w-full"
              />
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3 py-4 md:py-0">
          <h4 className="text-center mb-4">當年度前三大累積指標</h4>
          <div className="h-64 flex items-center justify-center">
            {pieChartData && <Pie data={pieChartData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
