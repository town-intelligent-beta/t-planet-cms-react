import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import placeMarker from "../../../assets/place_marker.svg";
import {
  plan_info,
  getProjectWeight,
  list_plan_tasks,
} from "../../../utils/Plan";
import { getTaskInfo, listChildrenTasks } from "../../../utils/Task";
import generateSdgsIcons from "../../../utils/sdgs/SdgsImg";
import SdgsWeight from "../../../utils/sdgs/SdgsWeight";
import SdgsChart from "../../../utils/sdgs/SdgsChart";

export default function ProjectContent() {
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [taskWeights, setTaskWeights] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        const projectData = await plan_info(id);
        setProject(projectData);
        const weight = await relatePeople(id);
        setTotalWeight(weight);
        const parentTasks = await list_plan_tasks(id, 1);
        const list_task = await Promise.all(
          parentTasks.tasks.map((taskUuid) => getTaskInfo(taskUuid))
        );
        setTasks(list_task);

        const list_child_task = await Promise.all(
          list_task.map((task) => listChildrenTasks(task.uuid))
        );
        const flattened_child_tasks = list_child_task.flat();

        const list_weight = await Promise.all(
          flattened_child_tasks.map((taskUuid) => getTaskInfo(taskUuid))
        );
        setTaskWeights(generateContentValues(list_weight));
      }
    };

    fetchProject();
  }, [id]);

  const generateContentValues = (taskWeights) => {
    return taskWeights.map((task) => {
      const content = JSON.parse(task.content);
      return Object.values(content).map((value) => parseInt(value));
    });
  };

  //console.log(project.weight);
  //console.log(tasks);
  //console.log(taskWeights);

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

  const relatePeople = async (projectUuid) => {
    const parentTasks = await list_plan_tasks(projectUuid, 1);
    const list_weight = await getProjectWeight(parentTasks.tasks);

    let total_weight = 0;
    for (const key in list_weight) {
      total_weight += parseInt(list_weight[key]);
    }

    return total_weight;
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
              className="max-w-full h-auto mx-auto"
              src={import.meta.env.VITE_HOST_URL_TPLANET + project.img}
              alt=""
            />
            <div className="row mt-4 pb-4 border-b">
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
            <div className="row mt-4 border-b">
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
            <div className="row mt-4 pb-4 border-b">
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
              className="row mt-5 pb-4 border-b"
              id="project_weight_description"
            >
              <SdgsWeight data={project.weight_description} />
            </div>
            <div className="row mt-4 pb-4 border-b">
              <div className="col-md-6">
                <div className="d-md-flex flex-col justify-center h-full">
                  <p
                    className="font-bold text-center mb-md-2 text-blue"
                    style={{ fontSize: "96px", fontFamily: "Rozha One" }}
                    id="relate_people"
                  >
                    {totalWeight}
                  </p>
                  <p className="text-center small mb-md-2">關係人口</p>
                  <p
                    className="font-bold text-center mb-md-2 text-blue"
                    style={{ fontSize: "90px", fontFamily: "Rozha One" }}
                    id="budget"
                  >
                    {project.is_budget_revealed ? project.budget : "-"}
                  </p>
                  <p className="text-center small">計畫金額</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex h-full items-center justify-center">
                  <SdgsChart projectUuid={project.uuid} id="project" />
                </div>
              </div>
            </div>

            <div className="tabs mt-4">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <a
                    className="h5 font-bold mr-2 no-underline hover:underline"
                    href="#tasks_container"
                  >
                    成果展現
                  </a>
                  <a
                    className="h5 font-bold mr-2 no-underline hover:underline"
                    href="#sroi-section"
                  >
                    SROI
                  </a>
                </div>
              </div>
              <div id="tasks_container" className="tabs-section row">
                {tasks.map((task, index) => (
                  <div key={index} className="row mt-4" id={`task_${index}`}>
                    <div className="col-md-6">
                      <img
                        src={
                          import.meta.env.VITE_HOST_URL_TPLANET + task.thumbnail
                        }
                      />
                    </div>
                    <div className="col-md-6 mt-4 mt-md-0">
                      <SdgsChart
                        projectUuid={project.uuid}
                        title="永續指標"
                        id="task"
                      />
                    </div>
                    <div className="col-12 mb-2 font-bold">
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <h5 className="text-textColor font-bold">
                            活動設計名稱: {task.name}
                          </h5>
                        </div>
                        <div className="col-md-6 md:text-right">
                          {" "}
                          <p className="flex flex-wrap justify-center justify-md-end">
                            {taskWeights[index] &&
                              generateSdgsIcons(taskWeights[index].join(","))}
                          </p>
                        </div>
                      </div>
                      <p>日期：{task.period}</p>
                      <p
                        className="mt-3 mb-2"
                        id="overview"
                        dangerouslySetInnerHTML={{ __html: task.overview }}
                      ></p>
                    </div>
                    <p className="bg-light ml-2 p-2 text-wrap">NFT:</p>
                  </div>
                ))}
              </div>
              <div id="sroi-section" className="tabs-section pt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
