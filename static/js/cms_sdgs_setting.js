import { plan_info } from './plan.js'

export function set_page_info_cms_sdgs_setting(uuid){
  if(WEIGHT[1] == 1)
    $('#five').css('display', 'block');
  if(WEIGHT[2] == 1)
    $('#community').css('display', 'block');

  if (uuid != null) {
    var obj_project = plan_info(uuid);
    var list_sdgs = [];

    try {
      list_sdgs = obj_project.weight.split(",");
    } catch (e) {}


    if (list_sdgs.length === 0) {
      // 呼叫 AI 自動生成 SDGs 的 API
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "multipart/form-data; boundary=<calculated when request is sent>");

      const formdata = new FormData();
      formdata.append("uuid", uuid);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow"
      };

      try {
        const response = fetch("https://beta-tplanet-backend.townway.com.tw/llm/auto_gen_sdgs", requestOptions);
        const result = response.json();
        const project_sdgs = JSON.parse(result.content).project_sdgs[0];
        
        list_sdgs = Object.keys(project_sdgs).map(key => parseInt(key));
      } catch (error) {
        console.error('Error fetching AI generated SDGs:', error);
      }
    }

    for (var index = 0; index < list_sdgs.length; index++) {
      if (parseInt(list_sdgs[index]) != 0) {
        document.getElementById("sdg_" + (index+1).toString()).checked = true;
      }
    }
  }
}
