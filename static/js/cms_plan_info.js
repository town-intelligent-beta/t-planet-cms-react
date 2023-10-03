import { plan_info } from "./plan.js";
import { get_cropped_image, update_background_image } from "./utils/croppie.js";

export function set_page_info_cms_plan_info(uuid) {
  if (uuid != null) {
    var obj_project = plan_info(uuid);

    // Cover
    if (obj_project.img != null) {
      var path_cover =
        HOST_URL_TPLANET_DAEMON +
        "/static/project/" +
        uuid +
        "/media/cover/cover.png";
      document.getElementById("divUploadImg").style.backgroundImage = "";
      document.getElementById("btnUploadImg").style.display = "none";

      var oDiv = document.getElementById("coverImg");
      oDiv.style.backgroundImage = "url(" + path_cover + ")";
      oDiv.style.backgroundRepeat = "no-repeat";
      // oDiv.style.backgroundSize = "100% 100%";
      oDiv.style.backgroundSize = "cover";
      oDiv.onclick = function () {
        onclickuploadProjectCover();
      };
    }

    /* Set DOM */
    document.getElementById("name").value = obj_project.name;
    document.getElementById("project_a").value = obj_project.project_a;
    document.getElementById("project_b").value = obj_project.project_b;
    var list_period = [];

    try {
      list_period = obj_project.period.split("-");
    } catch (e) {}
    if (list_period.length == 2) {
      document.getElementById("project_start_date").value = list_period[0];
      document.getElementById("project_due_date").value = list_period[1];
    }

    document.getElementById("budget").value = obj_project.budget;
    document.getElementById("philosophy").value = obj_project.philosophy;
  }
}

function submitProjectCover(base64Img, uuid) {
  return new Promise((resolve, reject) => {
    var resultJSON = {};
    var dataJSON = {};
    // dataJSON.email = getLocalStorage("email");
    dataJSON.uuid = uuid;
    dataJSON.img = base64Img;
    $.ajax({
      url: HOST_URL_TPLANET_DAEMON + "/projects/push_project_cover",
      type: "POST",
      async: false,
      crossDomain: true,
      data: dataJSON,
      success: function (returnData) {
        const obj = JSON.parse(returnData);
        resolve(obj);
      },
      error: function (xhr, ajaxOptions, thrownError) {
        reject(thrownError);
      },
    });
  });
}

function onclickuploadProjectCover() {
  uploadProjectCover();
}

function prepare_project_cover_upload() {
  return new Promise(async (resolve, reject) => {
    await show_loading();
    resolve(true);
  });
}

export async function uploadProjectCover() {
  // Params
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var uuid = urlParams.get("uuid");

  // Preview
  const cropped = await get_cropped_image("image/*", {
    width: 700,
    height: 400,
  });
  if (cropped === null) {
    return;
  }

  update_background_image("#coverImg", cropped);

  prepare_project_cover_upload()
    .then(async function () {
      var coverImg = document
        .getElementById("coverImg")
        .style.backgroundImage.replace('url("', "");
      coverImg = coverImg.replace('")', "");

      var resultJSON = submitProjectCover(coverImg, uuid);

      return resultJSON;
    })
    .then(function (resultJSON) {
      if (resultJSON.result == "true") {
        alert("更新成功");

        try {
          document.getElementById("divUploadImg").style.backgroundImage = "";
          document.getElementById("btnUploadImg").style.display = "none";
        } catch (e) {}
      } else {
        alert("更新失敗，請洽系統管理員。");
      }
      stop_loading();
    });
}
