import { mockup_get } from './mockup.js'
import { getWeightMeta } from './api/weight.js';

export async function set_page_info_contact_us () {
  if(WEIGHT[1] == 1)
    $('#five').css('display', 'block');
  if(WEIGHT[2] == 1)
    $('#community').css('display', 'block');

  var form = new FormData();
  form.append("email", SITE_HOSTERS[0]);

  var obj_mockup = mockup_get(form)

  try {
    if (obj_mockup.description.hasOwnProperty("contact-us-banner-img")) {
      document.getElementById("contact_us_banner_1").style.backgroundImage = "url(" + HOST_URL_TPLANET_DAEMON + obj_mockup.description["contact-us-banner-img"] + ")";
      document.getElementById("contact_us_banner_2").style.backgroundImage = "url(" + HOST_URL_TPLANET_DAEMON + obj_mockup.description["contact-us-banner-img"] + ")";
    }
  } catch (e) { console.log(e);}

  // 使用 async/await 保證順序渲染
  const renderWeightCards = async () => {
    const container = document.getElementById('weight_container');

    let globalIndex = 1;
    for (const weight of WEIGHTS) {
      try {
        const data = await getWeightMeta(weight);

        data.content.categories.forEach(category => {
          const card = document.createElement('div');
          card.className = 'card mt-2';

          const cardBody = document.createElement('div');
          cardBody.className = 'card-body p-2';

          const div = document.createElement('div');
          div.className = 'd-flex align-items-center btn_sdg';
          div.id = 'btn_sdg';
          div.setAttribute('name', globalIndex.toString().padStart(2, '0'));

          const img = document.createElement('img');
          img.alt = '';
          img.className = 'mr-2';
          img.src = category.thumbnail;
          img.style.width = '50px';

          const p = document.createElement('p');
          p.className = 'mb-0';
          p.textContent = `${category.title}`;

          div.appendChild(img);
          div.appendChild(p);

          cardBody.appendChild(div);
          card.appendChild(cardBody);

          container.appendChild(card);

          globalIndex++;
        });
      } catch (error) {
        console.error("Error generating weight DOMs:", error);
      }
    }
  };

  await renderWeightCards();
}