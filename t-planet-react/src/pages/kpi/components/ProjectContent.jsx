import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import placeMarker from "../../../assets/place_marker.svg";
import { plan_info } from "../../../utils/Plan";
import generateSdgsIcons from "../../../utils/sdgs/SdgsImg";
import SdgsWeight from "../../../utils/sdgs/SdgsWeight";

export default function ProjectContent() {
  const [project, setProject] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        const projectData = await plan_info(id);
        setProject(projectData);
      }
    };

    fetchProject();
  }, [id]);

  console.log(project.weight_description);

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
              {/* {project.weight_description} */}
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
                    {project.relate_people}
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
                  <div className="w-full" id="obj_digital_fp_chart1"></div>
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
              <div id="tasks_container" className="tabs-section row"></div>
              <div id="sroi-section" className="tabs-section pt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
