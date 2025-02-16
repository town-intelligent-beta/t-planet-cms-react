import { plan_info } from './plan.js';
import { sdgsAutoGen } from './api/llm.js';
import { getWeightMeta } from './api/weight.js';

export async function set_page_info_cms_sdgs_setting(uuid) {
  if (WEIGHT[1] == 1)
    $('#five').css('display', 'block');
  if (WEIGHT[2] == 1)
    $('#community').css('display', 'block');

  if (uuid != null) {
    var obj_project = plan_info(uuid);
    var list_sdgs = [];

    try {
      list_sdgs = obj_project.weight.split(",");
    } catch (e) {
      // 如果無法解析，設置默認值
      list_sdgs = Array(27).fill('0');
    }

    const all_zeros = list_sdgs.every(value => value === '0');
    const loadingContainer = document.getElementById("loading-container");

    if (all_zeros) {
      // Show loading animation
      loadingContainer.style.display = "flex";

      try {
        const result = await sdgsAutoGen(uuid); // 等待 sdgsAutoGen 完成

        let obj_sdgs = {};
        try {
          obj_sdgs = JSON.parse(result.content);
        } catch (error) {
          console.error('Error parsing AI generated SDGs content:', error);
        }

        if (obj_sdgs && obj_sdgs.project_sdgs && Array.isArray(obj_sdgs.project_sdgs) && obj_sdgs.project_sdgs.length > 0) {
          const project_sdgs = obj_sdgs.project_sdgs[0]; // 獲取第一個對象

          if (project_sdgs && typeof project_sdgs === 'object') {
            // Set local storage
            try {
              localStorage.setItem('ai_sdgs', JSON.stringify(project_sdgs));
            } catch (error) {
              console.error('Error setting AI generated SDGs to local storage:', error);
            }

            // 更新 list_sdgs
            for (const key in project_sdgs) {
              if (project_sdgs.hasOwnProperty(key)) {
                const index = parseInt(key) - 1; // key 是從 1 開始的，所以需要減 1
                list_sdgs[index] = '1';
              }
            }
          } else {
            console.error('Invalid project_sdgs object:', project_sdgs);
          }
        } else {
          console.error('Invalid project_sdgs structure:', obj_sdgs);
        }

      } catch (error) {
        console.error('Error fetching AI generated SDGs:', error);
      } finally {
        loadingContainer.style.display = "none";
      }
    } else {
      loadingContainer.style.display = "none";
    }

    // Render weight cards
    const renderWeights = async () => {
      const container = document.getElementById('weight_items');
      let idCounter = 1;

      for (const weight of WEIGHTS) {
        try {
          const data = await getWeightMeta(weight);

          const outerDiv = document.createElement('div');
          outerDiv.className = 'form-row mt-3 sds-font border-light-gray p-3';

          data.content.categories.forEach(category => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group col-12 col-sm-6 col-md-4';

            const formCheck = document.createElement('div');
            formCheck.className = 'form-check d-flex align-items-center';

            const input = document.createElement('input');
            input.className = 'form-check-input checkbox-1x';
            input.type = 'checkbox';
            input.id = `sdg_${idCounter}`;

            const label = document.createElement('label');
            label.className = 'form-check-label pl-3';
            label.htmlFor = `sdg_${idCounter}`;
            label.textContent = `${category.title}`;

            formCheck.appendChild(input);
            formCheck.appendChild(label);

            formGroup.appendChild(formCheck);
            outerDiv.appendChild(formGroup);

            idCounter++;
          });

          container.appendChild(outerDiv);
        } catch (error) {
          console.error("Error generating weight DOMs:", error);
        }
      }
    };

    await renderWeights();

    // 更新 SDGs 列表
    for (var index = 0; index < list_sdgs.length; index++) {
      if (parseInt(list_sdgs[index]) != 0) {
        document.getElementById("sdg_" + (index+1).toString()).checked = true;
      }
    }
  }
}