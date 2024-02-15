import { set_page_info } from './set_page_info.js'

function add_navbar() {
  $('#navbar').html(str_navbar)

  // Visible
  if (SITE_TYPE == 0) {
    try {
      $('#solution').css('display', 'block');
      $('#contact_us').css('display', 'block');
    } catch (e) { console.log(e) }
  }

  // Site Name
  try {
    $('#about_nav').text("關於 " + SITE_NAME)
  } catch (e) { console.log(e) }


  // Set navbar
  var path = window.location.pathname;
  var page = path.split("/").pop().split(".html")[0]
  if (page === "")
    page = "index"

  var selector = "#" + page;
  $(selector).addClass('active');
}

function add_footer() {
  // str_footer
  $('#footer').html(str_footer)

  // Site Name
  try {
    $('#about_fot1').html("關於 " + SITE_NAME)
    $('#about_fot2').html("關於 " + SITE_NAME)
    $('#copyright').html("Copyright © 2023 " + COPYRIGHT)

    // Visible
    if (SITE_TYPE == 0) {
      $('#solution_fot1').css('display', 'block');
      $('#solution_fot2').css('display', 'block');
      $('#contact_us_fot1').css('display', 'block');
      $('#contact_us_fot2').css('display', 'block');
    }
  } catch (e) { console.log(e) }
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
    data: dataJSON,
    success: function (returnData) {
      const obj = JSON.parse(returnData);
      // Clear local storage
      localStorage.clear();

      window.location.replace("/index.html");
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
    }
  });
}

function set_navbar_animation() {
  $('.navbar').hover(function () {
    $('.navbar').removeClass('blur');
  });

  var lastScrollTop = 0;
  $(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    // scroll down
    if (scrollTop > lastScrollTop) {
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
  add_footer()
  set_navbar_animation()

  // home logo href
  if (group == "200" || group == "201") {
    document.getElementById("index_logo").href =
      "/backend/admin_agent_dashboard.html";

    try {
      var obj_account_status = document.getElementById("account_status");
      for (const child of obj_account_status.children) {
        child.style.display = "none";
      }

      var obj_div = document.createElement("li");
      obj_div.className = "nav-item dropdown";

      var obj_a = document.createElement("a");
      obj_a.className = "nav-link dropdown-toggle";
      obj_a.href = "#";
      obj_a.setAttribute("role", "button");
      obj_a.setAttribute("data-toggle", "dropdown");
      obj_a.setAttribute("aria-haspopup", "true");
      obj_a.setAttribute("aria-expanded", "false");
      obj_a.innerHTML = "<img src='/static/imgs/user.svg' width='30' height='30' class='d-inline-block align-top' alt=''>";

      var obj_dropdown_menu = document.createElement("div");
      obj_dropdown_menu.className = "dropdown-menu";
      obj_dropdown_menu.style = "left: -100px;";

      var obj_dropdown_item_index = document.createElement("a");
      obj_dropdown_item_index.className = "dropdown-item";
      obj_dropdown_item_index.href = "admin_index.html";
      obj_dropdown_item_index.innerHTML = "<img src='/static/imgs/index.svg' style='width: 25px; height: 25px;'> 首頁管理";

      var obj_dropdown_item_sustainable = document.createElement("a");
      obj_dropdown_item_sustainable.className = "dropdown-item";
      obj_dropdown_item_sustainable.href = "cms_agent.html";
      obj_dropdown_item_sustainable.innerHTML = "<img src='/static/imgs/cooperate.svg' style='width: 25px; height: 25px;'> 永續專區";


      var obj_dropdown_item_AI = document.createElement("a");
      obj_dropdown_item_AI.className = "dropdown-item";
      obj_dropdown_item_AI.href = "cms_ai_gpt.html";
      obj_dropdown_item_AI.innerHTML = "<img src='/static/imgs/ai.svg' style='width: 30px; height: 30px;'> AI Eval";

      var obj_dropdown_item_news = document.createElement("a");
      obj_dropdown_item_news.className = "dropdown-item";
      obj_dropdown_item_news.href = "cms_news_list.html";
      obj_dropdown_item_news.innerHTML = "<img src='/static/imgs/news.svg' style='width: 25px; height: 25px;'> 最新消息";

      var obj_dropdown_item_contact = document.createElement("a");
      obj_dropdown_item_contact.className = "dropdown-item";
      obj_dropdown_item_contact.href = "cms_contact_us.html";
      obj_dropdown_item_contact.innerHTML = "<img src='/static/imgs/contact_us.svg' style='width: 25px; height: 25px;'> 聯繫我們";

      var obj_dropdown_item_logout = document.createElement("a");
      obj_dropdown_item_logout.className = "dropdown-item";
      obj_dropdown_item_logout.href = "javascript:logout();"
      obj_dropdown_item_logout.innerHTML = "<img src='/static/imgs/logout.svg' style='width: 25px; height: 25px;'> 登出";

      var obj_dropdown_item_delete = document.createElement("a");
      obj_dropdown_item_delete.className = "dropdown-item";
      obj_dropdown_item_delete.href = "admin_agent_accountDelete.html";
      obj_dropdown_item_delete.innerHTML = "<img src='/static/imgs/delete.svg' style='width: 25px; height: 25px;'> 刪除帳號";

      obj_dropdown_menu.appendChild(obj_dropdown_item_index);
      obj_dropdown_menu.appendChild(obj_dropdown_item_sustainable);
      obj_dropdown_menu.appendChild(obj_dropdown_item_AI);
      obj_dropdown_menu.appendChild(obj_dropdown_item_news);
      obj_dropdown_menu.appendChild(obj_dropdown_item_contact);
      obj_dropdown_menu.appendChild(obj_dropdown_item_logout);
      obj_dropdown_menu.appendChild(obj_dropdown_item_delete);
      obj_div.appendChild(obj_a);
      obj_div.appendChild(obj_dropdown_menu);
      obj_account_status.appendChild(obj_div);
    } catch (e) { console.log(e) }
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
