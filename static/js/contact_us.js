import { getWeightMeta } from './api/weight.js';

$(document).on("click", ".btn_sdg", function (e) {
  e.stopPropagation();
  var obj_name = $(this).attr("name");

  for (var index = 1; index <= 27; index++) {
    var index_sdg = index < 10 ? ("0" + index).slice(-2) : index.toString();
    var elements = document.getElementsByName(index_sdg.toString());
    if (elements.length > 0) {
      elements[0].style.backgroundColor = "";
    }
  }

  var targetElements = document.getElementsByName(obj_name);
  if (targetElements.length > 0) {
    targetElements[0].style.backgroundColor = "gray";
  }
  setLocalStorage("target_sdgs", obj_name);
});

$(function () {
  $("#btn_add_sdg_into_task").on("click", async function (e) {
    e.stopPropagation();
    var list_target_sdgs = JSON.parse(getLocalStorage("list_target_sdgs") || "[]");

    list_target_sdgs.push(getLocalStorage("target_sdgs"));
    setLocalStorage("list_target_sdgs", JSON.stringify(list_target_sdgs));

    var path = window.location.pathname;
    var page = path.split("/").pop();

    const allWeights = [];
    for (let i = 0; i < WEIGHTS.length; i++) {
      const weightData = await getWeightMeta(WEIGHTS[i]);
      allWeights.push(...weightData.content.categories);
    }

    if (page === "contact_us.html") {
      var obj_icon_container = document.getElementById("icon_container");

      // <a class="d-block">
      var obj_a = document.createElement("a");
      obj_a.className = "d-block";

      var sdgId = getLocalStorage("target_sdgs");
      
      var category = allWeights.find(category => category.id.toString().padStart(2, '0') === sdgId);
      var iconURL = category ? category.thumbnail : "";

      // <img class="mr-3" src={iconURL} alt="" style="width:60px">
      var obj_img = document.createElement("img");
      obj_img.id = "target_sdgs_" + sdgId;
      obj_img.className = "mr-3";
      obj_img.src = iconURL;
      obj_img.alt = "";
      obj_img.style.width = "50px";

      // Append
      obj_a.append(obj_img);
      obj_icon_container.append(obj_a);
    }

    $("#SDGsModal").modal("hide");
  });
});

function comment_submit(form) {
  var resultJSON = {};
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/portal/comment",
    method: "POST",
    async: false,
    timeout: 0,
    processData: false,
    mimeType: "multipart/form-data",
    contentType: false,
    data: form,
    success: function (returnData) {
      const obj = JSON.parse(returnData);
      resultJSON = obj;
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
    }
  });
  return resultJSON;
}

$(document).ready(function () {
  $("#form_contact_us").on("click", function (e) {
    e.preventDefault();

    var form = new FormData();
    form.append("owner", SITE_HOSTERS[0]);
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("org", document.getElementById("org").value);
    form.append("website", document.getElementById("website").value);
    form.append("tel", document.getElementById("tel").value);
    form.append("comment", document.getElementById("comment").value);
    form.append("list_target_sdgs", getLocalStorage("list_target_sdgs"));

    // 提交
    var repos = comment_submit(form);

    if (repos.result === true) {
      alert("您的建議已送出！編號為：" + repos.uuid);
    } else {
      alert("您的建議沒有成功送出，請洽系統管理員！");
    }
  });
});

function getLocalStorage(key) {
  return localStorage.getItem(key);
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}