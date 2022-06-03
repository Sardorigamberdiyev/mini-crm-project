import React, { useEffect, useState } from "react";

export default function InputGroup(props) {
  const { n, carriage, handleState, items, item } = props;

  const [numberOne, setNumberOne] = useState(item.sending.numberOne);
  const [numberTwo, setNumberTwo] = useState(item.sending.numberTwo);
  const [value, setValue] = useState(item.weight.value);
  const [units, setUnits] = useState(item.weight.units);
  const [payment, setPayment] = useState(item.payment);

  useEffect(() => {
    const data = items.filter(item => item.carriage !== carriage);
    handleState("items", [
      ...data,
      {
        sending: {
          numberOne,
          numberTwo,
        },
        carriage,
        weight: {
          value,
          units,
        },
        payment,
      },
    ]);
  }, [payment, units, value, numberTwo, numberOne]);

  return (
    <div className="form-group">
      <div className="item-number">{n + 1}</div>
      <div className="input-content">
        <label>Отправка</label>
        <input
          placeholder="__"
          type="number"
          name="numberOne"
          className="input-one"
          value={numberOne}
          onChange={e => setNumberOne(e.target.value)}
        />
        <input
          placeholder="__"
          type="number"
          name="numberTwo"
          className="input-two"
          value={numberTwo}
          onChange={e => setNumberTwo(e.target.value)}
        />
      </div>
      <div className="input-content">
        <label>Вагон</label>
        <input disabled name="carriage" value={`${carriage}`} />
      </div>

      <div className="input-content input-two">
        <label>Масса</label>
        <input
          placeholder="__"
          type="text"
          name="units"
          className="input-one"
          value={units}
          onChange={e => setUnits(e.target.value)}
        />
        <input
          placeholder="__"
          type="number"
          name="value"
          className="input-two"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>
      <div className="input-content">
        <label>Оплата</label>
        <input
          placeholder="__"
          type="number"
          name="payment"
          value={payment}
          onChange={e => setPayment(e.target.value)}
        />
      </div>
    </div>
  );
}
