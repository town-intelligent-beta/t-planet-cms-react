import { list_plan_tasks, plan_info } from "./plan.js";
import { task_submit, get_task_info, onclickuploadTaskCover } from "./tasks.js";
import { get_sorted_tasks } from "./utils/transformers.js";
export function add_parent_task_block(obj_task = null) {
  // Params
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var uuid = urlParams.get("uuid");
  if (obj_task == null) {
    // Create parent task, get parent uuid
    var uuid_parent = null;
    var form = new FormData();
    form.append("email", getLocalStorage("email"));
    form.append("uuid", uuid);
    var obj_task = task_submit(form);
    if (obj_task.result == true) {
      uuid_parent = obj_task.task;
    } else {
      console.log("Error, submit task failed.");
      return;
    }

    // Replace variable in str_parent_task_block
    var str_parent_task_innetHTML = str_parent_task_block.replaceAll(
      "UUID_TASK",
      uuid_parent
    );
    // Replace variable and generate block
    var parent_task_block = document.createElement("div");
    parent_task_block.innerHTML = str_parent_task_innetHTML;
    // Append
    var obj_form_parent_task = document.getElementById("div_parent_task");
    obj_form_parent_task.prepend(parent_task_block);
    // Set date picker
    $("#parent_task_start_date_" + uuid_parent).datepicker();
    $("#parent_task_due_date_" + uuid_parent).datepicker();
  } else {
    // Replace variable in str_parent_task_block
    var str_parent_task_innetHTML = str_parent_task_block.replaceAll(
      "UUID_TASK",
      obj_task.uuid.toString()
    );
    // Replace variable and generate block
    var parent_task_block = document.createElement("div");
    parent_task_block.innerHTML = str_parent_task_innetHTML;
    // Append
    var obj_form_parent_task = document.getElementById("div_parent_task");
    obj_form_parent_task.append(parent_task_block);
    // Set date picker
    $("#parent_task_start_date_" + obj_task.uuid).datepicker();
    $("#parent_task_due_date_" + obj_task.uuid).datepicker();
    // Set block data
    document.getElementById("parent_task_name_" + obj_task.uuid).value =
      obj_task.name;
    var list_period = [];
    try {
      list_period = obj_task.period.split("-");
    } catch (e) {}
    if (list_period.length == 2) {
      document.getElementById("parent_task_start_date_" + obj_task.uuid).value =
        list_period[0];
      document.getElementById("parent_task_due_date_" + obj_task.uuid).value =
        list_period[1];
    }
    document.getElementById("parent_task_overview_" + obj_task.uuid).value =
      obj_task.overview;
    // cover
    var path_cover =
      HOST_URL_TPLANET_DAEMON +
      "/static/project/" +
      uuid +
      "/tasks/" +
      obj_task.uuid +
      "/cover.png";
    document.getElementById(
      "divUploadImg_" + obj_task.uuid
    ).style.backgroundImage = "";
    document.getElementById("btnUploadImg_" + obj_task.uuid).style.display =
      "none";
    document.getElementById("coverImg_" + obj_task.uuid).style.backgroundImage =
      "url(" + path_cover + ")";
    document.getElementById(
      "coverImg_" + obj_task.uuid
    ).style.backgroundRepeat = "no-repeat";
    // document.getElementById("coverImg_" + obj_task.uuid).style.backgroundSize = "100% 100%";
    document.getElementById("coverImg_" + obj_task.uuid).style.backgroundSize =
      "cover";

    // Onclick
    var oDiv = document.getElementById("coverImg_" + obj_task.uuid);
    oDiv.onclick = function () {
      onclickuploadTaskCover(obj_task.uuid, null, null, null, true);
    };

    // GPS
    if (obj_task.gps == true) {
      try {
        document.getElementById("gps_flag_" + obj_task.uuid).checked = true;
      } catch (e) {
        console.log(e);
      }
    }
  }

  const textareaIds = [
    ...document.querySelectorAll("textarea[id^='parent_task_overview_']"),
  ].map((item) => `#${item.id}`);
  register_ckeditor(textareaIds);
}
function add_sdgs_comment(index, des) {
  // Format index
  var index = ("0" + (index + 1)).slice(-2);
  // Get textedit
  if (typeof des != "undefined") {
    document.getElementById("sdg_" + index + "_des").innerText = des;
  } else {
    document.getElementById("sdg_" + index + "_des").innerText = "";
  }
}
function add_sdgs_input(index) {
  // Format index
  var index = ("0" + (index + 1)).slice(-2);
  // Get container
  var obj_sdgs_container = document.getElementById("sdgs_container");
  // Create SDGs element
  // <div class="d-flex mt-2">
  var obj_div = document.createElement("div");
  obj_div.className = "d-flex mt-2";
  // Create image
  // <img src="/static/imgs/SDGs_11.jpg" alt="" style="width:60px">
  var img = document.createElement("img");
  img.src = "/static/imgs/SDGs_" + index + ".jpg";
  img.setAttribute("width", "60px");
  img.setAttribute("height", "60px");
  // Create input
  // <textarea class="form-control ml-3" placeholder="填寫符合此指標的執行方式" style="resize: none"></textarea>
  var obj_textarea = document.createElement("textarea");
  obj_textarea.id = "sdg_" + index + "_des";
  obj_textarea.className = "form-control ml-3";
  obj_textarea.placeholder = "填寫符合此指標的執行方式";
  obj_textarea.style = "resize: none; height: 62px;";
  // Append
  obj_div.appendChild(img);
  obj_div.appendChild(obj_textarea);
  obj_sdgs_container.append(obj_div);
}

export function set_page_info_cms_impact(uuid) {
  var obj_plan = plan_info(uuid);
  var list_sdgs_input = [];
  try {
    list_sdgs_input = obj_plan.weight.split(",");
  } catch (e) {}
  var obj_sdgs_comment = "";
  try {
    obj_sdgs_comment = JSON.parse(obj_plan.weight_description);
  } catch (e) {}
  for (var index = 0; index < list_sdgs_input.length; index++) {
    if (parseInt(list_sdgs_input[index]) == 1) {
      add_sdgs_input(index);
      if (obj_sdgs_comment == null) {
        continue;
      }
      add_sdgs_comment(index, obj_sdgs_comment[index.toString()]);
    }
  }
  // Add parent task block list
  var list_parent_task_uuid = list_plan_tasks(uuid, 1);
  if (list_parent_task_uuid.result == false) {
    return;
  }

  const tasks = list_parent_task_uuid.tasks.map((task_uuid) =>
    get_task_info(task_uuid)
  );
  const sorted_tasks = get_sorted_tasks(tasks);
  sorted_tasks.map((task) => {
    add_parent_task_block(task);
  });
}
// Add_parent_tasks
$(function () {
  $("#add_parent_tasks").on("click", function (e) {
    e.preventDefault(); // To prevent following the link (optional)
    // add_blank_parent_task_block();
    add_parent_task_block();
  });
});
