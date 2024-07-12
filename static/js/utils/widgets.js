export const isOverflow = (element) => {
  if (element.scrollHeight > element.offsetHeight) {
    return true;
  }
  if (element.scrollWidth > element.offsetWidth) {
    return true;
  }

  return false;
};
