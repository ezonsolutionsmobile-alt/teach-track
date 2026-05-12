import moment from "moment-timezone";

/**
 * formatDate
 * @param {string|Date} date - API date
 * @param {string} format - moment format string
 * @param {boolean} isUTC - if true, convert from UTC to local
 * @param {string} type - predefined format type
 */

export const formatDate = (
  date,
  format = null,
  isUTC = true,
  type = "default"
) => {
  if (!date) return "";

  const momentDate = isUTC
    ? moment.utc(date).local()
    : moment(date);

  // 🎯 Predefined formats
  const formats = {
    default: "DD-MM-YYYY",
    short: "DD MMM YYYY",
    monthYear: "MMMM, YYYY",   // 👈 April, 2026
    monthShortYear: "MMM, YYYY", // Apr, 2026
    full: "dddd, DD MMMM YYYY",
  };

  return momentDate.format(format || formats[type] || formats.default);
};