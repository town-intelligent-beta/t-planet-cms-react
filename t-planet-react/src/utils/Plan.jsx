export async function plan_info(uuid) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/projects/info/${uuid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
}

export async function list_plan_tasks(uuid, parent = 0) {
  const formdata = new FormData();
  formdata.append("uuid", uuid);
  formdata.append("parent", parent);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/projects/tasks`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
}

export async function getProjectWeight(list_task_UUIDs) {
  const formdata = new FormData();
  formdata.append("uuid", list_task_UUIDs[0]);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/projects/weight`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
}

export async function list_plans(email) {
  const formdata = new FormData();
  formdata.append("email", email);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/projects/projects`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
}

export async function plan_submit(formdata, uuid = null) {
  const url = window.location.pathname;
  const segments = url.split("/");
  const page = segments[2];

  if (page !== "cms_agent" && uuid == null) {
    try {
      const nameValue = formdata.get("name");
      if (
        nameValue === "" ||
        nameValue === null ||
        typeof nameValue === "undefined"
      ) {
        return {};
      }
    } catch (e) {
      return { e };
    }
  }

  formdata.append("email", localStorage.getItem("email"));
  if (uuid != null) {
    formdata.append("uuid", uuid);
  }

  formdata.append("list_project_type", 0);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/projects/upload`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return {};
  }
}
//append_plan_submit_data待新增其他頁面的
export function createFormData(projectData) {
  const url = window.location.pathname;
  const segments = url.split("/");
  const page = segments[2];

  const formData = new FormData();

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  if (page === "cms_plan_info") {
    formData.append("name", projectData.name);
    formData.append("project_a", projectData.projectA);
    formData.append("project_b", projectData.projectB);
    formData.append("project_start_date", formatDate(projectData.startDate));
    formData.append("project_due_date", formatDate(projectData.dueDate));
    formData.append("budget", projectData.budget);
    formData.append("philosophy", projectData.philosophy);
    formData.append("is_budget_revealed", projectData.isBudgetRevealed);
  } else if (page === "cms_sdgs_setting") {
    const list_sdg = projectData.flatMap((weight) =>
      weight.categories.map((category) => (category.isChecked ? 1 : 0))
    );
    formData.append("list_sdg", list_sdg);
  }

  return formData;
}

export function append_plan_submit_data(page, form) {
  if (page === "cms_plan_info") {
    form.append("name", document.getElementById("name").value);
    form.append("project_a", document.getElementById("project_a").value);
    form.append("project_b", document.getElementById("project_b").value);
    form.append(
      "project_start_date",
      document.getElementById("project_start_date").value
    );
    form.append(
      "project_due_date",
      document.getElementById("project_due_date").value
    );
    form.append("budget", document.getElementById("budget").value);
    form.append("philosophy", document.getElementById("philosophy").value);
    form.append(
      "is_budget_revealed",
      document.getElementById("displayProjectBudget").checked
    );
  } else if (page === "cms_sdgs_setting") {
    // Get SDGs data
    const list_sdg = new Array(27).fill(0);
    for (let index = 1; index <= 17; index++) {
      if (document.getElementById("sdg_" + index.toString()).checked) {
        list_sdg[index - 1] = 1;
      }
    }

    // Additional SDGs data
    for (let index = 17; index <= 27; index++) {
      if (document.getElementById("sdg_" + index.toString()).checked) {
        list_sdg[index - 1] = 1;
      }
    }

    // Set local storage
    form.append("list_sdg", list_sdg);
  } else if (page === "cms_impact") {
    const textareaIds = [
      ...document.querySelectorAll("textarea[id^='sdg_']"),
      ...document.querySelectorAll("textarea[id^='parent_task_overview_']"),
    ].map((item) => `#${item.id}`);
    register_ckeditor(textareaIds);

    const dataJSON = {};
    for (let index = 0; index < 17; index++) {
      // Append to JSON
      const element = document.getElementById(
        "sdg_" + ("0" + (index + 1)).slice(-2) + "_des"
      );
      if (element) {
        dataJSON[index] = element.innerText;
      }
    }

    // Additional SDGs data
    for (let index = 17; index <= 27; index++) {
      // Append to JSON
      const element = document.getElementById(
        "sdg_" + ("0" + (index + 1)).slice(-2) + "_des"
      );
      if (element) {
        dataJSON[index] = element.innerText;
      }
    }

    // {"0":"透過深度參與豐富指標","11":"定期聚板相關市集","14":"社區友善農業的產銷創生解方"}
    form.append("weight_description", JSON.stringify(dataJSON));
  } else if (page === "cms_contact_person.html") {
    form.append("hoster", document.getElementById("hoster").value);
    form.append("hoster_email", document.getElementById("email").value);
    form.append("org", document.getElementById("org").value);
    form.append("tel", document.getElementById("tel").value);
    const list_location = [0, 0, 0, 0, 0];
    for (let index = 1; index <= 5; index++) {
      if (document.getElementById("location_" + index.toString()).checked) {
        list_location[index - 1] = 1;
      }
    }
    form.append("list_location", list_location);
  }

  return form;
}
