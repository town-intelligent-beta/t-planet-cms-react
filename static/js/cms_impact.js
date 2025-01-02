import { list_plan_tasks, plan_info } from "./plan.js";
import { task_submit, get_task_info, onclickuploadTaskCover } from "./tasks.js";
import { get_sorted_tasks } from "./utils/transformers.js";
import { getWeightMeta } from './api/weight.js';

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

export const add_sdgs_comment = async (index, des) => {
  var index = ("0" + (index + 1)).slice(-2);
  if (typeof des != "undefined") {
    document.getElementById("sdg_" + index + "_des").innerText = des;
  } else {
    document.getElementById("sdg_" + index + "_des").innerText = "";
  }
};

async function add_sdgs_inputs(index, allWeights) {
  try {
    const obj_sdgs_container = document.getElementById("sdgs_container");

    allWeights.forEach((category, idx) => {
      if (parseInt(index[idx]) === 1) {
        const obj_div = document.createElement("div");
        obj_div.className = "d-flex mt-2";

        const img = document.createElement("img");
        img.src = category.thumbnail;
        img.setAttribute("width", "60px");
        img.setAttribute("height", "60px");

        const obj_textarea = document.createElement("textarea");
        const paddedIndex = ("0" + (idx+1)).slice(-2);
        obj_textarea.id = `sdg_${paddedIndex}_des`;
        obj_textarea.className = "form-control ml-3";
        obj_textarea.placeholder = "填寫符合此指標的執行方式";
        obj_textarea.style = "resize: none; height: 62px;";

        obj_div.appendChild(img);
        obj_div.appendChild(obj_textarea);
        obj_sdgs_container.append(obj_div);
      }
    });
  } catch (error) {
    console.error("Error fetching or processing weight data:", error);
  }
}

export const set_page_info_cms_impact = async (uuid) => {
  var obj_plan = plan_info(uuid);
  var list_sdgs_input = [];
  try {
    list_sdgs_input = obj_plan.weight.split(",");
  } catch (e) {}

  var obj_sdgs_comment = "";
  try {
    obj_sdgs_comment = JSON.parse(obj_plan.weight_description);
  } catch (e) {}

  var ai_sdgs = JSON.parse(localStorage.getItem('ai_sdgs') || "{}");
  const allWeights = [];

  for (let i = 0; i < WEIGHTS.length; i++) {
    const weightData = await getWeightMeta(WEIGHTS[i]);
    allWeights.push(...weightData.content.categories);
  }

  await add_sdgs_inputs(list_sdgs_input, allWeights);

  for (var index = 0; index < list_sdgs_input.length; index++) {
    if (parseInt(list_sdgs_input[index]) == 1) {
      if (obj_sdgs_comment === null || obj_sdgs_comment[index.toString()] == null || obj_sdgs_comment[index.toString()] == "" || obj_sdgs_comment[index.toString()] == undefined){
        const ai_sdgs_index = (index + 1).toString();
        if (ai_sdgs[ai_sdgs_index]) {
          await add_sdgs_comment(index, ai_sdgs[ai_sdgs_index]);
        }
      } else {
        await add_sdgs_comment(index, obj_sdgs_comment[index.toString()]);
      }
    }
  }

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


  const textareaIds = [
    ...document.querySelectorAll("textarea[id^='sdg_']"),
    ...document.querySelectorAll("textarea[id^='parent_task_overview_']"),
  ].map((item) => `#${item.id}`);
  register_ckeditor(textareaIds);

}

$(function () {
  $("#add_parent_tasks").on("click", function (e) {
    e.preventDefault();
    add_parent_task_block();
  });
});