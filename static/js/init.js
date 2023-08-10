import { set_page_info } from './set_page_info.js'

function add_navbar() {
  $('#navbar').html(str_navbar)

  // Set navbar
  var path = window.location.pathname;
  var page = path.split("/").pop().split(".html")[0]
  var selector = "#" + page;
  $(selector).addClass('active');
}

function add_footer() {
  // str_footer
  $('#footer').html(str_footer)
}

function logout() {
  // Modify account
  var dataJSON = {};
  dataJSON.token = getLocalStorage("jwt");
  $.ajax({
    url: HOST_URL_TPLANET_DAEMON + "/accounts/verify_jwt",
    type: "POST",
    async: false,
    crossDomain: true,
    data:  dataJSON,
    success: function(returnData) {
       const obj = JSON.parse(returnData);
       // Clear local storage
       localStorage.clear();

       window.location.replace("/index.html");
    },
    error: function(xhr, ajaxOptions, thrownError){
      console.log(thrownError);
    }
  });
}

function set_navbar_animation() {
  $('.navbar').hover(function() {
    $('.navbar').removeClass('blur');
  });

  var lastScrollTop = 0;
  $(window).scroll(function(){
    var scrollTop = $(this).scrollTop();
    // scroll down
    if (scrollTop > lastScrollTop){
      $('.navbar').addClass('blur');
      lastScrollTop = scrollTop;
      return;
    }

    // scroll up
    $('.navbar').removeClass('blur');
    lastScrollTop = scrollTop;
  });
}

function navbar(group) {
  add_navbar()
  set_navbar_animation()

  // home logo href
  if (group == "200" || group == "201" ) {
      document.getElementById("index_logo").href =
      "/backend/admin_agent_dashboard.html";

    try {
      var obj_account_status = document.getElementById("account_status");
      for (const child of obj_account_status.children) {
        child.style.display = "none";
      }

      var obj_a = document.createElement("a");
      obj_a.className = "nav-link fw-bold";
      obj_a.href="javascript:void(0)"
      obj_a.onclick= function(e){
        logout()
      }


      var obj_img = document.createElement("img");
      obj_img.className = "align-text-top";
      obj_img.src="/static/imgs/logout.svg";
      obj_img.style="height:25px";
      obj_a.innerText = "登出";

      obj_a.append(obj_img);

      obj_account_status.append(obj_a);
    } catch(e) { console.log(e) }
  }
}

// set page info
set_page_info();

// Get group
var group = getLocalStorage("group");

// navbar
navbar(group);

// footer
add_footer();
