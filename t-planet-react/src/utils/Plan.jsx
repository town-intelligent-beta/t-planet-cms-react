import { formatDate } from "./Transform";

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
  } else if (page === "cms_impact") {
    formData.append("weight_description", projectData.weightComment);
  } else if (page === "cms_contact_person") {
    formData.append("hoster", projectData.hoster);
    formData.append("org", projectData.org);
    formData.append("hoster_email", projectData.email);
    formData.append("tel", projectData.tel);
    formData.append(
      "list_location",
      JSON.stringify(
        Object.values(projectData.locations).map((location) =>
          location ? 1 : 0
        )
      )
    );
  }

  return formData;
}
