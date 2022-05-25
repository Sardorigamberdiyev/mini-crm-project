function getDate(item) {
  const date = new Date(item);
  const year = date.getFullYear();
  const month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const data = `${day}.${month}.${year}`;
  return data;
}

export default getDate;
