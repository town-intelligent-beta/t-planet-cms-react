function login_required(path) {
  if (path.includes("backend")) {
    checkAuth();
  }
}

function permission_check(page, group) {
  // Agent
  /* if (group == "200") {
    if (page.includes("admin")) {
      window.location.replace("/index.html");
    }
  } */

  // Normal user
  if (group == "300") {
    if (page.includes("admin") || page.includes("agent")) {
      window.location.replace("/index.html");
    }
  }
}

function page_permission() {
  // Get path
  var path = window.location.pathname;
  var page = path.split("/").pop();

  // Get group
  var group = getLocalStorage("group");

  // Login required
  login_required(path);

  // Permission check
  permission_check(page, group);
}

// Init
page_permission();
