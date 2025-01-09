import { useState, useEffect } from "react";
import { list_plans, plan_info } from "../../../utils/Plan";
import { Container, Row, Col, Form, Card } from "react-bootstrap";

const getWeightMeta = async (name) => {
  const response = await fetch(
    `${import.meta.env.VITE_HOST_URL_TPLANET}/weight/get/${name}`
  );
  return await response.json();
};

const ProjectList = () => {
  const [allWeights, setAllWeights] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const WEIGHTS = ["SDGs", "CommunityDevelopment", "FiveWaysofLife"];
  const SITE_HOSTERS = [
    "forus999@gmail.com",
    "secondhome2023.1@gmail.com",
    "mickeypeng@tpwl.org",
    "400@gmail.com",
  ];

  // 初始化載入權重及專案
  useEffect(() => {
    const fetchWeightsAndProjects = async () => {
      try {
        const weights = [];
        for (let i = 0; i < WEIGHTS.length; i++) {
          const weightData = await getWeightMeta(WEIGHTS[i]);
          weights.push(...weightData.content.categories);
        }
        setAllWeights(weights);

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

    fetchWeightsAndProjects();
  }, []);

  // 篩選專案
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

  // 生成專案卡片的 HTML
  const generateProjectBlock = (project) => {
    const budgetDisplay = project.is_budget_revealed
      ? `新台幣 ${project.budget} 元`
      : "(暫不揭露)";

    return (
      <Col md={4} key={project.uuid} className="mb-4">
        <Card className="kpi-card" style={{ borderRadius: "20px" }}>
          <div
            className="img-fluid bg-cover shadow"
            style={{
              backgroundImage: `url(${
                project.img
                  ? import.meta.env.VITE_HOST_URL_TPLANET + project.img
                  : "#"
              })`,
              height: "200px",
              borderRadius: "18px",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          ></div>
          <Card.Body>
            <h5>{project.name}</h5>
            <p>永續企業: {project.project_a}</p>
            <p>地方團隊: {project.project_b}</p>
            <p>
              期間:{" "}
              {project.period ? project.period.split("-").join(" ~ ") : ""}
            </p>
            <p>預算: {budgetDisplay}</p>
            <Row>{generateSDGsHTML(project.weight)}</Row>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  // 生成 SDGs HTML
  const generateSDGsHTML = (weight) => {
    if (!weight) return null;

    return weight.split(",").map((w, index) => {
      if (parseInt(w) === 1 && allWeights[index]) {
        const sdgInfo = allWeights[index];
        return (
          <Col key={index} className="p-2" style={{ width: "13%" }}>
            <a
              href="#"
              className="stretched-link"
              style={{ position: "relative", textDecoration: "none" }}
            >
              <img className="w-100" src={sdgInfo.thumbnail} alt="" />
            </a>
          </Col>
        );
      }
      return null;
    });
  };

  return (
    <div className="bg-light py-4">
      <Container>
        <Row className="justify-content-center">
          <h3 className="text-center fw-bold">專案列表</h3>
        </Row>
        <Row className="justify-content-end mb-3">
          <Form.Control
            as="select"
            id="year_filter"
            className="custom-select"
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option value="all">全部</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Control>
        </Row>
        <Row id="project_container">
          {filteredProjects.map((project) => generateProjectBlock(project))}
        </Row>
      </Container>
    </div>
  );
};

export default ProjectList;
