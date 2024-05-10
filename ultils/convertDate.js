function convertDateFormat(inputDate) {
  const dateParts = inputDate.split(/[\/\s:]/);

  let year,
    month,
    day,
    hour = 0,
    minute = 0;

  if (dateParts.length >= 3) {
    year = parseInt(dateParts[2]);
    month = parseInt(dateParts[1]) - 1; 
    day = parseInt(dateParts[0]);
    if (dateParts.length >= 5) {
      hour = parseInt(dateParts[3]);
      minute = parseInt(dateParts[4]);
    }
  } else if (dateParts.length === 2) {
    year = parseInt(dateParts[1]);
    month = parseInt(dateParts[0]) - 1; 
    day = 1; 
  }

  const parsedDate = new Date(year, month, day, hour, minute);

  const formattedDate = `${parsedDate.getFullYear()}-${(
    "0" +
    (parsedDate.getMonth() + 1)
  ).slice(-2)}-${("0" + parsedDate.getDate()).slice(-2)} ${(
    "0" + parsedDate.getHours()
  ).slice(-2)}:${("0" + parsedDate.getMinutes()).slice(-2)}:${(
    "0" + parsedDate.getSeconds()
  ).slice(-2)}`;

  return formattedDate;
}

module.exports = convertDateFormat;
