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
