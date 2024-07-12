export const formatCurrency = (number, digits = 0) => {
  const formatted =  new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: digits,
  }).format(number);

  return formatted.replaceAll("$", "");
};
