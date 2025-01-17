function login_required(path) {
  if (path.includes("backend")) {
    checkAuth();
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
}

// Init
page_permission();
