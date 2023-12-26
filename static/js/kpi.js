import { list_plans, plan_info, list_plan_tasks, getProjectWeight, addWeight } from './plan.js'
import { set_page_info_project_list } from './project_list.js'
import { commonImages, draw_bar, draw_bar_chart, fiveImges, getMappedSdgData, sdgImages } from './chart/bar.js'
import { getWeightList, getWeight } from "./api/weight.js";


export function set_page_info_project_counts(uuid_project) {
  var weight = {};

  try {
    var obj_project = plan_info(uuid_project);
    var obj_parent_tasks = list_plan_tasks(obj_project.uuid, 1);
    weight = getProjectWeight(obj_parent_tasks.tasks);
  } catch (e) { return; }

  for (var index = 1; index < 28; index++) {
    if (weight["sdgs-" + index.toString()] != "0") {
      try {
        document.getElementById("pc_" + index.toString()).innerText =
        parseInt(document.getElementById("pc_" + index.toString()).innerText) + 1;
      } catch (e) { console.log(e) }
    }
  }
}

export function set_relate_people_and_project_counts(totalProjectWeight, list_project_uuids) {
  if (WEIGHT[1] == 1)
    $('#five_life_kpi').css('display', 'block');
  if (WEIGHT[2] == 1)
    $('#community_kpi').css('display', 'block');

  // 關係人口
  var total_sdgs_weight = 0;
  for (var index = 1; index < 28; index++) {
    try {
      total_sdgs_weight = total_sdgs_weight + parseInt(totalProjectWeight["sdgs-" + index]);
      document.getElementById("rp_" + index.toString()).innerText = totalProjectWeight["sdgs-" + index.toString()];
    } catch (e) { console.log(e) }
  }

  try {
    document.getElementById("rp_total_sdgs").innerText = total_sdgs_weight.toString();
  } catch (e) { console.log(e) }

  // 專案件數
  list_project_uuids.forEach(set_page_info_project_counts);
}

export function get_total_project_weight(list_project_uuids) {
    // Get Project weigh
    if (list_project_uuids.length != 0) {
      var totalProjectWeight = {};
    }
    for (var index = 0; index < list_project_uuids.length; index++) {
      var obj_project = plan_info(list_project_uuids[index]);
      var obj_parent_tasks = list_plan_tasks(obj_project.uuid, 1);

      var weight = {}
      try {
        if (obj_parent_tasks.tasks.length != 0) {
          weight = getProjectWeight(obj_parent_tasks.tasks);
        }
      } catch (e) { console.log(e) }

      totalProjectWeight = addWeight(totalProjectWeight, weight)
    }

    return totalProjectWeight;
}

export function draw_sdgs_chart(totalProjectWeight) {
  // Remove useless weight
  Object.keys(totalProjectWeight).forEach(function(key){
    if (parseInt(key.substring(5,7)) > 17){
      delete totalProjectWeight[key];
    }
  });

  const array_weight_colors = ["#e5243b", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1", "#0075A1"]
  draw_bar_chart({
    elementId: "weight_sdgs",
    title: "永續發展指標",
    data: totalProjectWeight,
    backgroundColor: array_weight_colors,
    images: sdgImages,
  });
}
export function draw_five_chart(totalProjectWeight) {
  // Remove useless weight
  Object.keys(totalProjectWeight).forEach(function(key){
    if (18 > parseInt(key.substring(5,7)) || parseInt(key.substring(5,7)) > 22) {
      delete totalProjectWeight[key];
    }
  });

  draw_bar_chart({
    elementId: "weight_five",
    title: "人文地產景",
    data: getMappedSdgData(totalProjectWeight),
    backgroundColor: "#0075A1",
    images: fiveImges,
  });
}

export function draw_comm_chart(totalProjectWeight) {
  // Remove useless weight
  Object.keys(totalProjectWeight).forEach(function(key){
    if (23 > parseInt(key.substring(5,7)) || parseInt(key.substring(5,7)) > 28) {
      delete totalProjectWeight[key];
    }
  });

  draw_bar_chart({
    elementId: "weight_comm",
    title: "德智體群美",
    data: getMappedSdgData(totalProjectWeight),
    backgroundColor: "#28a745",
    images: commonImages,
  });
}

const list_icons = async (name, obj_weight) => {
  // Header
  let rowDiv = document.createElement('div');
  rowDiv.className = 'row justify-content-center';
  let colDiv = document.createElement('div');
  colDiv.className = 'col-10';
  let h3 = document.createElement('h3');
  h3.className = 'text-center fw-bold';
  h3.textContent = name;
  colDiv.appendChild(h3);
  rowDiv.appendChild(colDiv);
  document.getElementById("relative_people_icons").appendChild(rowDiv);

  // Icons
  let list_content = obj_weight.content;

  let listWeightIcons = document.createElement('div');
  listWeightIcons.className = "row mt-md-4 justify-content-center";

  for (var info_weight of list_content) {
    // 創建 col 元素
    let colDiv = document.createElement('div');
    colDiv.className = 'col-6 col-md-2 mb-4';

    // 創建 card 元素
    let cardDiv = document.createElement('div');
    cardDiv.className = 'card rounded-0';

    // 創建 img 元素
    let img = document.createElement('img');
    img.src = `/static/imgs/${info_weight.icon}`;
    img.className = 'card-img-top rounded-0';

    // 將 img 元素添加到 card 元素
    cardDiv.appendChild(img);

    // 創建 card body 元素
    let cardBodyDiv = document.createElement('div');
    cardBodyDiv.className = 'card-body';

    // 創建第一個段落元素
    let p1 = document.createElement('p');
    p1.className = 'card-text';
    p1.innerHTML = '關係人口:<span id="rp_1">0</span>人';

    // 創建第二個段落元素
    let p2 = document.createElement('p');
    p2.className = 'card-text';
    p2.innerHTML = '專案件數:<span id="pc_1">0</span>件';

    // 創建超連結元素
    let a = document.createElement('a');
    a.href = '/kpi_filter.html?sdg=0';
    a.className = 'stretched-link';

    // 將段落和超連結元素添加到 card body 中
    cardBodyDiv.appendChild(p1);
    cardBodyDiv.appendChild(p2);
    cardBodyDiv.appendChild(a);

    // 將 card body 添加到 card 中
    cardDiv.appendChild(cardBodyDiv);

    // 將 card 添加到 col 中
    colDiv.appendChild(cardDiv);

    // 將 col 添加到 row 中
    /* document.getElementById("list_weight_icons").appendChild(colDiv); */
    listWeightIcons.appendChild(colDiv);
  }

  document.getElementById("relative_people_icons").appendChild(listWeightIcons);
}

export const set_page_info_kpi = async () => {
  // Get Weight
  let domainName = "https://" + window.location.hostname;
  let result_weight = await getWeightList(domainName);
  let list_weights = result_weight.content;

  for (var weight of list_weights) {
    let obj_weight = await getWeight(weight.uuid)
    list_icons(weight.name, obj_weight);
    // TODO
    // draw_comm_chart(totalProjectWeight_for_comm);
  }


  // Get all projects
  var list_project_uuids = [];
  for (var index = 0; index < SITE_HOSTERS.length; index++) {
    try {
      var obj_list_projects = list_plans(SITE_HOSTERS[index], null);
      list_project_uuids = list_project_uuids.concat(obj_list_projects.projects);
    } catch(e) { console.log(e) }
  }

  // Page info
  set_page_info_project_list();

  // Get total project weight
  var totalProjectWeight = get_total_project_weight(list_project_uuids);

  // Set relate people and project counts
  set_relate_people_and_project_counts(totalProjectWeight, list_project_uuids);

  // SDGS
  /*
  var totalProjectWeight_for_sdgs = Object.assign({}, totalProjectWeight);
  draw_sdgs_chart(totalProjectWeight_for_sdgs);
*/
  // 德智體群美
  /*
  if (WEIGHT[1] == 1) {
    var totalProjectWeight_for_five = Object.assign({}, totalProjectWeight)
    $('#chart_weight_five').css('display', 'block');
    draw_five_chart(totalProjectWeight_for_five);
  }
  */

  // 人文地產景
  /*
  if (WEIGHT[2] == 1) {
    var totalProjectWeight_for_comm = Object.assign({}, totalProjectWeight)
    $('#chart_weight_comm').css('display', 'block');
    draw_comm_chart(totalProjectWeight_for_comm);
  }
  */
}
