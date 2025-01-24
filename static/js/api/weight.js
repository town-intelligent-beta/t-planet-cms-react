export const getWeightMeta = async (name) => {
    const response = await fetch(`${HOST_URL_TPLANET_DAEMON}/weight/get/${name}`);
    return await response.json();
}