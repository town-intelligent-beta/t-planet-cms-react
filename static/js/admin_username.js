export function set_page_info_admin_username() {
  var username = getLocalStorage("username");
  var email = getLocalStorage("email");
  var group = getLocalStorage("group");
  $("#groupDisplay").text(group);
  $("#account_name").val(username);
  $("#account_email").val(email);
  if (group == 204) {
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
