import { comment_list, comment_get } from "./comment.js";
import { mockup_get, mockup_upload } from "./mockup.js";

export function uploadCmsContactUsCover() {
  var file = new FileModal("image/*");
  file.onload = function (base64Img) {
    // Preview
    document.getElementById("contact-us-banner-img").style.backgroundImage =
      "url(" + base64Img + ")";
    // Upload
    try {
      var form = new FormData();
      form.append("email", getLocalStorage("email"));
      form.append(
        "contact-us-banner-img",
        DataURIToBlob(base64Img),
        "contact-us-banner-img"
      );

      var result = mockup_upload(form);
    } catch (e) {
      alert(e);
    }
  };
  file.show();
}

export function set_page_info_cms_contact_us_detail() {
  // Params
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var uuid = urlParams.get("uuid");

  // Get comment
  var obj_comment_result = comment_get(uuid);
  if (obj_comment_result.result != true) {
    return;
  }

  // Fill field
  try {
    var obj_comment = obj_comment_result.content;
    document.getElementById("name").value = obj_comment.name;
    document.getElementById("email").value = obj_comment.email;
    document.getElementById("org").value = obj_comment.org;
    document.getElementById("website").value = obj_comment.website;
    document.getElementById("tel").value = obj_comment.tel;
    document.getElementById("comment").value = obj_comment.comment;
  } catch (e) {
    console.log(e);
  }

  // Weight icons
  try {
    for (var index = 0; index < obj_comment.sdgs.length; index++) {
      var obj_a = document.createElement("a");
      var obj_img = document.createElement("img");
      obj_img.className = "mr-3";

      obj_img.src = "/static/imgs/SDGs_" + obj_comment.sdgs[index] + ".jpg";
      obj_img.alt = "";
      obj_img.style = "width:40px";

      obj_a.append(obj_img);
      document.getElementById("weight_container").append(obj_a);
    }
  } catch (e) {
    console.log(e);
  }
}

export function set_page_info_cms_contact_us() {
  var form = new FormData();
  form.append("email", getLocalStorage("email"));
  var obj_mockup = mockup_get(form);

  try {
    if (obj_mockup.description.hasOwnProperty("contact-us-banner-img")) {
      document.getElementById("contact-us-banner-img").style.backgroundImage =
        "url(" +
        HOST_URL_TPLANET_DAEMON +
        obj_mockup.description["contact-us-banner-img"] +
        ")";
    }
  } catch (e) {
    console.log(e);
  }

  var list_comments = [];

  try {
    var result_comments = comment_list();
    list_comments = result_comments.content;
  } catch (e) {
    console.log(e);
  }

  try {
    for (var index = 0; index < list_comments.length; index++) {
      var obj_tr = document.createElement("tr");
      var str_cms_comment_tr_final = str_cms_comment_tr.replaceAll(
        "UUID",
        list_comments[index].uuid
      );
      str_cms_comment_tr_final = str_cms_comment_tr_final.replace(
        "NAME",
        list_comments[index].name
      );
      str_cms_comment_tr_final = str_cms_comment_tr_final.replace(
        "EMAIL",
        list_comments[index].email
      );
      str_cms_comment_tr_final = str_cms_comment_tr_final.replace(
        "ORG",
        list_comments[index].org
      );
      str_cms_comment_tr_final = str_cms_comment_tr_final.replace(
        "WEBSITE",
        list_comments[index].website
      );
      str_cms_comment_tr_final = str_cms_comment_tr_final.replace(
        "TEL",
        list_comments[index].tel
      );
      str_cms_comment_tr_final = str_cms_comment_tr_final.replace(
        "COMMENT",
        list_comments[index].comment.substring(1, 6) + "..."
      );

      // Append
      obj_tr.innerHTML = str_cms_comment_tr_final;
      document.getElementById("comment_list").append(obj_tr);
    }
  } catch (e) {
    console.log(e);
  }
}
