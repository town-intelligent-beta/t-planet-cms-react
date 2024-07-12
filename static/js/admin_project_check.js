import {
  get_task_comment,
  get_task_info,
  verify_task_on_tplanet,
} from "./tasks.js";
import { renderHandlebarsAppendTo } from "./utils/handlebars.js";
import { wrapImagesWithLightbox } from "./utils/lightbox.js";

const parse_task_weights = (obj_task_info) => {
  let result = [];
  try {
    const content = JSON.parse(obj_task_info.content);
    for (var index_sdg = 1; index_sdg < 18; index_sdg++) {
      if (content["sdgs-" + index_sdg.toString()] == "1") {
        result.push("SDGs-" + index_sdg.toString());
      }
    }

    for (var index_sdg = 18; index_sdg < 28; index_sdg++) {
      if (content["sdgs-" + index_sdg.toString()] == "1") {
        if (index_sdg == 18) {
          result.push("德");
        } else if (index_sdg == 19) {
          result.push("智");
        } else if (index_sdg == 20) {
          result.push("體");
        } else if (index_sdg == 21) {
          result.push("群");
        } else if (index_sdg == 22) {
          result.push("美");
        } else if (index_sdg == 23) {
          result.push("人");
        } else if (index_sdg == 24) {
          result.push("文");
        } else if (index_sdg == 25) {
          result.push("地");
        } else if (index_sdg == 26) {
          result.push("產");
        } else if (index_sdg == 27) {
          result.push("景");
        }
      }
    }
  } catch (e) {}

  return result.join("、");
};

export function set_page_info_admin_project_check(uuid) {
  var obj_resp_task_comment = get_task_comment(uuid);

  if (
    obj_resp_task_comment == false ||
    obj_resp_task_comment.comment.lenght == 0
  )
    return;

  // Get task comment list
  var list_task_comment = obj_resp_task_comment.comment;

  var obj_task_info = get_task_info(uuid);
  const task_weights = parse_task_weights(obj_task_info);

  list_task_comment.map((task_comment, index) => {
    const data = {
      ...task_comment,
      task_weights,
      img: `${HOST_URL_TPLANET_DAEMON}${task_comment.img}`,
      item_index: index + 1,
    };
    renderHandlebarsAppendTo("tbody_task_comment", "tpl-task", data);
  });

  wrapImagesWithLightbox("#tbody_task_comment img");
}

export function selectComment(element) {
  var listCommentVerifiedEmail = [];

  // Loca old value
  try {
    listCommentVerifiedEmail = JSON.parse(
      getLocalStorage("commentVerifiedEmail")
    );
  } catch (e) {}

  // UnClicked - Remove data
  if (element.checked == false) {
    // Unselect select all checkbox
    document.getElementById("checkboxAll").checked = false;

    listCommentVerifiedEmail = listCommentVerifiedEmail.filter(
      (item) => item !== element.getAttribute("id")
    );
  }
  // Clicked - check duplicate data and push
  if (element.checked == true) {
    // Unselect select all checkbox
    document.getElementById("checkboxAll").checked = false;

    listCommentVerifiedEmail = listCommentVerifiedEmail.filter(
      (item) => item !== element.getAttribute("id")
    );
    listCommentVerifiedEmail.push(element.getAttribute("id"));
  }

  setLocalStorage(
    "commentVerifiedEmail",
    JSON.stringify(listCommentVerifiedEmail)
  );
}

export function selectCommentAll() {
  // Get checkbox
  var objCheckboxAll = document.getElementById("checkboxAll");

  // Get UUID
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var uuid = urlParams.get("uuid");

  var obj_resp_task_comment = get_task_comment(uuid);
  if (
    obj_resp_task_comment == false ||
    obj_resp_task_comment.comment.lenght == 0
  )
    return;

  // Get task comment list
  var list_task_comment = obj_resp_task_comment.comment;

  // UnClicked - Clear all getLocalStorage(commentVerifiedEmail) data
  // UnClicked - unclick all checkbox
  if (objCheckboxAll.checked == false) {
    setLocalStorage("commentVerifiedEmail", "");

    for (var index = 0; index < list_task_comment.length; index++) {
      document.getElementById(list_task_comment[index].email).checked = false;
    }
  }

  // Append all comment to getLocalStorage(commentVerifiedEmail)
  // Clicked - click all checkbox
  if (objCheckboxAll.checked == true) {
    var listCommentVerifiedEmail = [];
    for (var index = 0; index < list_task_comment.length; index++) {
      var commentEmail = document.getElementById(
        list_task_comment[index].email
      );
      listCommentVerifiedEmail.push(commentEmail.id);
    }
    setLocalStorage(
      "commentVerifiedEmail",
      JSON.stringify(listCommentVerifiedEmail)
    );

    for (var index = 0; index < list_task_comment.length; index++) {
      document.getElementById(list_task_comment[index].email).checked = true;
    }
  }
}

export function submitVerifiedTaskComment() {
  // Get UUID
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var uuid = urlParams.get("uuid");

  var listCommentVerifiedEmail = [];

  // Get comment verified email
  try {
    listCommentVerifiedEmail = JSON.parse(
      getLocalStorage("commentVerifiedEmail")
    );
  } catch (e) {
    return;
  }

  // Change status on T-planet
  var resultVerifyOnTplanet = verify_task_on_tplanet(
    uuid,
    getLocalStorage("commentVerifiedEmail")
  );
  if (resultVerifyOnTplanet.status == false) {
    console.log("Verify on t-planet failed.");
    return;
  }

  // TODO: Chnage status on eID
  /* for (var index = 0; index < listCommentVerifiedEmail.lenght; index++) {
    var resultVerifyOneID = verify_task_on_eid(uuid, listCommentVerifiedEmail[index]);
    if (resultVerifyOneID.status == false) {
      console.log("Verify on eID failed.")
      return;
    }
  } */

  // Final result
  alert("驗證成功!");
  window.location.replace("/backend/cms_agent.html");
}
