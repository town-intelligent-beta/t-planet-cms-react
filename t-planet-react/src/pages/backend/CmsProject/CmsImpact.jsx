import "../../progress_bar.css";
import { useState, useEffect } from "react";
//import { Card, Form } from "react-bootstrap";
import { plan_info } from "../../../utils/Plan";
import { useParams } from "react-router-dom";
//import { sdgsAutoGen, getWeightMeta } from "../../../utils/sdgs/Weight";
import SdgsCommand from "../../../utils/sdgs/SdgsComment";
import {
  handlePreview,
  handlePrevious,
  handleNextPage,
  handleSave,
} from "../../../utils/CmsAgent";
import ParentTask from "../components/ParentTask";

const CmsSdgsSetting = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [projectWeight, setProjectWeight] = useState("");
  const [weightComment, setWeightComment] = useState("");
  console.log(weightComment);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const projectInfo = await plan_info(id);
      console.log(projectInfo);
      setProjectWeight(projectInfo.weight);
      setWeightComment(projectInfo.weight_description);

      //   let sdgsList = projectInfo.weight
      //     ? projectInfo.weight.split(",")
      //     : Array(27).fill("0");

      //   const allZeros = sdgsList.every((value) => value === "0");

      //   if (allZeros) {
      //     try {
      //       const result = await sdgsAutoGen(id);
      //       const parsedResult = JSON.parse(result.content);

      //       if (parsedResult.project_sdgs?.length > 0) {
      //         const projectSDGs = parsedResult.project_sdgs[0];

      //         localStorage.setItem("ai_sdgs", JSON.stringify(projectSDGs));

      //         sdgsList = sdgsList.map((_, index) =>
      //           projectSDGs[index + 1] ? "1" : "0"
      //         );
      //       }
      //     } catch (error) {
      //       console.error("Error fetching AI generated SDGs:", error);
      //     }
      //   }

      //   const weightDetails = [];
      //   let globalIdCounter = 1;

      //   for (const weight of WEIGHTS) {
      //     const data = await getWeightMeta(weight);
      //     const categories = data.content.categories.map((category) => {
      //       const uniqueId = `sdg_${globalIdCounter}`;
      //       globalIdCounter++;
      //       return {
      //         title: category.title,
      //         id: uniqueId,
      //         isChecked: parseInt(sdgsList[uniqueId.split("_")[1] - 1]) !== 0,
      //       };
      //     });

      //     weightDetails.push({
      //       weightId: weight,
      //       categories: categories,
      //     });
      //   }

      //   setWeightData(weightDetails);
    } catch (error) {
      console.error("Error fetching SDGs data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!id) return null;

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
              <div className="col-10" id="sdgs_container">
                {SdgsCommand(projectWeight, weightComment, setWeightComment)}
              </div>
            </div>
            <div className="row mt-5 align-items-center justify-content-center">
              <div className="col-10 px-0">
                <p className="bg-nav px-3 p-2">成果展現</p>
              </div>
            </div>
            {/* <div className="row justify-content-center my-2">
              <div className="col-10 px-0">
                <button
                  type="button"
                  id="add_parent_tasks"
                  className="btn btn-block btn-outline-secondary w-full"
                >
                  + 新增活動
                </button>
              </div>
            </div> */}
            <div id="div_parent_task">
              <ParentTask />
            </div>

            {/* 按鈕 */}
            <div className="row mt-5 mb-5 pb-3 justify-content-center">
              <div className="col-md-8 mt-5">
                <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-3">
                  <button
                    type="submit"
                    id="btn_cms_plan_preview"
                    className="btn btn-secondary rounded-pill w-full md:w-1/5"
                    onClick={(event) => handlePreview(event, weightData, id)}
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
                    onClick={(event) => handleNextPage(event, weightData, id)}
                  >
                    下一步
                  </button>
                  <button
                    type="submit"
                    id="btn_cms_plan_save"
                    className="btn btn-success rounded-pill w-full md:w-1/5"
                    onClick={(event) => handleSave(event, weightData, id)}
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

export default CmsSdgsSetting;
