import { useState, useEffect, useCallback } from "react";
import { Form, Container, Col, Row, Modal, Button } from "react-bootstrap";
import imageIcon from "../../../assets/image_icon.svg";
import Loading from "../../../assets/loading.png";
import TextEditor from "../../../utils/TextEditor";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { submitTask, deleteTask, submitTaskCover } from "../../../utils/Task";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/Transform";

const TaskBlock = ({ task, updateTask, removeTask }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState(() => {
    const periodDates = task.period?.split("-") || [];
    return {
      ...task,
      startDate: periodDates[0] ? new Date(periodDates[0]) : null,
      dueDate: periodDates[1] ? new Date(periodDates[1]) : null,
      coverImg: task.thumbnail
        ? `${
            import.meta.env.VITE_HOST_URL_TPLANET
          }/static/project/${id}/tasks/${task.uuid}/cover.png`
        : "",
    };
  });
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateTask(taskData);
  }, [taskData, updateTask]);

  const handleInputChange = (field, value) => {
    setTaskData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadCover = async (file) => {
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const base64Img = canvas.toDataURL("image/jpeg");

        try {
          const result = await submitTaskCover(base64Img, task.uuid);
          if (result.result === "true") {
            alert("更新成功");
            handleInputChange(
              "thumbnail",
              `${
                import.meta.env.VITE_HOST_URL_TPLANET
              }/static/project/${id}/tasks/${task.uuid}/cover.png`
            );
          } else {
            alert("更新失敗，請洽系統管理員。");
          }
        } catch (error) {
          console.error("Error updating cover:", error);
          alert("更新失敗，請洽系統管理員。");
        } finally {
          setLoading(false);
        }
      };
      img.onerror = () => {
        console.error("Error loading image");
        alert("圖片加載失敗，請重試。");
        setLoading(false);
      };
    };
    reader.onerror = () => {
      console.error("Error reading file");
      alert("文件讀取失敗，請重試。");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleUploadCover(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  const handleDeleteTask = async (event) => {
    event.preventDefault();
    const response = await deleteTask(task.uuid);
    if (response.result === true) {
      removeTask(task.uuid);
      alert("刪除成功");
    } else {
      alert("刪除失敗，請洽系統管理員。");
    }
  };

  const handleSubmitTask = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      formData.append("email", localStorage.getItem("email"));
      formData.append("uuid", id);
      formData.append("task", taskData.uuid);
      formData.append("name", taskData.name);
      formData.append("task_start_date", formatDate(taskData.startDate));
      formData.append("task_due_date", formatDate(taskData.dueDate));
      formData.append("overview", taskData.overview);
      formData.append("gps_flag", taskData.gps);

      const response = await submitTask(formData);
      if (response) {
        localStorage.setItem("uuid_project", id);
        navigate(`/backend/cms_missions_display/${id}?task=${taskData.uuid}`);
      } else {
        alert("更新失敗，請洽系統管理員。");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="parent-task-block mb-4 p-3 rounded row align-items-center justify-content-center">
      <Row className="border p-3 col-10">
        <Col md={6}>
          <div
            id="coverImg"
            className="border d-flex flex-column align-items-center justify-content-center"
            style={{ height: "300px" }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div className="d-flex flex-column align-items-center justify-content-center">
              {!taskData.thumbnail ? (
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <button
                    type="button"
                    className="btn btn-light border-dark"
                    id="btnUploadImg"
                  >
                    <img
                      id="divUploadImg"
                      className="bg-contain w-24"
                      src={imageIcon}
                      alt="Upload Icon"
                    />
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <img
                    id="divUploadImg"
                    className="bg-contain max-h-72"
                    src={taskData.coverImg}
                    alt="Task Cover"
                  />
                </div>
              )}
              {loading && (
                <div id="loading" className="z-50">
                  <div id="loading-text">
                    <p>上傳中 ...</p>
                  </div>
                  <div id="loading-spinner">
                    <img src={Loading} alt="Loading" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>活動設計名稱</Form.Label>
            <Form.Control
              type="text"
              value={taskData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Form.Group>
          <div className="d-flex gap-3 mb-3">
            <Form.Group className="position-relative">
              <Form.Label>開始日期</Form.Label>
              <div className="input-group">
                <DatePicker
                  id="project_start_date"
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
              <Form.Label>結束日期</Form.Label>
              <div className="input-group">
                <DatePicker
                  id="project_due_date"
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

          <Form.Group className="mb-3">
            <Form.Label>理念傳達</Form.Label>
            <TextEditor
              value={taskData.overview}
              onChange={(value) => handleInputChange("overview", value)}
              className="h-32"
              setDescription={(value) => handleInputChange("overview", value)}
              initialContent={taskData.overview}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="啟動GPS足跡側錄"
              checked={taskData.gps}
              onChange={(e) => handleInputChange("gps", e.target.checked)}
            />
          </Form.Group>
          <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-3">
            <button
              type="button"
              id="btn_cms_plan_preview"
              className="btn btn-danger rounded-pill w-full"
              onClick={() => setModalShow(true)}
            >
              刪除
            </button>
            <button
              type="submit"
              id="btn_cms_plan_preview"
              className="btn btn-success rounded-pill w-full"
              onClick={handleSubmitTask}
            >
              新增
            </button>
          </div>
        </Col>
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
            onClick={handleDeleteTask}
          >
            確定
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const ParentTaskBlock = ({ parentTasks, setParentTasks }) => {
  const { id } = useParams();

  const addParentTask = async (objTask = null) => {
    if (!objTask) {
      const formData = new FormData();
      formData.append("email", localStorage.getItem("email"));
      formData.append("uuid", id);

      const response = await submitTask(formData);
      if (!response) {
        console.log("Error, submit task failed.");
        return;
      }
      const newTask = {
        uuid: response,
        name: "",
        period: "",
        overview: "",
        thumbnail: "",
        gps: false,
        startDate: null,
        dueDate: null,
      };

      setParentTasks((prev) => [newTask, ...prev]);
    } else {
      const periodDates = objTask.period?.split("-") || [];
      const newTask = {
        ...objTask,
        startDate: periodDates[0] ? new Date(periodDates[0]) : null,
        dueDate: periodDates[1] ? new Date(periodDates[1]) : null,
      };

      setParentTasks((prev) => [...prev, newTask]);
    }
  };

  const updateTask = useCallback(
    (updatedTask) => {
      setParentTasks((prev) =>
        prev.map((task) =>
          task.uuid === updatedTask.uuid ? updatedTask : task
        )
      );
    },
    [setParentTasks]
  );

  const removeTask = useCallback(
    (uuid) => {
      setParentTasks((prev) => prev.filter((task) => task.uuid !== uuid));
    },
    [setParentTasks]
  );

  return (
    <Container id="div_parent_task">
      <div className="row justify-content-center my-2">
        <div className="col-10 px-0">
          <button
            type="button"
            id="add_parent_tasks"
            className="btn btn-block btn-outline-secondary w-full"
            onClick={() => addParentTask()}
          >
            + 新增活動
          </button>
        </div>
      </div>

      {parentTasks.map((task) => (
        <TaskBlock
          key={task.uuid}
          task={task}
          updateTask={updateTask}
          removeTask={removeTask}
        />
      ))}
    </Container>
  );
};

export default ParentTaskBlock;
