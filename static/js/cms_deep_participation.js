import {
  task_submit,
  deep_deleted_task,
  list_children_tasks,
  get_task_info,
  add_to_child_task_queue,
  remove_child_task_queue,
} from "./tasks.js";
import {
  compileHandlebars,
  renderHandlebarsAppendTo,
  renderHandlebarsAppendToBody,
} from "./utils/handlebars.js";
var element_id;

const render_child_task = (child_uuid) => {
  var obj_task = get_task_info(child_uuid);

  let data = { ...obj_task };
  if (obj_task.period && obj_task.period.split("-").length == 2) {
    const [start_time, end_time] = obj_task.period.split("-");
    data = { ...data, start_time, end_time };
  }

  // Get task content
  const obj_task_content = JSON.parse(obj_task.content);

  const sdgs_indexes = Object.entries(obj_task_content)
    .map(([key, value]) => {
      let index = parseInt(key.replace("sdgs-", ""));
      index = ("0" + index).slice(-2);
      return { index, value };
    })
    .filter(({ value }) => value == "1")
    .map(({ index }) => index);
  data = { ...data, sdgs_indexes };

  $("#deep_div_parent_task").on("click", "#remove_button", (e) => {
    const uuid = $(e.target).attr("data-uuid");
    $("#deleteModal #deep_delete_task").attr(
      "onclick",
      `showDeleteModal('${uuid}')`
    );
    $("#deleteModal").modal("show");
  });

  renderHandlebarsAppendTo("deep_div_parent_task", "tpl-child-task", data);
  add_to_child_task_queue(obj_task.uuid);

  $("#task_start_date_" + obj_task.uuid).timepicker();
  $("#task_due_date_" + obj_task.uuid).timepicker();
};

export function set_page_info_cms_deep_participation() {
  if (WEIGHT[1] == 1) $("#five").css("display", "block");
  if (WEIGHT[2] == 1) $("#community").css("display", "block");

  var index = 0;
  while (true) {
    if (document.getElementById("task_start_date_" + index) == null) break;
    $("#task_start_date_" + index).datepicker();
    $("#task_due_date_" + index).datepicker();

    index++;
  }

  // Load child tasks
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var uuid_parent = urlParams.get("task");

  var list_uuid_child_child_tasks = list_children_tasks(uuid_parent);

  if (list_uuid_child_child_tasks.length == 0) return;

  for (var index; index < list_uuid_child_child_tasks.length; index++) {
    const child_uuid = list_uuid_child_child_tasks[index];
    render_child_task(child_uuid);
  }
}

export function deep_participation_add_child_task_block(obj_task) {
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var uuid_project = urlParams.get("uuid");
  var uuid_parent = urlParams.get("task");
  var gps = urlParams.get("gps");

  var uuid_child = null;
  var task_parent_id = { task_parent_id: uuid_parent };

  var form = new FormData();
  form.append("email", getLocalStorage("email"));
  form.append("uuid", uuid_project);
  form.append("tasks", JSON.stringify([task_parent_id]));
  form.append("gps_flag", gps);

  var obj_task = task_submit(form);
  if (obj_task.result == true) {
    uuid_child = obj_task.task;
    render_child_task(uuid_child);
  } else {
    console.log("Error, submit task failed.");
    return;
  }
}

//
export function showDeleteModal(uuid_task) {
  $("#deleteModal").modal("show");
  var delete_uuid = document.querySelector("#delete_uuid");
  delete_uuid.innerText = "確定刪除此活動設計" + uuid_task + "。";

  // Delete task
  deep_deleted_task(uuid_task);
  // Update local storage
  remove_child_task_queue(uuid_task);

  location.reload();
}

export function showSDGsModal() {
  $("#SDGsModal").modal("show");
}

$(function () {
  $("#deep_participation_add_child_tasks").on("click", function (e) {
    e.preventDefault();
    deep_participation_add_child_task_block();
  });
});

$("#deep_div_parent_task").on("click", "#icon_btn", (e) => {
  element_id = e.target.parentNode.parentNode.id;

  $(".sdgs-modal .sdgs-modal-item").show();
  $(".sdgs-modal .sdgs-modal-item").css("background-color", "");

  const indexes = $(e.target)
    .closest(".sdgs-container")
    .find(".sdgs-item")
    .toArray()
    .map((element) => $(element).attr("data-index"));
  console.log(indexes);


  $(".sdgs-modal .sdgs-modal-item")
    .toArray()
    .filter((element) => indexes.includes($(element).attr("data-index")))
    .map((element) => $(element).hide());

  $("#SDGsModal").modal("show");
});

const NOT_SET_BACKGROUND_COLORS = ["rgba(0, 0, 0, 0)", "rgb(255, 255, 255)"];

$(function () {
  $("body").on("click", ".sdgs-item .close", (e) => {
    e.preventDefault();
    $(e.target).parents(".sdgs-item").remove();
  });

  $("body").on("click", ".sdgs-modal .sdgs-modal-item", (e) => {
    e.preventDefault();
    const item = $(e.target).closest(".sdgs-modal-item");
    const color = item.css("background-color");
    if (NOT_SET_BACKGROUND_COLORS.includes(color)) {
      item.css("background-color", "gray");
    } else {
      item.css("background-color", "");
    }
  });

  $("body").on("click", '.sdgs-modal [data-dismiss="modal"]', () => {
    $(".sdgs-modal").modal("hide");
  });

  $("body").on("click", ".sdgs-modal .btn-primary", function (e) {
    e.stopPropagation();
    const sdgs_indexes = $(".sdgs-modal .sdgs-modal-item")
      .toArray()
      .filter((element) => {
        const color = $(element).css("background-color");
        return !NOT_SET_BACKGROUND_COLORS.includes(color);
      })
      .map((element) => $(element).attr("data-index"));

    sdgs_indexes.map((index) => {
      const found = $(`#${element_id} .sdgs-item`)
        .toArray()
        .find((element) => {
          return parseInt(index) < parseInt($(element).attr("data-index"));
        });

      if (found) {
        $(found).before(compileHandlebars("tpl-sdgs-item", { index }));
      } else {
        renderHandlebarsAppendTo(element_id, "tpl-sdgs-item", { index });
      }
    });

    $("#SDGsModal").modal("hide");
  });
});
