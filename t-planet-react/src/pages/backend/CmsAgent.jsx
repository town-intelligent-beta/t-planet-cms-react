import { useState, useEffect } from "react";
import Add from "../../assets/add.svg";
import ProjectList from "./components/ProjectList";
import { list_plans, plan_info } from "../../utils/Plan";
import { Form } from "react-bootstrap";

export default function CmsAgent() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");

  const fetchProjects = async () => {
    try {
      const allProjects = [];
      const projectYears = new Set();

      const objListProjects = await list_plans(
        localStorage.getItem("email"),
        null
      );

      if (objListProjects == undefined) {
        return;
      }
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

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (year === "all") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((project) => {
        if (!project.period) return false;
        const startYear = new Date(project.period.split("-")[0]).getFullYear();
        return startYear === parseInt(year);
      });
      setFilteredProjects(filtered);
    }
  };

  return (
    <section>
      <div className="container">
        <div className="row mt-md-5 mb-4 align-items-center">
          <div className="col-md-10 d-none d-md-block mb-4">
            <h4 className="bg-nav px-5 py-3 m-0 font-weight-normal">
              專案列表
            </h4>
          </div>
          <div className="col-md-2 d-none d-md-block mb-4">
            <Form.Select
              id="year_filter"
              className="w-full"
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="all">全部</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-12">
            <button
              id="add_c_project"
              className="btn btn-block btn-outline-secondary py-3 w-full d-flex align-items-center justify-content-center"
              style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
            >
              <img src={Add} alt="新增永續專案" className="mr-2 w-4" />
              新增永續專案
            </button>
          </div>
        </div>

        <div id="project_list" className="row">
          <ProjectList filteredProjects={filteredProjects} />
        </div>
      </div>
    </section>
  );
}
