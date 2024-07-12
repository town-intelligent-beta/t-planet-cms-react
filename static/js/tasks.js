
/* function add_to_parent_task_queue(queue ,uuid) {
  if (getLocalStorage("parent_task_queue") != "") {
    queue = JSON.parse(getLocalStorage("parent_task_queue"));
  }
  queue.push(uuid);
  setLocalStorage("parent_task_queue", JSON.stringify(uuid));
}
function parent_task_queue(queue, uuid) {
  if (getLocalStorage("parent_task_queue") != "") {
    queue = JSON.parse(getLocalStorage("parent_task_queue"));
    queue = queue.filter(item => item !== uuid);

    setLocalStorage("parent_task_queue", JSON.stringify(queue));
  }
  return queue;
} */

export function add_to_child_task_queue(uuid) {
  var queue = [];
  if (getLocalStorage("child_task_queue") != "") {
    queue = JSON.parse(getLocalStorage("child_task_queue"));
  }
  queue.push(uuid);

  setLocalStorage("child_task_queue", JSON.stringify(queue));
}

export function remove_child_task_queue(uuid) {
  var queue = [];
  if (getLocalStorage("child_task_queue") != "") {
    queue = JSON.parse(getLocalStorage("child_task_queue"));
    queue = queue.filter(item => item !== uuid);
    setLocalStorage("child_task_queue", JSON.stringify(queue));
  }
  return queue;
}

export function deep_deleted_task(uuid){
  var dataJSON = {};
  dataJSON.uuid=uuid

  $.ajax({
    url:HOST_URL_TPLANET_DAEMON + "/tasks/del_task",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      const obj = JSON.parse(returnData);
      dataJSON = obj
      // delete_div(obj)
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return dataJSON;
}

// function delete_div(obj){
//   let name = document.getElementById("uuid_name")
//   let uuid = name.innerText
//   let outter = document.getElementById('uuid_parent')
//   if(obj.uuid = uuid){
//     outter.remove()
//   }
// }

export function deleted_task(uuid){
  var dataJSON = {};
  dataJSON.uuid=uuid

  $.ajax({
    url:HOST_URL_TPLANET_DAEMON + "/tasks/del_task",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      const obj = JSON.parse(returnData);
      dataJSON = obj
      location.reload()

    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return dataJSON;
}

export function get_task_info(uuid) {
  var dataJSON = {};
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/get/" + uuid,
    type: "GET",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       dataJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return dataJSON;
}
export function task_submit(form) {
  var resultJSON = {};
  $.ajax({
    "url": HOST_URL_TPLANET_DAEMON + "/tasks/new",
    "method": "POST",
    "async": false,
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       resultJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return resultJSON;
}
export function list_children_tasks(task) {
  var dataJSON = {};
  dataJSON.uuid = task;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/get_child_tasks",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       dataJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return dataJSON.task;
}

export async function submitTaskCover(base64Img, uuid_task) {
  return new Promise((resolve, reject) => {
    var resultJSON = {};
    var dataJSON = {};
    // dataJSON.email = getLocalStorage("email");
    dataJSON.uuid = uuid_task;
    dataJSON.img = base64Img;

    var settings = {
      url: HOST_URL_TPLANET_DAEMON + "/tasks/push_task_cover",
      type: "POST",
      async: true,
      crossDomain: true,
      data:  dataJSON,
    };
    $.ajax(settings).done(function (response) {
      resultJSON = JSON.parse(response);
      resolve(resultJSON); // 在响应解析后解析 Promise
    }).fail(function (error) {
      reject(error); // 在发生错误时拒绝 Promise
    });
  });
}

/* function submitTaskCover(base64Img, uuid_task) {
  var dataJSON = {};
  // dataJSON.email = getLocalStorage("email");
  dataJSON.uuid = uuid_task;
  dataJSON.img = base64Img;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/push_task_cover",
    type: "POST",
    async: true,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
      const obj = JSON.parse(returnData);
    }
  });
} */

export function onclickuploadTaskCover(uuid) {
  uploadTaskCover(uuid);
}

function prepare_task_cover_upload() {
  return new Promise(async (resolve, reject) => {
    await show_loading();
    resolve(true);
  });
}

export async function uploadTaskCover(uuid_task) {
  // Get project uuid
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var uuid = urlParams.get("uuid")

  // Preview
  await upload_image_file(443, 300, "coverImg_" + uuid_task, true);

  prepare_task_cover_upload().then(async function () {
    var coverImg = document.getElementById( "coverImg_" + uuid_task).style.backgroundImage.replace('url("', '');
    coverImg = coverImg.replace('")', '');

    var resultJSON = submitTaskCover(coverImg, uuid_task);

    return resultJSON;
  }).then(async function (resultJSON) {
    if (resultJSON.result == "true") {
      alert("更新成功");
    } else {
      alert("更新失敗，請洽系統管理員。");
    }
    stop_loading();
  });
}

export function child_task_submit(page){
  // Get DOM data for parent task
    if (getLocalStorage("child_task_queue") == "")
      return;

    // Get parent uuid
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var uuid = urlParams.get("uuid")
    var task = urlParams.get("task")

    var child_task_queue = JSON.parse(getLocalStorage("child_task_queue"));

    for (var index_child_task = 0; index_child_task < child_task_queue.length; index_child_task++) {
      var list_target_sdgs = [];
      var list_tasks = [];

      for (var index = 1; index < 18; index++) {
        var index_sdg = ("0" + index).slice(-2);
        if (document.getElementById("target_sdgs_" + index_sdg) == null) {
          continue;
        }
        // Get SDGs tasks
        var dataJSON = {};
        dataJSON.sdg = index;
        dataJSON.des = document.getElementById("target_sdgs_" + index_sdg).value;
        list_tasks.push(JSON.stringify(dataJSON));
      }
      // Set parent task
      var dataJSONTask = {};
      dataJSONTask.task_parent_id = task;
      list_tasks.push(JSON.stringify(dataJSONTask));
      setLocalStorage("list_target_sdgs", JSON.stringify(list_tasks));
      // Task submit ...
      var list_target_sdgs = getLocalStorage("list_target_sdgs");
      var obj_list_target_sdgs = JSON.parse(list_target_sdgs);

      /* if (obj_list_target_sdgs.length <= 1) {
        alert("您忘記新增權重了！");
        return false;
      } */

      var form = new FormData();
      // Add params cms_deep_participation.html
      var type = 3;
      form.append("task", child_task_queue[index_child_task]);

      form.append("name", document.getElementById("name_" + child_task_queue[index_child_task]).value);
      form.append("task_start_date", document.getElementById("task_start_date_" + child_task_queue[index_child_task]).value);
      form.append("task_due_date", document.getElementById("task_due_date_" + child_task_queue[index_child_task]).value);

      // Task submit
      form.append("uuid", uuid);

      // Add parent task ID
      var list_tasks = [];
      var pernet_task = {"task_parent_id": task}
      list_tasks.push(JSON.stringify(pernet_task))

      const container_id = "icon_container_" + child_task_queue[index_child_task];
      const items = $(`#${container_id} [id^=target_sdgs_]`).toArray();
      const task_data = items.map((item) => {
        const sdg = parseInt($(item).attr('id').replace("target_sdgs_",""));
        const data = {"sdg": sdg.toString(), "des": ""};
        return JSON.stringify(data);
      });
      list_tasks = [...list_tasks, ...task_data];

      form.append("tasks", list_tasks);
      form.append("email", getLocalStorage("email"));
      form.append("type", type);
      var obj_result = task_submit(form);
    }
    setLocalStorage("child_task_queue", "");
  return true;
}
export function get_task_comment(uuid) {
  var dataJSON = {};
  dataJSON.uuid = uuid;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/projects/get_task_comment",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       dataJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return dataJSON;
}
export function verify_task_on_tplanet(uuid, listEmail) {
  var dataJSON = {};
  dataJSON.uuid = uuid;
  dataJSON.listEmail = listEmail;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/verify_task",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       dataJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return dataJSON;
}

export function getTaskWeight(task_UUID) {
  var TaskWeight = {};
  var dataJSON = {};
  dataJSON.uuid = task_UUID;

  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/task_weight",
    type: "POST",
    async: false,
    crossDomain: true,
    data: dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       TaskWeight = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });

  return TaskWeight;
}

/* export function verify_task_on_eid(uuid, email) {
  var dataJSON = {};
  dataJSON.tasks_list = uuid;
  dataJSON.email = email;
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/tasks/verify",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       dataJSON = obj;
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
  return dataJSON;
} */
