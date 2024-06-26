import { list_plan_tasks } from "./plan.js";
import { get_task_info, list_children_tasks } from "./tasks.js";

export function set_page_info_admin_project_verify(uuid) {
  // Params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var parent = urlParams.get("parent");

  var obj_parent_tasks = null;
  if (parseInt(parent) == 1) {
    obj_parent_tasks = list_plan_tasks(uuid, parseInt(parent));
    if (obj_parent_tasks.tasks.length == 0) return;
  } else {
    obj_parent_tasks = list_children_tasks(uuid);
    if (obj_parent_tasks.length == 0) return;
  }

  var list_parent_tasks = [];

  if (parseInt(parent) == 1) {
    list_parent_tasks = obj_parent_tasks.tasks;
  } else {
    list_parent_tasks = obj_parent_tasks;
  }

  var obj_parent_tasks = document.getElementById("parent_tasks");

  list_parent_tasks.sort((a, b) => {
    const startDateA = getStartDate(get_task_info(a));
    const startDateB = getStartDate(get_task_info(b));

    if (startDateA !== "-" && startDateB !== "-") {
      return new Date(startDateB) - new Date(startDateA);
    }

    if (startDateA === "-" && startDateB !== "-") return 1;
    if (startDateA !== "-" && startDateB === "-") return -1;
    return 0;
  });

  for (var index = 0; index < list_parent_tasks.length; index++) {
    var obj_task = get_task_info(list_parent_tasks[index]);
    var obj_tr = document.createElement("tr");

    // Task name and icon
    var obj_td_task_name = document.createElement("td");
    var obj_task_img = document.createElement("img");
    obj_task_img.style = "float:left; margin-right:30px;";
    obj_task_img.src = "/static/imgs/drag-icon.svg";

    var obj_task_name = document.createElement("span");
    obj_task_name.style = "display:inline-block; text-align:center;";
    obj_task_name.innerText = obj_task.name;

    obj_td_task_name.append(obj_task_img);
    obj_td_task_name.append(obj_task_name);

    // Task type
    var obj_td_task_type = document.createElement("td");
    obj_td_task_type.className = "align-middle text-center";

    // <button class="btn btn-verify btn-sm rounded-pill">
    var obj_btn_verify = document.createElement("a");
    obj_btn_verify.className = "btn btn-verify btn-sm rounded-pill";
    obj_btn_verify.innerHTML = "驗證";

    if (parseInt(parent) == 0) {
      obj_btn_verify.href =
        "/backend/admin_project_check.html?uuid=" + list_parent_tasks[index];
    } else {
      obj_btn_verify.href =
        "/backend/admin_project_verify.html?uuid=" +
        list_parent_tasks[index] +
        "&parent=0";
    }

    obj_td_task_type.append(obj_btn_verify);

    // Task period
    var obj_td_task_period = document.createElement("td");
    obj_td_task_period.className = "text-verify-date";
    obj_td_task_period.innerHTML = obj_task.period;

    // Append to tbody
    obj_tr.append(obj_td_task_name);
    obj_tr.append(obj_td_task_type);
    obj_tr.append(obj_td_task_period);
    obj_parent_tasks.append(obj_tr);

    console.log(obj_task.name);
  }
}

function getStartDate(taskInfo) {
  const period = taskInfo.period.trim();
  const dateRegex = /(\d{2}\/\d{2}\/\d{4})/;
  const match = period.match(dateRegex);
  if (match) {
    return match[1];
  }
  return "-";
}
