// btn sdg trigger
$(function () {
  $("[id='btn_sdg']").on("click", function (e) {
    e.stopPropagation();
    var obj_name = $(this).attr("name");

    for (var index = 1; index <= 17; index++) {
      var index_sdg = "";
      if (index < 10) {
        index_sdg = ("0" + index).slice(-2);
      } else {
        index_sdg = index;
      }

      document.getElementsByName(
        index_sdg.toString()
      )[0].style.backgroundColor = "";
    }

    // Set task sdgs
    document.getElementsByName(obj_name)[0].style.backgroundColor = "gray";
    setLocalStorage("target_sdgs", obj_name);
  });
});

// btn_add_sdg_into_task
$(function () {
  $("#btn_add_sdg_into_task").on("click", function (e) {
    e.stopPropagation();
    var list_target_sdgs = [];
    if (getLocalStorage("list_target_sdgs") != "") {
      // list_target_sdgs = getLocalStorage("list_target_sdgs").split(",");

      list_target_sdgs = JSON.parse(getLocalStorage("list_target_sdgs"));
    }

    list_target_sdgs.push(getLocalStorage("target_sdgs"));
    setLocalStorage("list_target_sdgs", JSON.stringify(list_target_sdgs));

    // Get path
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Show widget
    var obj_sdgs_container = document.getElementById("sdgs_container");

    if (page == "contact_us.html") {
      // id = icon_container
      var obj_icon_container = document.getElementById("icon_container");

      // <a class="d-block">
      var obj_a = document.createElement("a");
      obj_a.className = "d-block";

      // <img class="mr-3" src="/static/imgs/SDGs_04.jpg" alt="" style="width:60px">
      var obj_img = document.createElement("img");
      obj_img.id = "target_sdgs_" + getLocalStorage("target_sdgs");
      obj_img.className = "mr-3";
      obj_img.src =
        "/static/imgs/SDGs_" + getLocalStorage("target_sdgs") + ".jpg";
      obj_img.alt = "";
      obj_img.style = "width:50px";

      // Append
      obj_a.append(obj_img);
      obj_icon_container.append(obj_a);
    }

    // Finish
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
    },
  });

  return resultJSON;
}

$(function () {
  $("[id='form_contact_us']").on("click", function (e) {
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

    // Submit
    var repos = comment_submit(form);

    if (repos.result == true) alert("您的建議已送出！編號為：" + repos.uuid);
    else alert("您的建議沒有成功送出，請洽系統管理員！");
  });
});
