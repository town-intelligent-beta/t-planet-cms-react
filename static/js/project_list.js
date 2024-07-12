import { list_plans, plan_info } from "./plan.js";

export function set_page_info_project_list() {
  const yearFilterSelect = document.getElementById("year_filter");
  var list_project_uuids = [];
  var list_years = [];

  const selectAllOption = document.createElement("option");
  selectAllOption.value = "all";
  selectAllOption.textContent = "全部";
  yearFilterSelect.appendChild(selectAllOption);

  for (var index = 0; index < SITE_HOSTERS.length; index++) {
    try {
      var obj_list_projects = list_plans(SITE_HOSTERS[index], null);
      list_project_uuids = list_project_uuids.concat(
        obj_list_projects.projects
      );

      obj_list_projects.projects.forEach((project_uuid) => {
        var project_info = plan_info(project_uuid);
        if (project_info && project_info.period) {
          var startYear = new Date(
            project_info.period.split("-")[0]
          ).getFullYear();
          list_years.push(startYear);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  list_years = Array.from(new Set(list_years)).sort();

  list_years.forEach((year) => {
    if (!isNaN(year) && year !== undefined) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearFilterSelect.appendChild(option);
    }
  });

  yearFilterSelect.addEventListener("change", function () {
    const selectedValue = this.value;

    if (selectedValue === "all") {
      displayAllProjects(list_project_uuids);
    } else {
      const selectedYear = parseInt(selectedValue);
      const filteredProjectUUIDs = filterProjectsByYear(
        selectedYear,
        list_project_uuids
      );
      displayFilteredProjects(filteredProjectUUIDs);
    }
  });

  function displayFilteredProjects(filteredProjectUUIDs) {
    const projectContainer = document.getElementById("project_container");
    projectContainer.innerHTML = "";
    filteredProjectUUIDs.forEach((project_uuid) => {
      const obj_project = plan_info(project_uuid);
      const str_project_block_in_project_page_innetHTML =
        generateProjectBlockHTML(obj_project);
      const project_block = document.createElement("div");
      project_block.className = "col-md-4";
      project_block.innerHTML = str_project_block_in_project_page_innetHTML;
      projectContainer.appendChild(project_block);
    });
  }

  function displayAllProjects(projectUUIDs) {
    const projectContainer = document.getElementById("project_container");
    projectContainer.innerHTML = "";
    projectUUIDs.forEach((project_uuid) => {
      const obj_project = plan_info(project_uuid);
      const str_project_block_in_project_page_innetHTML =
        generateProjectBlockHTML(obj_project);
      const project_block = document.createElement("div");
      project_block.className = "col-md-4";
      project_block.innerHTML = str_project_block_in_project_page_innetHTML;
      projectContainer.appendChild(project_block);
    });
  }

  list_project_uuids.forEach((project_uuid) => {
    var obj_project = plan_info(project_uuid);
    var str_project_block_in_project_page_innetHTML =
      generateProjectBlockHTML(obj_project);
    var project_block = document.createElement("div");
    project_block.className = "col-md-4";
    project_block.innerHTML = str_project_block_in_project_page_innetHTML;
    var obj_project_container = document.getElementById("project_container");
    obj_project_container.append(project_block);
  });
}

function filterProjectsByYear(selectedYear, list_project_uuids) {
  const filteredProjects = list_project_uuids.filter((project_uuid) => {
    const project_info = plan_info(project_uuid);
    if (project_info && project_info.period) {
      const startYear = new Date(
        project_info.period.split("-")[0]
      ).getFullYear();
      return startYear === selectedYear;
    }
    return false;
  });
  return filteredProjects;
}

function generateProjectBlockHTML(obj_project) {
  let str_project_block_in_project_page_innetHTML = `<a class="text-dark" href="/cms_project_detail.html?uuid=${
    obj_project.uuid
  }" style="display: block; text-decoration:none">

    <div class="card mb-4 kpi-card" style="border-radius: 20px;">
      <div class="d-flex justify-content-center">
        <div class="img-fluid bg-cover shadow" style="background-repeat: no-repeat; background-position: center center; background-size: cover; background-image:url(${
          obj_project.img ? HOST_URL_TPLANET_DAEMON + obj_project.img : "#"
        }); width:100% ;height:200px; border-radius: 18px;"></div>
      </div>
      <div class="card-body d-flex flex-column">
        <p class="h5">${obj_project.name}</p>
        <p class="card-text mt-4">永續企業:<span class="pl-2">${
          obj_project.project_a
        }<span></p>
        <p class="card-text">地方團隊:<span class="pl-2">${
          obj_project.project_b
        }<span></p>
        <p class="card-text">期間: <span class="pl-2">${
          obj_project.period ? obj_project.period.split("-")[0] : ""
        } ~ ${
    obj_project.period ? obj_project.period.split("-")[1] : ""
  }<span></p>
        <p class="card-text">預算: <span class="pl-2">新台幣 ${
          obj_project.budget
        } 元<span></p>
        <a href="/content.html?uuid=${
          obj_project.uuid
        }" class="stretched-link"></a>
        <div class="row mt-3">
          ${generateSDGsHTML(obj_project.weight)}
        </div>
      </div>
    </div>
  </a>`;

  return str_project_block_in_project_page_innetHTML;
}

function generateSDGsHTML(weight) {
  if (!weight) return "";

  const list_weight = weight.split(",");
  let sdg = "";
  for (let index_segs = 0; index_segs < list_weight.length; index_segs++) {
    if (parseInt(list_weight[index_segs]) === 1) {
      const index_sdg = ("0" + (index_segs + 1)).slice(-2);
      sdg += `<div class="col-2 p-2" style="width:13%">
                <a href="#" class="stretched-link" style="position: relative; text-decoration: none;">
                  <img class="w-100" src="/static/imgs/SDGs_${index_sdg}.jpg" alt="">
                </a>
              </div>`;
    }
  }
  return sdg;
}
