import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import generateSdgsIcons from "../../../utils/sdgs/SdgsImg";

const ProjectList = ({
  projects,
  filteredProjects,
  setFilteredProjects,
  years,
  selectedYear,
  setSelectedYear,
}) => {
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
          <Link
            to={`/content/${project.uuid}`}
            className="no-underline text-black"
          >
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
              <div className="flex flex-wrap gap-1">
                {generateSdgsIcons(project.weight)}
              </div>
            </Card.Body>
          </Link>
        </Card>
      </Col>
    );
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
