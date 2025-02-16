import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import generateSdgsIcons from "../../../utils/sdgs/SdgsImg";
import Add from "../../../assets/add-project.svg";
import Update from "../../../assets/update-project.svg";
import Delete from "../../../assets/del-project.svg";
import Verify from "../../../assets/verify-project.svg";
import SROI from "../../../assets/menu-sroi.svg";
import HotZone from "../../../assets/hot-zone.svg";

const ProjectCard = ({ project, onManage }) => {
  if (!project) return null;

  return (
    <div className="d-flex flex-column h-100 gap-3">
      <Card className="h-100 shadow-sm">
        <Link
          to={`/backend/cms_project_detail/${project.uuid}`}
          className="no-underline text-black"
        >
          <div
            className="bg-light"
            style={{
              height: "200px",
              backgroundImage: `url(${
                project.img
                  ? import.meta.env.VITE_HOST_URL_TPLANET + project.img
                  : "#"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Card.Body className="d-flex flex-column">
            <Card.Title className="mb-3">
              <h5 className="text-textColor font-bold">{project.name}</h5>
            </Card.Title>
            <div className="mb-3">
              <p className="mb-2">
                <strong>永續企業:</strong> {project.project_a}
              </p>
              <p className="mb-2">
                <strong>地方團隊:</strong> {project.project_b}
              </p>
              <p className="mb-2">
                <strong>期間:</strong> {project.period}
              </p>
            </div>

            <div className="flex flex-wrap gap-1">
              {generateSdgsIcons(project.weight)}
            </div>
          </Card.Body>
        </Link>
      </Card>
      <Button
        variant="dark"
        className="mt-auto rounded-pill w-100"
        onClick={() => onManage(project)}
      >
        專案管理選單
      </Button>
    </div>
  );
};

const ProjectList = ({ filteredProjects }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleManage = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDelete = () => {
    setShowModal(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // TODO: 實作刪除邏輯
    console.log(`Deleting project: ${selectedProject?.id}`);
    setShowDeleteModal(false);
    setSelectedProject(null);
  };

  return (
    <Container className="py-4">
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredProjects.map((project) => (
          <Col key={project.id}>
            <ProjectCard project={project} onManage={handleManage} />
          </Col>
        ))}
      </Row>

      {/* 管理選單 Modal */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedProject(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedProject?.name} - 專案管理</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container my-5">
            <div className="row justify-content-center">
              <div className="col-md-10 d-none d-md-block">
                <div className="row justify-content-center">
                  <div className="col-2">
                    <div
                      className="card card-button"
                      style={{ height: "100px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={Update} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">更新專案</p>
                        </div>
                      </div>
                      <Link
                        to={`/backend/cms_plan_info/${selectedProject?.uuid}`}
                        className="stretched-link"
                      ></Link>
                    </div>
                  </div>
                  <div className="col-2">
                    <div
                      className="card card-button"
                      style={{ height: "100px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={Add} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">新增任務</p>
                        </div>
                      </div>
                      <Link
                        to={`/backend/cms_impact/${selectedProject?.uuid}`}
                        className="stretched-link"
                      ></Link>
                    </div>
                  </div>
                  <div className="col-2">
                    <div
                      className="card card-button"
                      style={{ height: "100px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={Verify} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">驗證專案</p>
                        </div>
                      </div>
                      <Link
                        to={`/backend/admin_project_verify/${selectedProject?.uuid}&parent=1`}
                        className="stretched-link"
                      ></Link>
                    </div>
                  </div>
                  <div className="col-2">
                    <div
                      className="card card-button"
                      style={{ height: "100px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={HotZone} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">熱區圖示</p>
                        </div>
                      </div>
                      <Link
                        to={`/backend/heat_map/${selectedProject?.uuid}`}
                        className="stretched-link"
                      ></Link>
                    </div>
                  </div>
                  <div className="col-2">
                    <div
                      className="card card-button"
                      style={{ height: "100px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={SROI} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">SROI</p>
                        </div>
                      </div>
                      <Link
                        to={`/backend/cms_sroi/${selectedProject?.uuid}`}
                        className="stretched-link"
                      ></Link>
                    </div>
                  </div>
                  <div className="col-2">
                    <div
                      className="card card-button"
                      style={{ height: "100px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={Delete} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">刪除專案</p>
                        </div>
                      </div>
                      <a
                        href="#"
                        className="stretched-link"
                        data-bs-toggle="modal"
                        data-bs-target={`#projectDeleteModel_${selectedProject?.uuid}`}
                      ></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 d-md-none">
                <div className="row">
                  <div className="col-6">
                    <div
                      className="card card-button"
                      style={{ height: "120px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={Update} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">更新專案</p>
                        </div>
                      </div>
                      <Link
                        to={`/backend/cms_plan_info/${selectedProject?.uuid}`}
                        className="stretched-link"
                      ></Link>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="card card-button"
                      style={{ height: "120px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={Add} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">新增任務</p>
                        </div>
                      </div>
                      <Link
                        to={`/backend/cms_impact/${selectedProject?.uuid}`}
                        className="stretched-link"
                      ></Link>
                    </div>
                  </div>
                  <div className="col-6 mt-4">
                    <div
                      className="card card-button"
                      style={{ height: "120px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={Verify} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">驗證專案</p>
                        </div>
                      </div>
                      <Link
                        to={`/backend/admin_project_verify/${selectedProject?.uuid}&parent=1`}
                        className="stretched-link"
                      ></Link>
                    </div>
                  </div>
                  <div className="col-6 mt-4">
                    <div
                      className="card card-button"
                      style={{ height: "120px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={HotZone} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">熱區圖示</p>
                        </div>
                      </div>
                      <Link
                        to={`/backend/heat_map/${selectedProject?.uuid}`}
                        className="stretched-link"
                      ></Link>
                    </div>
                  </div>
                  <div className="col-6 mt-4">
                    <div
                      className="card card-button"
                      style={{ height: "120px" }}
                    >
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-center">
                          <img src={Delete} alt="" style={{ width: "50px" }} />
                          <p className="mt-2 mb-0">刪除專案</p>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={handleDelete}
                        className="stretched-link"
                      ></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* 刪除確認 Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setSelectedProject(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>確認刪除</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>確定要刪除「{selectedProject?.name}」專案嗎？此操作無法復原。</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedProject(null);
            }}
          >
            取消
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            確認刪除
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectList;
