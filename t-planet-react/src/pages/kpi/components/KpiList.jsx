import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  plan_info,
  list_plan_tasks,
  getProjectWeight,
} from "../../../utils/Plan";
import SDGsCircle from "../../../assets/SDGs-circle.png";
import { fetchTotalProjectWeight } from "../../../utils/KpiApi";

const KPIList = ({ projects }) => {
  const [images, setImages] = useState({});
  const [fiveLifeImages, setFiveLifeImages] = useState({});
  const [communityImages, setCommunityImages] = useState({});
  const [totalProjectWeight, setTotalProjectWeight] = useState({});
  const [projectCounts, setProjectCounts] = useState({});
  const processedUuids = new Set();

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
    loadImages(imageNames, setImages);
    loadImages(fiveLifeImageNames, setFiveLifeImages);
    loadImages(communityImageNames, setCommunityImages);
    fetchTotalProjectWeight().then(setTotalProjectWeight);
  }, [projects]);

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

  useEffect(() => {
    if (
      projects &&
      projects.result === "true" &&
      projects.projects.length > 0
    ) {
      projects.projects.forEach((uuid) => {
        if (!processedUuids.has(uuid)) {
          setPageInfoProjectCounts(uuid);
          processedUuids.add(uuid);
        }
      });
    }
  }, [projects]);

  const setPageInfoProjectCounts = async (uuid_project) => {
    let weight = {};

    try {
      const obj_project = await plan_info(uuid_project);
      const obj_parent_tasks = await list_plan_tasks(obj_project.uuid, 1);
      weight = await getProjectWeight(obj_parent_tasks.tasks);
    } catch (e) {
      return;
    }

    setProjectCounts((prevCounts) => {
      const newProjectCounts = { ...prevCounts };

      for (let index = 1; index < 28; index++) {
        if (weight[`sdgs-${index}`] !== "0") {
          newProjectCounts[`pc_${index}`] =
            (newProjectCounts[`pc_${index}`] || 0) + 1;
        }
      }

      return newProjectCounts;
    });
  };

  return (
    <div className="bg-light py-4">
      <Container>
        {/* KPI */}
        <Row className="justify-content-center">
          <Col xs={10}>
            <h3 className="text-center fw-bold">計畫總指標</h3>
          </Col>
        </Row>
        <Row className="mt-md-4 justify-content-center">
          {[...Array(17)].map((_, index) => {
            const imageNumber = (index + 1).toString();
            return (
              <Col key={index} xs={6} md={2} className="mt-4 md:mt-0">
                <Card className="rounded-0">
                  <Card.Img
                    variant="top"
                    src={images[`weight_${imageNumber}`]}
                    className="rounded-0"
                  />
                  <Card.Body>
                    <Card.Text>
                      關係人口:
                      <span id={`rp_${index + 1}`}>
                        {totalProjectWeight[`sdgs-${index + 1}`] || 0}
                      </span>
                      人
                    </Card.Text>
                    <Card.Text>
                      專案件數:
                      <span id={`pc_${index + 1}`}>
                        {" "}
                        {projectCounts[`pc_${index + 1}`] || 0}{" "}
                      </span>
                      件
                    </Card.Text>
                    <Card.Link
                      href={`/kpi_filter?sdg=${index}`}
                      className="stretched-link"
                    ></Card.Link>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
          <Col xs={6} md={2} className="mt-4 md:mt-0">
            <Card className="rounded-0">
              <Card.Img variant="top" src={SDGsCircle} className="rounded-0" />
              <Card.Body>
                <Card.Text>
                  關係人口:<span id="rp_total_sdgs">0</span>人
                </Card.Text>
                {/* <Card.Text>專案件數:<span id="pc_total_sdgs">0</span>件</Card.Text> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* Five-life-KPI */}
        <div id="five_life_kpi">
          <Row className="justify-content-center mt-4">
            <Col xs={10}>
              <h3 className="text-center fw-bold">五育融通指標</h3>
            </Col>
          </Row>
          <Row className="mt-4 justify-content-md-start">
            {fiveLifeImageNames.map((name, index) => (
              <Col key={index} xs={6} md={2} className="mt-4 mt-md-0">
                <Card className="rounded-0">
                  <Card.Img
                    variant="top"
                    src={fiveLifeImages[`weight_${name}`]}
                    className="rounded-0"
                  />
                  <Card.Body>
                    <Card.Text>
                      關係人口:
                      <span id={`rp_${index + 18}`}>
                        {totalProjectWeight[`sdgs-${index + 18}`] || 0}
                      </span>
                      人
                    </Card.Text>
                    <Card.Text>
                      專案件數:
                      <span id={`pc_${index + 18}`}>
                        {" "}
                        {projectCounts[`pc_${index + 18}`] || 0}{" "}
                      </span>
                      件
                    </Card.Text>
                    <Card.Link
                      href={`/kpi_filter.html?sdg=${index + 17}`}
                      className="stretched-link"
                    ></Card.Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        {/* Community-KPI */}
        <div id="community_kpi">
          <Row className="justify-content-center mt-4">
            <Col xs={10}>
              <h3 className="text-center fw-bold">社區營造指標</h3>
            </Col>
          </Row>
          <Row className="mt-4 justify-content-md-start">
            {communityImageNames.map((name, index) => (
              <Col key={index} xs={6} md={2} className="mt-4 mt-md-0">
                <Card className="rounded-0">
                  <Card.Img
                    variant="top"
                    src={communityImages[`weight_${name}`]}
                    className="rounded-0"
                  />
                  <Card.Body>
                    <Card.Text>
                      關係人口:
                      <span id={`rp_${index + 23}`}>
                        {totalProjectWeight[`sdgs-${index + 23}`] || 0}
                      </span>
                      人
                    </Card.Text>
                    <Card.Text>
                      專案件數:
                      <span id={`pc_${index + 23}`}>
                        {" "}
                        {projectCounts[`pc_${index + 23}`] || 0}{" "}
                      </span>
                      件
                    </Card.Text>
                    <Card.Link
                      href={`/kpi_filter.html?sdg=${index + 22}`}
                      className="stretched-link"
                    ></Card.Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default KPIList;
