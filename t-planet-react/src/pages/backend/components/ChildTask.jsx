import { useState, useEffect } from "react";
import { Form, Container, Col, Row, Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  submitTask,
  getTaskInfo,
  deleteTask,
  listChildrenTasks,
} from "../../../utils/Task";
import { useParams, useLocation } from "react-router-dom";
import SdgsModal from "../../../utils/sdgs/SdgsModal";

const ChildTaskBlock = () => {
  const [AllChildTasks, setAllChildTasks] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("task");

  useEffect(() => {
    const fetchTasks = async () => {
      const list_child_task_uuid = await listChildrenTasks(taskId);

      if (!list_child_task_uuid || list_child_task_uuid.length === 0) {
        return;
      }

      const tasks = await Promise.all(
        list_child_task_uuid.map((child_uuid) => getTaskInfo(child_uuid))
      );

      if (tasks.length !== 0) {
        setAllChildTasks(tasks);
      }
    };

    fetchTasks();
  }, [taskId]);

  const addChildTask = async (objTask = null) => {
    if (!objTask) {
      const formData = new FormData();
      formData.append("email", localStorage.getItem("email"));
      formData.append("uuid", id);
      formData.append("tasks", JSON.stringify([{ task_parent_id: taskId }]));

      const response = await submitTask(formData);
      if (!response) {
        console.log("Error, submit task failed.");
        return;
      }
      const newTask = {
        uuid: response,
        name: "",
        gps: false,
        startDate: null,
        dueDate: null,
        tasks: [],
      };

      setAllChildTasks((prev) => [newTask, ...prev]);
    } else {
      // Add existing task
      const periodDates = objTask.period?.split("-") || [];
      const newTask = {
        ...objTask,
        startDate: periodDates[0] ? new Date(periodDates[0]) : null,
        dueDate: periodDates[1] ? new Date(periodDates[1]) : null,
      };

      setAllChildTasks((prev) => [...prev, newTask]);
    }
  };

  const TaskBlock = ({ task }) => {
    const [taskData, setTaskData] = useState(() => {
      const periodDates = task.period?.split("-") || [];
      return {
        ...task,
        startDate: periodDates[0] ? new Date(periodDates[0]) : null,
        dueDate: periodDates[1] ? new Date(periodDates[1]) : null,
      };
    });
    const [modalShow, setModalShow] = useState(false);

    const handleInputChange = (field, value) => {
      setTaskData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleDeleteTask = async (event, uuid) => {
      event.preventDefault();
      const response = await deleteTask(uuid);
      if (response.result === true) {
        setAllChildTasks((prev) => prev.filter((task) => task.uuid !== uuid));
        alert("刪除成功");
      } else {
        alert("刪除失敗，請洽系統管理員。");
      }
    };

    return (
      <div className="parent-task-block mb-4 p-3 rounded row align-items-center justify-content-center">
        <Row className="border p-3 col-10">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>活動名稱 UUID：{taskData.uuid}</Form.Label>
              <Form.Control
                type="text"
                value={taskData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Form.Group>
            <p>時間</p>
            <div className="d-flex gap-3 mb-3">
              <Form.Group className="position-relative">
                {/* <Form.Label>時間</Form.Label> */}
                <div className="input-group">
                  <DatePicker
                    id={`task_start_date_${taskData.uuid}`}
                    selected={taskData.startDate}
                    onChange={(date) => handleInputChange("startDate", date)}
                    className="form-control"
                  />
                  <span className="input-group-text position-absolute top-50 end-0 translate-middle-y h-full">
                    <i className="fa fa-calendar"></i>
                  </span>
                </div>
              </Form.Group>

              <Form.Group className="position-relative">
                {/* <Form.Label> </Form.Label> */}
                <div className="input-group">
                  <DatePicker
                    id={`task_due_date_${taskData.uuid}`}
                    selected={taskData.dueDate}
                    onChange={(date) => handleInputChange("dueDate", date)}
                    className="form-control"
                  />
                  <span className="input-group-text position-absolute top-50 end-0 translate-middle-y h-full">
                    <i className="fa fa-calendar"></i>
                  </span>
                </div>
              </Form.Group>
            </div>
          </Col>
          <Col md={{ offset: 3 }}>
            <div className="flex flex-col mt-3 md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-3 ">
              <button
                type="button"
                id="btn_cms_plan_preview"
                className="btn btn-danger rounded-pill w-full"
                onClick={() => setModalShow(true)}
              >
                刪除
              </button>
            </div>
          </Col>
          <SdgsModal />
        </Row>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={modalShow}
          onHide={() => setModalShow(false)}
        >
          <Modal.Body>
            <div className="modal-body m-auto text-xl text-center">
              確定刪除此項活動設計嗎？
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center border-0">
            <Button
              variant="secondary"
              className="rounded-pill w-36"
              onClick={() => setModalShow(false)}
            >
              取消
            </Button>
            <Button
              variant="danger"
              className="rounded-pill w-36"
              id="delete-task"
              onClick={(e) => handleDeleteTask(e, taskData.uuid)}
            >
              確定
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  return (
    <Container id="div_parent_task">
      <div className="row justify-content-center my-2">
        <div className="col-10 px-0">
          <button
            type="button"
            id="add_parent_tasks"
            className="btn btn-block btn-outline-secondary w-full"
            onClick={() => addChildTask()}
          >
            + 新增活動
          </button>
        </div>
      </div>

      {AllChildTasks && AllChildTasks.length > 0
        ? AllChildTasks.map((task) => <TaskBlock key={task.uuid} task={task} />)
        : null}
    </Container>
  );
};

export default ChildTaskBlock;
