import { list_plans, plan_info } from './plan.js'
import { getWeightMeta } from './api/weight.js';

const allWeights = [];
if (allWeights.length === 0) {
  for (let i = 0; i < WEIGHTS.length; i++) {
    try {
      const weightData = await getWeightMeta(WEIGHTS[i]);
      allWeights.push(...weightData.content.categories);
    } catch (error) {
      console.error("Error fetching or processing weight data:", error);
    }
  }
}

export function set_page_info_kpi_filter() {
  // Params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var index_sdg = urlParams.get("sdg")

  // Get all projects
  var list_project_uuids = [];
  for (var index = 0; index < SITE_HOSTERS.length; index++) {
    try {
      var obj_list_projects = list_plans(SITE_HOSTERS[index], null);
      list_project_uuids = list_project_uuids.concat(obj_list_projects.projects);
    } catch(e) { console.log(e) }
  }

  // Change SDG icon
  document.getElementById("sdg_icon").src = "/static/imgs/weight/" + (parseInt(index_sdg) + 1).toString() + ".svg";

  // Projects
  var obj_project_list = document.getElementById("project_list");
  for (var index = 0; index < list_project_uuids.length; index++) {
    // Get project info
    var obj_project = plan_info(list_project_uuids[index]);

    var obj_div_col_md_4 = document.createElement("div");
    obj_div_col_md_4.className = "col-md-4 mt-4";

    var obj_div_card_md4 = document.createElement("div");
    obj_div_card_md4.className = "card mb-4  h-100 rounded-0";

    var obj_a_href = document.createElement("a");
    obj_a_href.className ="stretched-link";
    obj_a_href.href = location.protocol + "//" +
    window.location.host +
    "/backend/cms_project_detail.html?uuid=" +
    obj_project.uuid;
    obj_div_card_md4.append(obj_a_href);

    var obj_div_d_flex = document.createElement("div");
    obj_div_d_flex.className = "d-flex justify-content-center";

    var obj_project_img = document.createElement("div");
    obj_project_img.className = "img-fluid bg-cover";

    if (obj_project.img != null) {
      var path_cover = HOST_URL_TPLANET_DAEMON +
      "/static/project/" + obj_project.uuid +
      "/media/cover/cover.png";
      obj_project_img.style = "background-image:url(" + path_cover + "); width:100% ;height:200px; background-repeat: no-repeat";
    }

    // Append
    obj_div_d_flex.append(obj_project_img);
    obj_div_card_md4.append(obj_div_d_flex);
    obj_div_col_md_4.append(obj_div_card_md4);

    var obj_div_card_body_project = document.createElement("div");
    obj_div_card_body_project.className = "card-body d-flex flex-column";

    var obj_p_project_name = document.createElement("p");
    obj_p_project_name.className = "h5";
    obj_p_project_name.innerHTML = obj_project.name;

    // Append
    obj_div_card_body_project.append(obj_p_project_name);
    obj_div_card_md4.append(obj_div_card_body_project);

    var obj_p_project_a = document.createElement("p");
    obj_p_project_a.className = "card-text mt-4";
    obj_p_project_a.innerHTML = "永續企業: ";
    var obj_span_project_a = document.createElement("span");
    obj_span_project_a.className = "pl-2";
    obj_span_project_a.innerHTML = obj_project.project_a;

    // Append
    obj_p_project_a.append(obj_span_project_a);
    obj_div_card_body_project.append(obj_p_project_a);

    var obj_p_project_b = document.createElement("p");
    obj_p_project_b.className = "card-text";
    obj_p_project_b.innerHTML = "地方團隊: ";
    var obj_span_project_b = document.createElement("span");
    obj_span_project_b.className = "pl-2";
    obj_span_project_b.innerHTML = obj_project.project_b;

    // Append
    obj_p_project_b.append(obj_span_project_b);
    obj_div_card_body_project.append(obj_p_project_b);
    var obj_p_period = document.createElement("p");
    obj_p_period.className = "card-text";
    obj_p_period.innerHTML = "期間: ";
    var obj_span_period = document.createElement("span");
    obj_span_period.className = "pl-2";
    obj_span_period.innerHTML = obj_project.period;

    // Append
    obj_p_period.append(obj_span_period);
    obj_div_card_body_project.append(obj_p_period);

    // <div class="row mt-3">
    var obj_sdg_container = document.createElement("div");
    obj_sdg_container.className = "row mt-3";
    var obj_a = document.createElement("a");

    obj_a.href = "#";

    var list_sdgs = [];
    try {
      list_sdgs = obj_project.weight.split(",");
    } catch (e) {}
      for (var index_sdgs=0; index_sdgs<list_sdgs.length; index_sdgs++){
        if (parseInt(list_sdgs[index_sdgs]) != 0) {
          var obj_sdg_div = document.createElement("div");
          obj_sdg_div.className = "col-2 px-2 mt-2";

          var obj_sdg_img = document.createElement("img");
          obj_sdg_img.className = "w-100";

          obj_sdg_img.src = allWeights[index_sdgs].thumbnail;
          obj_sdg_img.alt = "";

          obj_sdg_div.append(obj_sdg_img);
          obj_sdg_container.append(obj_sdg_div);
        }
        obj_div_card_body_project.append(obj_sdg_container);
      }

    /* Append */
    obj_project_list.append(obj_div_col_md_4);
  }
}