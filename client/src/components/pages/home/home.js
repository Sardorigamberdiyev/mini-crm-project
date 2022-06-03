import React, { useState } from "react";
import Select from "react-select";
import { useMask } from "react-mask-field";
import { FiChevronRight } from "react-icons/fi";
import Transportation from "./Transportation";
import "./home.css";

const Home = props => {
  const {
    firm,
    date,
    wagons,
    territoryTransportation,
    generalRate,
    additionalFee,
    pricePerTon,
    senderStation,
    arrivalStation,
    sender,
    recipient,
    carriageCount,
    capacity,
    sum,
    usb,
    options,
    defaultCustomerId,
    defaultCarriageId,
    states,
    onInputMoney,
    onSelectChange,
    handleState,
    onInputChange,
    onSubmit,
    cargoType,
  } = props;
  const refDate = useMask({ mask: "__/__/____", replacement: { _: /\d/ } });
  const [farmBol, setFarm] = useState(true);

  const changeFarm = () => {
    if (farmBol) {
      handleState("firm", "firm-1");
    } else {
      handleState("firm", "firm-2");
    }
    setFarm(!farmBol);
  };

  const handleCargoType = () => {
    if (cargoType !== "спс") {
      handleState("cargoType", "спс");
    } else {
      handleState("cargoType", "мпс");
    }
  };

  return (
    <div className="home">
      <div className="form-container">
        <form onSubmit={onSubmit}>
          <div className="form-header">
            <h1>{firm}</h1>
            <button type="button" onClick={changeFarm}>
              <FiChevronRight />
            </button>
          </div>
          <div className="form-main">
            <div className="form-group">
              <label>Дата выдачи</label>
              <input
                onChange={onInputChange}
                type="text"
                name="date"
                required="requied"
                value={date}
                ref={refDate}
              />
            </div>
            <div className="form-group">
              <label>Станция отправления</label>
              <input
                type="text"
                required
                value={senderStation}
                name="senderStation"
                onChange={onInputChange}
              />
            </div>
            <div className="form-group">
              <label>Станция прибытия</label>
              <input
                type="text"
                required
                value={arrivalStation}
                name="arrivalStation"
                onChange={onInputChange}
              />
            </div>
            <div className="form-group">
              <label>Плательщик</label>
              <Select
                name="customerId"
                required
                value={defaultCustomerId}
                onChange={onSelectChange}
                className="select"
                options={options}
              />
            </div>
            <div className="form-group">
              <label>Отправитель</label>
              <input
                type="text"
                required
                value={sender}
                name="sender"
                onChange={onInputChange}
              />
            </div>
            <div className="form-group">
              <label>Получатель</label>
              <input
                type="text"
                value={recipient}
                required
                name="recipient"
                onChange={onInputChange}
              />
            </div>
            <div className="form-group">
              <label>Тип груза</label>
              <div className="type">
                <div
                  className={`type-left ${cargoType !== "спс" ? "active" : ""}`}
                  onClick={handleCargoType}
                >
                  мпс
                </div>
                <div
                  className={`type-right ${
                    cargoType !== "спс" ? "" : "active"
                  }`}
                  onClick={handleCargoType}
                >
                  спс
                </div>
                <Select
                  name="carriageId"
                  required
                  value={defaultCarriageId}
                  className="select"
                  onChange={onSelectChange}
                  options={wagons}
                />
              </div>
            </div>
            <div className="form-group pallitra">
              <div>
                <label>Количество вагонов</label>
                <input
                  type="number"
                  name="carriageCount"
                  required
                  value={carriageCount}
                  onChange={onInputChange}
                />
              </div>
              <div>
                <label>Обём</label>
                <input
                  type="number"
                  name="capacity"
                  value={capacity}
                  onChange={onInputChange}
                />
              </div>
            </div>
          </div>
          <div className="form-calculator">
            <div className="calculator">
              {states.map(item => (
                <Transportation
                  key={item._id}
                  items={item}
                  totalCost={generalRate}
                  handleState={handleState}
                  territories={territoryTransportation}
                />
              ))}
            </div>
            <div className="main">
              <p>Общий стоимость</p>
              <h1>{generalRate} USD</h1>
            </div>
          </div>
          <div className="form-add">
            <div className="form-group">
              <label>Дополнительный. сбор</label>
              <input
                type="number"
                required
                name="additionalFee"
                value={additionalFee}
                onChange={onInputChange}
              />
            </div>
            <div className="form-group">
              <label>Цена за тонну</label>
              <div className="pricePerTon">{pricePerTon}</div>
            </div>
            <div className="form-group">
              <label>ТЛГ сумма</label>
              <input
                type="number"
                className="sum"
                name="sum"
                required
                value={sum}
                onChange={onInputMoney}
                placeholder="SUM"
              />
              <input
                type="number"
                placeholder="USB"
                name="usb"
                required
                value={usb}
                onChange={onInputMoney}
                className="usb"
              />
            </div>
          </div>
          <div className="form-button">
            <button type="submit">Получит заявку</button>
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
      <div className="bg-dark" />
    </div>
  );
};

export default Home;
