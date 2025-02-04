import { useState, useEffect, useCallback } from "react";
import { Form, Container, Col, Row } from "react-bootstrap";
import imageIcon from "../../../assets/image_icon.svg";
import Loading from "../../../assets/loading.png";
import TextEditor from "../../../utils/TextEditor";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TaskSubmit } from "../../../utils/Task";
import { useParams } from "react-router-dom";

const ParentTaskBlock = () => {
  const [parentTasks, setParentTasks] = useState([]);
  const [coverImg, setCoverImg] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const addParentTask = async (objTask = null) => {
    if (!objTask) {
      // Create new parent task
      const formData = new FormData();
      formData.append("email", localStorage.getItem("email"));
      formData.append("uuid", id);

      const response = await TaskSubmit(formData);
      console.log(response);
      if (!response) {
        console.log("Error, submit task failed.");
        return;
      }

      const newTask = {
        uuid: response,
        name: "",
        //period: "",
        overview: "",
        gps: false,
        startDate: null,
        dueDate: null,
      };

      setParentTasks((prev) => [newTask, ...prev]);
    } else {
      // Add existing task
      const periodDates = objTask.period?.split("-") || [];
      const newTask = {
        ...objTask,
        startDate: periodDates[0] ? new Date(periodDates[0]) : null,
        dueDate: periodDates[1] ? new Date(periodDates[1]) : null,
        coverImage: `${
          import.meta.env.VITE_HOST_URL_TPLANET
        }/static/project/${id}/tasks/${objTask.uuid}/cover.png`,
      };

      setParentTasks((prev) => [...prev, newTask]);
    }
  };

  const submitProjectCover = async (base64Img, uuid) => {
    const formdata = new FormData();
    formdata.append("uuid", uuid);
    formdata.append("img", base64Img);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL_TPLANET}/projects/push_project_cover`,
        {
          method: "POST",
          body: formdata,
          redirect: "follow",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
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
        const result = await submitProjectCover(base64Img, id);
        if (result.result === "true") {
          alert("更新成功");
          setCoverImg(base64Img);
        } else {
          alert("更新失敗，請洽系統管理員。");
        }
        setLoading(false);
      };
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

  const TaskBlock = ({ task }) => {
    const [taskData, setTaskData] = useState(task);
    console.log(taskData);

    const handleInputChange = (field, value) => {
      setTaskData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    return (
      <div className="parent-task-block mb-4 p-3 rounded row align-items-center justify-content-center">
        <Row className="border p-3 col-10">
          <Col md={6}>
            {/* <div
              className="cover-image-container mb-3"
              style={{
                height: "200px",
                backgroundImage: taskData.coverImage
                  ? `url(${taskData.coverImage})`
                  : "none",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                border: "1px dashed #ccc",
                cursor: "pointer",
              }}
              onClick={() =>
                document.getElementById(`file-upload-${taskData.uuid}`).click()
              }
            >
              {!taskData.coverImage && (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <Button variant="outline-secondary">
                    Upload Cover Image
                  </Button>
                </div>
              )}
              <input
                id={`file-upload-${taskData.uuid}`}
                type="file"
                hidden
                //   onChange={(e) =>
                //     handleImageUpload(taskData.uuid, e.target.files[0])
                //   }
              />
            </div> */}
            <div
              id="coverImg"
              className="border d-flex flex-column align-items-center justify-content-center"
              style={{
                height: "300px",
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="d-flex flex-column align-items-center justify-content-center">
                {!coverImg ? (
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
                      ></img>
                    </button>
                  </div>
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <img
                      //id="divUploadImg"
                      className="bg-contain max-h-72"
                      src={coverImg}
                      alt="Upload Icon"
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
            <Form>
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
                      className="form-control" // 新增 pe-5 類別
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
                      className="form-control" // 新增 pe-5 類別
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
                  setDescription={(value) =>
                    handleInputChange("overview", value)
                  }
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
                  type="submit"
                  id="btn_cms_plan_preview"
                  className="btn btn-danger rounded-pill w-full"
                  //onClick={(event) => handlePreview(event, weightData, id)}
                >
                  刪除
                </button>
                <button
                  type="submit"
                  id="btn_cms_plan_preview"
                  className="btn btn-success rounded-pill w-full"
                  //onClick={(event) => handlePrevious(event, id)}
                >
                  新增
                </button>
              </div>
            </Form>
          </Col>
        </Row>
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
            onClick={() => addParentTask()}
          >
            + 新增活動
          </button>
        </div>
      </div>

      {parentTasks.map((task) => (
        <TaskBlock key={task.uuid} task={task} />
      ))}
    </Container>
  );
};

export default ParentTaskBlock;
