export function set_page_info_admin_username() {
  var username = getLocalStorage("username");
  var email = getLocalStorage("email");
  var group = getLocalStorage("group");
  $("#groupDisplay").text(group);
  $("#account_name").val(username);
  $("#account_email").val(email);
  if(SITE_HOSTERS.includes(email) && email != SITE_HOSTERS[0]){
    try {
      $("#user_system").css("display", "none");
    } catch (e) {
      console.log(e);
    }
  }
}
