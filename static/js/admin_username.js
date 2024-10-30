export function set_page_info_admin_username() {

  console.log("set_page_info_admin_username");

  var username = getLocalStorage("username");
  var email = getLocalStorage("email");
  var group = getLocalStorage("group");

  if(group === "") {
    var form = new FormData();
    form.append("email", email);  // 使用從 localStorage 獲取的 email
    
    var settings = {
      "url": HOST_URL_TPLANET_DAEMON + "/accounts/get_group",
      "method": "POST",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };
  
    $.ajax(settings)
      .done(function (response) {
        console.log(response);
        const responseData = JSON.parse(response);
        const groupValue = responseData.group;
        setLocalStorage("group", groupValue);
        $("#groupDisplay").text(groupValue);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Get group failed:", textStatus, errorThrown);
      });
  } else {
    $("#groupDisplay").text(group);
  }

  $("#account_name").val(username);
  $("#account_email").val(email);
  if(SITE_HOSTERS.includes(email) && email != SITE_HOSTERS[0]){
    try {
      $("#user_system").css("display", "none");
    } catch (e) {
      console.log(e);
    }
  }
  //   if (email == SITE_HOSTERS[0]) {
  //     try {
  //       $("#admin_index").css("display", "block");
  //       $("#cms_news_list").css("display", "block");

  //       if (SITE_TYPE != 1) $("#cms_contact_us").css("display", "block");
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
}
