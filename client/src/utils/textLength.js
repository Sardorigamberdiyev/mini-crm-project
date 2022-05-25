export default (text, n) => {
  let needText = "";
  let i = 0;
  if (text) {
    if (text.length < n) {
      needText = text;
    } else {
      while (i < n) {
        needText += text[i];
        i++;
      }
      needText += "...";
    }
  }
  return needText;
};
