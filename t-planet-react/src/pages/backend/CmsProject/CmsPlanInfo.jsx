import { useState, useCallback, useEffect } from "react";
import imageIcon from "../../../assets/image_icon.svg";
import TextEditor from "../../../utils/TextEditor";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../progress_bar.css";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import { plan_info, createFormData, plan_submit } from "../../../utils/Plan";
import {
  handlePreviewClick,
  handleSaveDraftClick,
} from "../../../utils/CmsAgent";
import Loading from "../../../assets/loading.png";

const CmsPlanInfo = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [projectA, setProjectA] = useState("");
  const [projectB, setProjectB] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [budget, setBudget] = useState("");
  const [philosophy, setPhilosophy] = useState("");
  const [isBudgetRevealed, setIsBudgetRevealed] = useState(true);
  const [coverImg, setCoverImg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjectInfo = async () => {
      if (id) {
        const obj_project = await plan_info(id);
        console.log(obj_project);
        if (obj_project) {
          if (obj_project.img) {
            setCoverImg(
              `${
                import.meta.env.VITE_HOST_URL_TPLANET
              }/static/project/${id}/media/cover/cover.png`
            );
          }
          if (obj_project.name) {
            setName(obj_project.name);
          }
          if (obj_project.projectA) {
            setProjectA(obj_project.projectA);
          }
          if (obj_project.projectB) {
            setProjectB(obj_project.projectB);
          }
          if (obj_project.startDate) {
            setStartDate(new Date(obj_project.startDate));
          }
          if (obj_project.dueDate) {
            setDueDate(new Date(obj_project.dueDate));
          }
          if (obj_project.budget) {
            setBudget(obj_project.budget);
          }
          if (obj_project.philosophy) {
            setPhilosophy(obj_project.philosophy);
          }
          if (obj_project.isBudgetRevealed !== undefined) {
            setIsBudgetRevealed(obj_project.isBudgetRevealed);
          }
        }
      }
    };

    fetchProjectInfo();
  }, [id]);

  const handlePreview = async () => {
    const formData = createFormData({
      name,
      projectA,
      projectB,
      startDate,
      dueDate,
      budget,
      philosophy,
      isBudgetRevealed,
    });

    console.log(formData, id);
    await plan_submit(formData, id);
    //await handlePreviewClick(formData, id);
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
    accept: "image/*",
  });

  return (
    <div className="container pt-3">
      <ul className="progressbar">
        <li className="active">
          <span>計畫基本資料</span>
        </li>
        <li>
          <span>SDGs 指標設定</span>
        </li>
        <li>
          <span>社會影響力展現</span>
        </li>
        <li>
          <span>專案聯繫窗口</span>
        </li>
        <li>
          <span></span>
        </li>
      </ul>

      <section>
        <div className="container">
          <form>
            <div className="row mt-5 pt-5 align-items-center justify-content-center">
              <div className="col-12">
                <p className="bg-nav p-2">永續合作封面</p>
              </div>
              <div className="">
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
                        <p className="text-center small mt-3">
                          上傳照片（建議尺寸700x400）
                        </p>
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
              </div>
            </div>

            <div className="row mt-4 align-items-center">
              <div className="col-12">
                <p className="bg-nav p-2">
                  <a style={{ color: "Tomato" }}>(*必填) </a>永續專案名稱
                </p>
              </div>
              <div className="col-12">
                <input
                  id="name"
                  className="form-control"
                  type="text"
                  placeholder="請填寫專案名稱"
                  maxLength="30"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-4 align-items-center">
              <div className="col-12">
                <p className="bg-nav p-2">永續企業名稱</p>
              </div>
              <div className="col-12">
                <input
                  id="project_a"
                  className="form-control"
                  type="text"
                  placeholder="請填寫企業名稱"
                  maxLength="20"
                  value={projectA}
                  onChange={(e) => setProjectA(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-4 align-items-center">
              <div className="col-12">
                <p className="bg-nav p-2">地方團隊</p>
              </div>
              <div className="col-12">
                <input
                  id="project_b"
                  className="form-control"
                  type="text"
                  placeholder="請填寫團隊名稱"
                  maxLength="20"
                  value={projectB}
                  onChange={(e) => setProjectB(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-4 align-items-center">
              <div className="col-12">
                <p className="bg-nav p-2">計劃期間</p>
              </div>
              <div className="col-6 mb-0">
                <div className="input-group date w-full">
                  <DatePicker
                    id="project_start_date"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="form-control w-full"
                    placeholderText="開始日期"
                  />
                  <span className="input-group-text">
                    <i className="fa fa-calendar"></i>
                  </span>
                </div>
              </div>
              <div className="col-6 mb-0">
                <div className="input-group date">
                  <DatePicker
                    id="project_due_date"
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    className="form-control"
                    placeholderText="結束日期"
                  />
                  <span className="input-group-text">
                    <i className="fa fa-calendar"></i>
                  </span>
                </div>
              </div>
            </div>

            <div className="row mt-4 align-items-center">
              <div className="col-12">
                <div className="row">
                  <div className="col-9">
                    <p className="bg-nav p-2">
                      <a style={{ color: "Tomato" }}>(*請輸入整數) </a>計畫金額
                    </p>
                  </div>
                  <div className="col-3 d-flex align-items-center">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="displayProjectBudget"
                        checked={isBudgetRevealed}
                        onChange={(e) => setIsBudgetRevealed(e.target.checked)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="displayProjectBudget"
                      >
                        是否揭露計畫金額？
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <input
                  id="budget"
                  className="form-control"
                  type="number"
                  placeholder="請輸入計畫金額"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>

            <div className="row mt-4 align-items-center">
              <div className="col-12">
                <p className="bg-nav p-2">計畫理念</p>
              </div>
              <div className="col-12">
                <TextEditor
                  id="philosophy"
                  setDescription={setPhilosophy}
                  height="158px"
                />
              </div>
            </div>

            <div className="row mt-5 mb-5 pb-3 justify-content-center">
              <div className="col-md-8 mt-5">
                <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-3">
                  <button
                    type="submit"
                    id="btn_cms_plan_preview"
                    className="btn btn-secondary rounded-pill w-full md:w-1/5"
                    onClick={handlePreview}
                  >
                    檢視
                  </button>
                  <button
                    type="submit"
                    id="btn_ab_project_next"
                    className="btn btn-dark rounded-pill w-full md:w-1/5"
                    //onClick={(e) => handleNextClick(e, formData)}
                  >
                    下一步
                  </button>
                  <button
                    type="submit"
                    id="btn_cms_plan_save"
                    className="btn btn-success rounded-pill w-full md:w-1/5"
                    //onClick={(e) => handleSaveDraftClick(e, formData)}
                  >
                    儲存草稿
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CmsPlanInfo;
