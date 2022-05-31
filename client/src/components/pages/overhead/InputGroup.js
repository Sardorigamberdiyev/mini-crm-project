import React from "react";

export default function InputGroup() {
  return (
    <div className="form-group">
      <div className="item-number">1</div>
      <div className="input-content">
        <label>Отправка</label>
        <input name="numberOne" className="input-one" placeholder="29" />
        <input name="numberTwo" className="input-two" />
      </div>
      <div className="input-content">
        <label>Вагон</label>
        <input name="carriage" />
      </div>
      <div className="input-content input-two">
        <label>Масса</label>
        <input name="value" className="input-one" />
        <input name="units" className="input-two" />
      </div>
      <div className="input-content">
        <label>Оплата</label>
        <input name="payment" />
      </div>
    </div>
  );
}
