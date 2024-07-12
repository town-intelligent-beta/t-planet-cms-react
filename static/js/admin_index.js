import { mockup_upload } from './mockup.js'

function mockup_get() {
    var form = new FormData();
    form.append("email", getLocalStorage("email"));

    var settings = {
      "url": HOST_URL_TPLANET_DAEMON + "/mockup/get",
      "method": "POST",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };

    $.ajax(settings).done(function (response) {
      try {
        const obj = JSON.parse(response);
        if (obj.result != false && $.isEmptyObject(obj.description) === false) {
          const data = obj.description;
          exChange(data);
        }
      } catch(e) {console.log(e);}
    });
  }

function exChange(data) {
  $('#Tbanner_image').css("background-image",`url( ${HOST_URL_TPLANET_DAEMON}${data['banner-image']})`)

  if (`${data['t-planet-img']}`.localeCompare("undefined") === -1) {
    $('#t_planet_img').attr("src",`${HOST_URL_TPLANET_DAEMON}${data['t-planet-img']}`)
  }

  $('#csr_img').css("background-image",`url( ${HOST_URL_TPLANET_DAEMON}${data['csr-img']})`)
  $('#sdg_img').css("background-image",`url( ${HOST_URL_TPLANET_DAEMON}${data['sdg-img']})`)
  $('#twins_img').css("background-image",`url( ${HOST_URL_TPLANET_DAEMON}${data['twins-img']})`)

  if (`${data['t-planet-description']}`.localeCompare("undefined") === -1) {
    $('#textarea1').val(`${data['t-planet-description']}`)
  }

  if (`${data['csr-description']}`.localeCompare("undefined") === -1) {
    $('#textarea2').val(`${data['csr-description']}`)
  }

  if (`${data['sdg-description']}`.localeCompare("undefined") === -1) {
    $('#textarea3').val(`${data['sdg-description']}`)
  }

  if (`${data['twins-description']}`.localeCompare("undefined") === -1) {
    $('#textarea4').val(`${data['twins-description']}`)
  }
  register_ckeditor(['#textarea1', '#textarea2', '#textarea3', '#textarea4']);
}

function prepare_mockup_upload() {
  return new Promise(async (resolve, reject) => {
    await show_loading();
    resolve(true);
  });
}

export async function mockup_new() {
  const t_planet_description = document.querySelector('#textarea1').value;
  const csr_description = document.querySelector('#textarea2').value;
  const sdg_description = document.querySelector('#textarea3').value;
  const twins_description = document.querySelector('#textarea4').value;

  var formData = new FormData();

  if (document.getElementById("Tbanner_image").style.backgroundImage.includes("data:") == true) {
    var Tbanner_image = document.getElementById("Tbanner_image").style.backgroundImage.replace('url("', '');
    Tbanner_image = document.getElementById("Tbanner_image").style.backgroundImage.replace('")', '');
    var obj_tbanner_image = DataURIToBlob(Tbanner_image);
    formData.append("banner-image", obj_tbanner_image, "banner-image.png");
  }

  if (document.getElementById("t_planet_img").src.includes("data:") == true) {
    formData.append("t-planet-img", DataURIToBlob(document.getElementById("t_planet_img").src));
  }

  if (document.getElementById("csr_img").style.backgroundImage.includes("data:") == true) {
    var csr_img = document.getElementById("csr_img").style.backgroundImage.replace('url("', '');
    csr_img = document.getElementById("csr_img").style.backgroundImage.replace('")', '');
    var obj_csr_img = DataURIToBlob(csr_img);

    formData.append("csr-img", obj_csr_img)
  }

  if (document.getElementById("sdg_img").style.backgroundImage.includes("data:") == true) {
    var sdg_img = document.getElementById("sdg_img").style.backgroundImage.replace('url("', '');
    sdg_img = document.getElementById("sdg_img").style.backgroundImage.replace('")', '');
    var obj_sdg_img = DataURIToBlob(sdg_img);

    formData.append("sdg-img", obj_sdg_img)
  }

  if (document.getElementById("twins_img").style.backgroundImage.includes("data:") == true) {
    var twins_img = document.getElementById("twins_img").style.backgroundImage.replace('url("', '');
    twins_img = document.getElementById("twins_img").style.backgroundImage.replace('")', '');
    var obj_twins_img = DataURIToBlob(twins_img);

    formData.append("twins-img", obj_twins_img);
  }

  formData.append("t-planet-description",t_planet_description)
  formData.append("csr-description ",csr_description)
  formData.append("sdg-description",sdg_description)
  formData.append("twins-description",twins_description)
  formData.append("email",  getLocalStorage("email"));

  prepare_mockup_upload().then(async function () {
    var resultJSON =  mockup_upload(formData);
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

export function banner_image_read(){
  upload_image_file(2400, null, "Tbanner_image", true)
}

export function t_planet_img_read() {
  upload_image_file(null, null, "t_planet_img", false)
}

export function csr_img_read() {
  upload_image_file(null, null, "csr_img", true)
}

export function sdg_img_read() {
  upload_image_file(null, null, "sdg_img", true)
}

export function twins_img_read() {
  upload_image_file(null, null, "twins_img", true)
}

// Add_parent_tasks
$(document).ready (function () {
  mockup_get();
  $('#banner-image').on("change",function(e){
    banner_image_read(this)
  })
  $('#t-planet-img').on("change",function(e){
    t_planet_img_read(this)
  })
  $('#csr-img').on("change",function(e){
    csr_img_read(this)
  })
  $('#sdg-img').on("change",function(e){
    sdg_img_read(this)
  })
  $('#twins-img').on("change",function(e){
    twins_img_read(this)
  })

  $("#store").on("click", function(e) {
    e.preventDefault();
    // update the textarea value
    update_ckeditor_data();
    mockup_new();
  })
})
