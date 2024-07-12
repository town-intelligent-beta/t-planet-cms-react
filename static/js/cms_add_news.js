import { news_add } from './news.js'
import { mockup_upload, mockup_get } from './mockup.js'

export function set_page_info_cms_add_news() {
  var form = new FormData();
  form.append("email", getLocalStorage("email"));
  var obj_mockup = mockup_get(form)
  try {
    if (obj_mockup.description.hasOwnProperty("news-banner-img")) {
      document.getElementById("news_banner_image").style.backgroundImage = "url(" + HOST_URL_TPLANET_DAEMON + obj_mockup.description["news-banner-img"] + ")";
    }
  } catch (e) {
    console.log(e);
  }
  // Set date picker
  $("#news_start").datepicker();
  $("#news_end").datepicker();
}

export async function uploadNewsCover() {
  await upload_image_file(450, null,"news_banner", false);
}

export async function add_news_img(no) {
  await upload_image_file(294, 165,"news_img_" + no, false);
}

export async function changeNewsListBanner() {
  var image_src = await upload_image_file(2400, null,"news_banner_image", true);
  var form = new FormData();
  form.append("email", getLocalStorage("email"));
  form.append("news-banner-img", DataURIToBlob(image_src));

  var result_banner_upload = mockup_upload(form);
}

function prepare_news_upload() {
  return new Promise(async (resolve, reject) => {
    await show_loading();
    resolve(true);
  });
}

export async function btn_cms_news_submit() {

  if ("title", document.getElementById("news_title").value == "") {
    alert("請至少填寫新聞標題！");
    return;
  }

  var form = new FormData();
  form.append("email", SITE_HOSTERS[0]);

  try {
    if (DataURIToBlob(document.getElementById("news_banner").src))
      form.append("banner", DataURIToBlob(document.getElementById("news_banner").src));
  } catch (e) {}

  try {
    form.append("title", document.getElementById("news_title").value);
    form.append("description", document.getElementById("news_description").value);
    form.append("news_start", document.getElementById("news_start").value);
    form.append("news_end", document.getElementById("news_end").value);
  } catch (e) {}

  try {
    if (DataURIToBlob(document.getElementById("news_img_0").src))
      form.append("img_0", DataURIToBlob(document.getElementById("news_img_0").src));
  } catch (e) {}

  try {
    if (DataURIToBlob(document.getElementById("news_img_1").src))
      form.append("img_1", DataURIToBlob(document.getElementById("news_img_1").src));
  } catch (e) {}

  try {
    if (DataURIToBlob(document.getElementById("news_img_2").src))
      form.append("img_2", DataURIToBlob(document.getElementById("news_img_2").src));
  } catch (e) {}

  prepare_news_upload().then(async function () {
    var resultJSON =  news_add(form);
    return resultJSON;
  }).then(function (resultJSON) {
    if (resultJSON.result == true) {
      alert("更新成功");
      location.reload();
    } else {
      alert("更新失敗，請洽系統管理員。");
    }
  });
}
