import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import placeMarker from "../../assets/place_marker.svg";
import HowToParticipate from "../../assets/how_to_participate.png";
import { plan_info, list_plan_tasks } from "../../utils/Plan";
import { getTaskInfo } from "../../utils/Task";
import generateSdgsIcons from "../../utils/sdgs/SdgsImg";
import SdgsWeight from "../../utils/sdgs/SdgsWeight";
import SdgsChart from "../../utils/sdgs/SdgsChart";
import { Modal, Button } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";

export default function ProjectContent() {
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        const projectData = await plan_info(id);
        setProject(projectData);

        const parentTasks = await list_plan_tasks(id, 1);
        const list_task = await Promise.all(
          parentTasks.tasks.map((taskUuid) => getTaskInfo(taskUuid))
        );
        setTasks(list_task);
      }
    };

    fetchProject();
  }, [id]);

  const handleShowModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const renderLocation = (locationString) => {
    if (!locationString) return [];
    const list_location = locationString.split(",");
    const locations = ["台北", "竹山", "高雄", "花蓮", "馬祖"];
    return list_location
      .map((loc, index) =>
        parseInt(loc) === 1 ? (
          <span key={index}>
            T-Planet @ {locations[index]}
            <br />
          </span>
        ) : null
      )
      .filter(Boolean);
  };

  if (!project) return <div>Loading...</div>;

  return (
    <section className="flex-grow-1 py-4 bg-light">
      <div className="container mx-auto">
        <div className="row mt-3 mt-md-5">
          <div className="col-md-12"></div>
        </div>
        <div className="row justify-center mt-4 py-4 bg-white">
          <div className="col-10">
            <img
              id="project_cover"
              className="max-w-full h-auto mx-auto max-h-72"
              src={import.meta.env.VITE_HOST_URL_TPLANET + project.img}
              alt=""
            />
            <div className="row mt-4 pb-4 border-bottom">
              <div className="col-md-6">
                <h4 className="text-textColor" id="project_name">
                  {project.name}
                </h4>
              </div>
              <div className="col-md-6">
                <div
                  className="flex flex-wrap justify-center justify-md-end"
                  id="project_sdg_container"
                >
                  {" "}
                  {generateSdgsIcons(project.weight)}
                </div>
              </div>
            </div>
            {/* project description */}
            <div className="row mt-4 border-bottom">
              <div className="col-md-6">
                <div className="d-flex flex-col h-full justify-center md:justify-start">
                  <p className="mb-3">
                    計畫期間:
                    <span className="pl-2" id="project_period">
                      {project.period}
                    </span>
                  </p>
                  <p className="mb-3" id="project_uuid">
                    計畫編號:{project.uuid}
                  </p>
                  <p className="flex">
                    <img
                      className="mr-2"
                      src={placeMarker}
                      alt=""
                      style={{ width: "20px" }}
                    />
                    <span id="location">
                      {renderLocation(project.location)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-col">
                  <p className="mb-3">
                    永續企業:
                    <span className="pl-2" id="project_a">
                      {project.project_a}
                    </span>
                  </p>
                  <p className="mb-3">
                    專案負責人:
                    <span className="pl-2" id="hoster">
                      {project.hoster}
                    </span>
                  </p>
                  <p className="mb-3">
                    地方團隊:
                    <span className="pl-2" id="project_b">
                      {project.project_b}
                    </span>
                  </p>
                  <p className="mb-3">
                    電子郵件:
                    <span className="pl-2" id="email">
                      {project.email}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="row mt-4 pb-4 border-bottom">
              <div className="col-md-12">
                <p className="h5 font-bold">計畫理念</p>
                <p
                  className="mt-3 mb-2"
                  id="philosophy"
                  dangerouslySetInnerHTML={{ __html: project.philosophy }}
                ></p>
              </div>
            </div>
            <div
              className="row mt-5 pb-4 border-bottom"
              id="project_weight_description"
            >
              <SdgsWeight data={project.weight_description} />
            </div>

            <div className="row mt-3 pb-3 border-bottom">
              <p className="text-center text-2xl font-bold opacity-70">
                專案指標累積
              </p>
              <div className="col-12 d-flex h-full items-center justify-center">
                <SdgsChart projectUuid={project.uuid} id="project" title="" />
              </div>
            </div>

            <div className="row mt-3 pb-3 border-bottom">
              <div className="col-12">
                <p className="h5 fw-bold">成果展現:</p>
              </div>
              <div className="col-12 bg-light">
                <div className="row justify-content-center">
                  {tasks.map((task, index) => (
                    <div
                      key={task.uuid}
                      className="row align-items-center bg-light py-2 mt-4 mt-md-5 mb-3 project-detail-item"
                      id={`task_${index}`}
                    >
                      <div className="col-md-5">
                        <img
                          className="w-[300px] img-fluid"
                          src={
                            import.meta.env.VITE_HOST_URL_TPLANET +
                            task.thumbnail
                          }
                          alt=""
                        />
                      </div>
                      <div className="col-md-4 mt-4 mt-md-0">
                        <p className="mb-3">
                          <span style={{ fontSize: "18px" }}>
                            活動設計名稱 ({task.uuid}):{" "}
                          </span>
                          <br />
                          <b style={{ fontSize: "14px" }}>{task.name}</b>
                        </p>
                        <p className="mb-3">日期: {task.period}</p>
                        {task.overview.length > 0 && <p>(已填寫設計理念)</p>}
                        {task.overview.length > 44 && (
                          <a
                            href="javascript:void(0);"
                            onClick={() => handleShowModal(task)}
                          >
                            Read more...
                          </a>
                        )}
                        <p
                          style={{
                            maxHeight: "80px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                          dangerouslySetInnerHTML={{ __html: task.overview }}
                        ></p>
                      </div>
                      <div className="col-md-3 text-center d-md-block align-self-center">
                        <QRCodeSVG
                          value={`${window.location.protocol}//${window.location.host}/tasks/${task.uuid}`}
                          size={120}
                          style={{
                            width: "100px",
                            height: "100px",
                            marginTop: "15px",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Modal show={showModal} onHide={handleCloseModal} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>活動設計概要</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedTask?.overview,
                      }}
                    ></div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                      關閉
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>

            <div className="row mt-3 pb-3 justify-content-center align-items-center">
              <div className="col-12">
                <p className="h5 fw-bold">參與方式:</p>
              </div>
              <div className="col-md-10">
                <img className="img-fluid" src={HowToParticipate} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
