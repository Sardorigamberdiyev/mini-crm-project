import { Converter } from "easy-currencies";

const usbTosum = async (price, type) => {
  const converter = new Converter();
  let value;
  if (type === "UZS") {
    value = await converter.convert(price, "USD", "UZS");
  } else if (type === "USD") {
    value = await converter.convert(price, "UZS", "USD");
  } else {
    value = "Not";
  }
  return value;
};

export default usbTosum;
