import CsrProject from "../../assets/csr-project.png";
import ProjectList from "./components/ProjectList";
import KpiList from "./components/KpiList";
import Chart from "./components/Chart";
import { useState, useEffect } from "react";
import { list_plans, plan_info } from "../../utils/Plan";
import { SITE_HOSTERS } from "../../utils/Config";

const KPI = () => {
  const [objListProjects, setObjListProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");

  // 初始化載入權重及專案
  const fetchProjects = async () => {
    try {
      const hosters =
        localStorage.getItem("jwt") &&
        localStorage.getItem("email") &&
        window.location.search.includes("status=loggedin")
          ? [localStorage.getItem("email")]
          : SITE_HOSTERS;

      const allProjects = [];
      const projectYears = new Set();

      for (const hoster of hosters) {
        const objListProjects = await list_plans(hoster, null);
        setObjListProjects(objListProjects);
        for (const uuid of objListProjects.projects) {
          const projectInfo = await plan_info(uuid); // 使用 await 等待 Promise 解決
          allProjects.push({ uuid, ...projectInfo });

          if (projectInfo.period) {
            const startYear = new Date(
              projectInfo.period.split("-")[0]
            ).getFullYear();
            if (!isNaN(startYear)) {
              projectYears.add(startYear);
            }
          }
        }
      }

      setProjects(allProjects);
      setFilteredProjects(allProjects);
      setYears(Array.from(projectYears).sort());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section>
      <div
        className="bg-cover mb-0 block bg-center h-48 md:h-80"
        style={{
          backgroundImage: `url(${CsrProject})`,
        }}
      ></div>
      <KpiList projects={objListProjects} />
      <Chart />
      <ProjectList
        projects={projects}
        filteredProjects={filteredProjects}
        setFilteredProjects={setFilteredProjects}
        years={years}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    </section>
  );
};

export default KPI;
