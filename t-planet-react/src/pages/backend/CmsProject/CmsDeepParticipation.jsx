import { useState, useEffect } from "react";
import "../../progress_bar.css";
import { useParams, useLocation } from "react-router-dom";
import {
  handlePreview,
  handlePrevious,
  handleNextPage,
  handleSave,
} from "../../../utils/CmsAgent";
import ChildTask from "../components/ChildTask";
import { listChildrenTasks, getTaskInfo } from "../../../utils/Task";

const CmsDeepParticipation = () => {
  const [AllChildTasks, setAllChildTasks] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("task");
  console.log(AllChildTasks);

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

  if (!id || !taskId) return null;

  return (
    <div className="container pt-3">
      <ul className="progressbar">
        <li className="active done">
          <span>計畫基本資料</span>
        </li>
        <li className="active done">
          <span>SDGs 指標設定</span>
        </li>
        <li className="active">
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
        <div className="container pt-5">
          <form id="weight_container" action="">
            <div className="row mt-5 pt-5 align-items-center justify-content-center">
              <div className="col-10 px-0">
                <p className="bg-nav px-3 p-2">選擇計劃總指標</p>
              </div>
              <ChildTask
                AllChildTasks={AllChildTasks}
                setAllChildTasks={setAllChildTasks}
              />
            </div>

            {/* 按鈕 */}
            <div className="row mt-5 mb-5 pb-3 justify-content-center">
              <div className="col-md-8 mt-5">
                <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-3">
                  <button
                    type="submit"
                    id="btn_cms_plan_preview"
                    className="btn btn-secondary rounded-pill w-full md:w-1/5"
                    onClick={(event) => handlePreview(event, AllChildTasks, id)}
                  >
                    檢視
                  </button>
                  <button
                    type="submit"
                    id="btn_cms_plan_preview"
                    className="btn btn-dark rounded-pill w-full md:w-1/5"
                    onClick={(event) => handlePrevious(event, id)}
                  >
                    上一步
                  </button>
                  <button
                    type="submit"
                    id="btn_ab_project_next"
                    className="btn btn-dark rounded-pill w-full md:w-1/5"
                    onClick={(event) =>
                      handleNextPage(event, AllChildTasks, id)
                    }
                  >
                    下一步
                  </button>
                  <button
                    type="submit"
                    id="btn_cms_plan_save"
                    className="btn btn-success rounded-pill w-full md:w-1/5"
                    onClick={(event) => handleSave(event, AllChildTasks, id)}
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

export default CmsDeepParticipation;
