import "../../progress_bar.css";
import { useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import { plan_info } from "../../../utils/Plan";
import { useParams } from "react-router-dom";
import { sdgsAutoGen, getWeightMeta } from "../../../utils/sdgs/Weight";
import {
  handlePreview,
  handlePrevious,
  handleNextPage,
  handleSave,
} from "../../../utils/CmsAgent";

const CmsSdgsSetting = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const WEIGHTS = ["SDGs", "CommunityDevelopment", "FiveWaysofLife"];
  const [weightData, setWeightData] = useState([]);

  useEffect(() => {
    if (id) {
      fetchSDGsData();
    }
  }, [id]);

  const fetchSDGsData = async () => {
    setIsLoading(true);
    try {
      const projectInfo = await plan_info(id);

      let sdgsList = projectInfo.weight
        ? projectInfo.weight.split(",")
        : Array(27).fill("0");

      const allZeros = sdgsList.every((value) => value === "0");

      if (allZeros) {
        try {
          const result = await sdgsAutoGen(id);
          const parsedResult = JSON.parse(result.content);

          if (parsedResult.project_sdgs?.length > 0) {
            const projectSDGs = parsedResult.project_sdgs[0];

            localStorage.setItem("ai_sdgs", JSON.stringify(projectSDGs));

            sdgsList = sdgsList.map((_, index) =>
              projectSDGs[index + 1] ? "1" : "0"
            );
          }
        } catch (error) {
          console.error("Error fetching AI generated SDGs:", error);
        }
      }

      const weightDetails = [];
      let globalIdCounter = 1;

      for (const weight of WEIGHTS) {
        const data = await getWeightMeta(weight);
        const categories = data.content.categories.map((category) => {
          const uniqueId = `sdg_${globalIdCounter}`;
          globalIdCounter++;
          return {
            title: category.title,
            id: uniqueId,
            isChecked: parseInt(sdgsList[uniqueId.split("_")[1] - 1]) !== 0,
          };
        });

        weightDetails.push({
          weightId: weight,
          categories: categories,
        });
      }

      setWeightData(weightDetails);
    } catch (error) {
      console.error("Error fetching SDGs data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryToggle = (weightId, categoryId) => {
    setWeightData((prevData) =>
      prevData.map((weight) => {
        if (weight.weightId === weightId) {
          return {
            ...weight,
            categories: weight.categories.map((category) =>
              category.id === categoryId
                ? { ...category, isChecked: !category.isChecked }
                : category
            ),
          };
        }
        return weight;
      })
    );
  };

  if (!id) return null;

  return (
    <div className="container pt-3">
      <ul className="progressbar">
        <li className="active done">
          <span>計畫基本資料</span>
        </li>
        <li className="active">
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
        <div className="container pt-5">
          <div className="form-row align-items-center mt-5">
            <div className="col-12 px-0">
              <p className="bg-nav px-3 py-2">選擇計劃總指標</p>
            </div>
          </div>

          <form id="weight_container" action="">
            {/* 權重項目會動態生成並添加到這裡 */}

            <div>
              {isLoading ? (
                <div
                  id="loading-container"
                  className="loading-container hidden"
                >
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p>AI 自動產生 SDGs 指標中，請稍後 ...</p>
                </div>
              ) : (
                weightData.map((weight) => (
                  <Card key={weight.weightId} className="mb-3">
                    <Card.Body>
                      <div className="row text-xl">
                        {weight.categories.map((category) => (
                          <div
                            key={category.id}
                            className="col-12 col-sm-6 col-md-4 mb-3"
                          >
                            <Form.Check
                              type="checkbox"
                              id={category.id}
                              label={category.title}
                              checked={category.isChecked}
                              onChange={() =>
                                handleCategoryToggle(
                                  weight.weightId,
                                  category.id
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
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
