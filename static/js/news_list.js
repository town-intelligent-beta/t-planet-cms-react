import { news_list, news_get, news_delete } from "./news.js";
import { mockup_get } from "./mockup.js";

export function set_page_info_news_list() {
  var form = new FormData();
  form.append("email", SITE_HOSTERS[0]);
  var obj_mockup = mockup_get(form);

  try {
    if (obj_mockup.description.hasOwnProperty("news-banner-img")) {
      document.getElementById("news_banner_image").style.backgroundImage =
        "url(" +
        HOST_URL_TPLANET_DAEMON +
        obj_mockup.description["news-banner-img"] +
        ")";
    }
  } catch (e) {
    console.log(e);
  }

  let obj_news_list = news_list();
  if (obj_news_list.content.length == 0) return;

  let sorted_news = obj_news_list.content
    .map((uuid) => {
      let obj_news = news_get(uuid);
      if (obj_news.result == false) {
        return null;
      }
      if (obj_news.content.period == null) {
        return { uuid, start_date: null };
      }
      const start_date = obj_news.content.period;
      const regex = /\d{2}\/\d{2}\/\d{4}/g;
      const startDateMatches = start_date.match(regex);
      const startDate =
        startDateMatches && startDateMatches.length > 0
          ? new Date(startDateMatches[0])
          : null;
      return { uuid, start_date: startDate };
    })
    .filter((news) => news !== null)
    .sort((a, b) => {
      if (a.start_date == null) {
        return 1;
      }
      if (b.start_date == null) {
        return -1;
      }
      return b.start_date - a.start_date;
    });

  // Revise style
  var index_news = 0;
  sorted_news.forEach((news, index_news) => {
    const uuid = news.uuid;
    const obj_news = news_get(uuid);

    if (obj_news.result == false) {
      return;
    }

    if (index_news == 0) {
      var str_main_news_ffinal = str_main_news.replace(
        "NEWS_TITLE",
        obj_news.content.title
      );
      str_main_news_ffinal = str_main_news_ffinal.replace("NEWS_UUID", uuid);

      if (obj_news.content.period != null) {
        str_main_news_ffinal = str_main_news_ffinal.replace(
          "PERIOD",
          obj_news.content.period
        );
      } else {
        str_main_news_ffinal = str_main_news_ffinal.replace("PERIOD", "");
      }
      str_main_news_ffinal = str_main_news_ffinal.replace(
        "NEWS_COVER",
        HOST_URL_TPLANET_DAEMON + obj_news.content.static.banner
      );

      var obj_main_news = document.createElement("div");
      obj_main_news.className = "col-md-12 d-none d-md-block";
      obj_main_news.innerHTML = str_main_news_ffinal;

      document.getElementById("main_news").append(obj_main_news);
    } else {
      // Create DOMs
      var col_md_4 = document.createElement("div");
      col_md_4.className = "col-md-4";

      var mb_4_rounded_0 = document.createElement("div");
      mb_4_rounded_0.className = "mb-4 rounded-0";

      var img_fluid_bg_cover = document.createElement("div");
      img_fluid_bg_cover.className = "img-fluid bg-cover";
      img_fluid_bg_cover.style =
        "background-image:url(" +
        HOST_URL_TPLANET_DAEMON +
        obj_news.content.static.banner +
        "); width:100% ;height:288px; background-repeat: no-repeat";

      var d_flex_flex_column = document.createElement("div");
      d_flex_flex_column.className =
        "d-flex flex-column h-100 justify-content-end text-white";

      var bg_dark_bg_opacity = document.createElement("div");
      bg_dark_bg_opacity.className = "bg-dark pt-2 pl-3 bg-opacity";

      var stretched_link = document.createElement("a");
      stretched_link.href = "/news_content.html?uuid=" + obj_news.content.uuid;
      stretched_link.className = "stretched-link";

      var mb_0 = document.createElement("p");
      mb_0.className = "mb-0 text-shadow";

      if (obj_news.content.period != null) {
        mb_0.innerHTML = obj_news.content.period;
      } else {
        mb_0.innerHTML = "";
      }

      var text = document.createElement("p");
      text.className = "text-shadow";
      text.innerHTML = obj_news.content.title;

      // Append to DOM
      bg_dark_bg_opacity.append(mb_0);
      bg_dark_bg_opacity.append(text);
      d_flex_flex_column.append(bg_dark_bg_opacity);
      img_fluid_bg_cover.append(d_flex_flex_column);
      img_fluid_bg_cover.append(stretched_link);
      mb_4_rounded_0.append(img_fluid_bg_cover);
      col_md_4.append(mb_4_rounded_0);

      var obj_news_container = document.getElementById("news_container");
      obj_news_container.append(col_md_4);
    }
    index_news++;
  });
}
export function set_page_info_cms_news_list() {
  var form = new FormData();
  form.append("email", getLocalStorage("email"));

  var obj_mockup = mockup_get(form);
  try {
    if (obj_mockup.description.hasOwnProperty("news-banner-img")) {
      document.getElementById("news_banner_image").style.backgroundImage =
        "url(" +
        HOST_URL_TPLANET_DAEMON +
        obj_mockup.description["news-banner-img"] +
        ")";
    }
  } catch (e) {
    console.log(e);
  }

  var obj_news_list = news_list();
  if (obj_news_list.content.length == 0) return;

  let sorted_news = obj_news_list.content
    .map((uuid) => {
      let obj_news = news_get(uuid);
      if (obj_news.result == false || obj_news.content.period == null) {
        return null;
      }
      const start_date = obj_news.content.period;
      const regex = /\b\d{2}\/\d{2}\/\d{4}\b/g;
      const startDateMatches = start_date.match(regex);
      const startDate =
        startDateMatches && startDateMatches.length > 0
          ? new Date(startDateMatches[0])
          : null;
      return { uuid, start_date: startDate };
    })
    .filter((news) => news !== null)
    .sort((a, b) => {
      if (a.start_date == null) {
        return 1;
      }
      if (b.start_date == null) {
        return -1;
      }
      return b.start_date - a.start_date;
    });

  // Revise style
  var index_news = 0;

  sorted_news.forEach(function (sortedNewsItem) {
    var obj_news = news_get(sortedNewsItem.uuid);

    if (obj_news.result == false) {
      return;
    }

    if (index_news == 0) {
      var str_main_news_final = str_cms_main_news.replace(
        "NEWS_TITLE",
        obj_news.content.title
      );
      str_main_news_final = str_main_news_final.replace(
        "NEWS_UUID",
        sortedNewsItem.uuid
      );
      str_main_news_final = str_main_news_final.replace(
        "NEWS_COVER",
        HOST_URL_TPLANET_DAEMON + obj_news.content.static.banner
      );

      if (obj_news.content.period != null) {
        str_main_news_final = str_main_news_final.replace(
          "PERIOD",
          obj_news.content.period
        );
      } else {
        str_main_news_final = str_main_news_final.replace("PERIOD", "");
      }

      var obj_main_news = document.createElement("div");
      obj_main_news.className = "col-md-12 d-none d-md-block";
      obj_main_news.innerHTML = str_main_news_final;

      var obj_del = document.createElement("div");
      obj_del.className = "text-center mb-4";
      var obj_del_a_href = document.createElement("a");
      obj_del_a_href.className = "btn btn-danger rounded-pill text-white";
      obj_del_a_href.style = "width: 100px";
      obj_del_a_href.onclick = function () {
        if (confirm("即將刪除 : " + obj_news.content.title) == true) {
          var obj_delete_result = news_delete(obj_news.content.uuid);

          if (obj_delete_result.result == true) {
            location.reload();
          }
        }
      };
      obj_del_a_href.innerHTML = "刪除";

      obj_del.append(obj_del_a_href);
      obj_main_news.append(obj_del);
      document.getElementById("main_news").append(obj_main_news);
    } else {
      // Create DOMs
      var col_md_4 = document.createElement("div");
      col_md_4.id = "id_" + obj_news.content.uuid;
      col_md_4.className = "col-md-4";

      var mb_4_rounded_0 = document.createElement("div");
      mb_4_rounded_0.className = "mb-4 rounded-0";

      var img_fluid_bg_cover_a = document.createElement("a");
      img_fluid_bg_cover_a.href =
        "/news_content.html?uuid=" + obj_news.content.uuid;

      var img_fluid_bg_cover = document.createElement("div");
      img_fluid_bg_cover.className = "img-fluid bg-cover";

      img_fluid_bg_cover.style =
        "background-image:url(" +
        HOST_URL_TPLANET_DAEMON +
        obj_news.content.static.banner +
        "); width:100% ;height:288px; background-repeat: no-repeat";

      var d_flex_flex_column = document.createElement("div");
      d_flex_flex_column.className =
        "d-flex flex-column h-100 justify-content-end pl-0 text-white";

      var bg_dark_bg_opacity = document.createElement("div");
      bg_dark_bg_opacity.className = "bg-dark pt-2 pl-3 bg-opacity";

      var mb_0 = document.createElement("p");
      mb_0.className = "mb-0 text-shadow";

      if (obj_news.content.period != null) {
        mb_0.innerHTML = obj_news.content.period;
      } else {
        mb_0.innerHTML = "";
      }

      var text = document.createElement("p");
      text.className = "text-shadow";
      text.innerHTML = obj_news.content.title;

      var obj_del = document.createElement("div");
      obj_del.className = "text-center mb-4";

      var obj_del_a_href = document.createElement("a");
      obj_del_a_href.className = "btn btn-danger rounded-pill text-white";
      obj_del_a_href.style = "width: 100px";
      obj_del_a_href.onclick = function () {
        if (confirm("即將刪除 : " + obj_news.content.title) == true) {
          var obj_delete_result = news_delete(obj_news.content.uuid);

          if (obj_delete_result.result == true) {
            location.reload();
          }
        }
      };
      obj_del_a_href.innerHTML = "刪除";

      // Append to DOM
      obj_del.append(obj_del_a_href);
      bg_dark_bg_opacity.append(mb_0);
      bg_dark_bg_opacity.append(text);
      d_flex_flex_column.append(bg_dark_bg_opacity);

      img_fluid_bg_cover_a.append(img_fluid_bg_cover);
      img_fluid_bg_cover.append(d_flex_flex_column);
      mb_4_rounded_0.append(img_fluid_bg_cover_a);
      col_md_4.append(mb_4_rounded_0);
      col_md_4.append(obj_del);

      var obj_news_container = document.getElementById("news_container");
      obj_news_container.append(col_md_4);
    }
    index_news++;
  });
}
