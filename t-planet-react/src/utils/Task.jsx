export async function getTaskWeight(list_task_UUIDs) {
  const formdata = new FormData();
  formdata.append("uuid", list_task_UUIDs[0]);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/task_weight`,
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

export async function getTaskInfo(uuid) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/get/${uuid}`,
      {
        method: "GET",
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

export async function listChildrenTasks(taskUuid) {
  const formdata = new FormData();
  formdata.append("uuid", taskUuid);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/tasks/get_child_tasks`,
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
    return data.task;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
