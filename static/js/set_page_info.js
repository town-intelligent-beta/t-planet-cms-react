import { set_page_info_cms_agent } from './cms_agent.js'
import { set_page_info_cms_project_detail } from './cms_project_detail.js'
import { set_page_info_cms_plan_info } from './cms_plan_info.js'
import { set_page_info_cms_sroi } from './cms_sroi.js'
import { set_page_info_cms_sdgs_setting } from './cms_sdgs_setting.js'
import { set_page_info_cms_impact } from './cms_impact.js'
import { set_page_info_cms_missions_display } from './cms_missions_display.js'
import { set_page_info_cms_deep_participation } from './cms_deep_participation.js'
import { set_page_info_cms_contact_person } from './cms_contact_person.js'
import { set_page_info_admin_project_verify } from './admin_project_verify.js'
import { set_page_info_admin_project_check } from './admin_project_check.js'
import { set_page_info_kpi } from './kpi.js'
import { set_page_info_content } from './content.js'
import { set_page_info_news_list, set_page_info_cms_news_list } from './news_list.js'
import { set_page_info_news_content } from './news_content.js'
import { set_page_info_cms_add_news } from './cms_add_news.js'
import { set_page_info_kpi_filter } from './kpi_filter.js'
import { set_page_info_heat_map } from './heat_map.js'
import { set_page_info_cms_contact_us, set_page_info_cms_contact_us_detail } from './cms_contact_us.js'
import { set_page_info_contact_us } from './contact_us_init.js'
import { set_page_info_admin_agent_dashboard } from './admin_agent_dashboard.js'
import { set_page_info_admin_username } from "./admin_username.js";

export function set_page_info() {
  /* Get path and parameters */
  // Path
  var path = window.location.pathname;
  var page = path.split("/").pop();
  var url = new URL(window.location.href);
  // Params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var uuid = urlParams.get("uuid")
  var task = urlParams.get("task")

  // TODO
  if (page == "admin_project_check.html") {
    set_page_info_admin_project_check(uuid)
  }

  if (page == "admin_project_verify.html") {
    set_page_info_admin_project_verify(uuid)
  }

  if (page == "cms_impact.html") {
    set_page_info_cms_impact(uuid);
  }

  if (page == "cms_missions_display.html") {
    set_page_info_cms_missions_display(uuid, task);
  }

  if (page == "cms_deep_participation.html") {
    set_page_info_cms_deep_participation();
  }

  if (page == "cms_project_detail.html") {
    set_page_info_cms_project_detail(uuid);
  }

  if (page == "cms_agent.html") {
    set_page_info_cms_agent(uuid);
  }

  if (page == "cms_plan_info.html") {
    set_page_info_cms_plan_info(uuid);
  }

  if (page == "cms_sroi.html") {
    set_page_info_cms_sroi(uuid);
  }

  if (page == "cms_sdgs_setting.html") {
    set_page_info_cms_sdgs_setting(uuid);
  }

  if (page == "cms_contact_person.html") {
    set_page_info_cms_contact_person(uuid);
  }

  if (page == "project_list.html" || page == "project_list_local.html") {
    set_page_info_project_list();
  }

  if (page == "kpi.html") {
    set_page_info_kpi();
  }

  if (page == "kpi_filter.html") {
    set_page_info_kpi_filter();
  }

  if (page == "content.html") {
    set_page_info_content();
  }

  if (page == "news_list.html") {
    set_page_info_news_list();
  }

  if (page == "news_content.html") {
    set_page_info_news_content();
  }

  if (page == "cms_news_list.html") {
    set_page_info_cms_news_list();
  }

  if (page == "cms_add_news.html") {
    set_page_info_cms_add_news();
  }

  if (page == "heat_map.html") {
    set_page_info_heat_map();
  }

  if (page == "cms_contact_us.html") {
    set_page_info_cms_contact_us();
  }

  if (page == "contact_us.html") {
    set_page_info_contact_us();
  }

  if (page == "cms_contact_us_detail.html") {
    set_page_info_cms_contact_us_detail();
  }

  if (page == "admin_agent_dashboard.html") {
    set_page_info_admin_agent_dashboard();
  }

  if (page == "username.html") {
    set_page_info_admin_username();
  }
}
