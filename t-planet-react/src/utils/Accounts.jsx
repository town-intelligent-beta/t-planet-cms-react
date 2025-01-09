export async function getGroup(email) {
  const formdata = new FormData();
  formdata.append("email", email);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/accounts/get_group`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const returnData = await response.json();
    localStorage.setItem("group", returnData.group);
    return returnData.group;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
}

export async function logout() {
  const formdata = new FormData();
  formdata.append("token", localStorage.getItem("jwt"));

  try {
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL_TPLANET}/accounts/verify_jwt`,
      {
        method: "POST",
        body: formdata,
        redirect: "follow",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    //const returnData = await response.json();
    localStorage.clear();
    window.location.replace("/");
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}
