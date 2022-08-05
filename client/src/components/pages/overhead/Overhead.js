import React from "react";
import { Tabs } from "antd";
import FormContainer from "./FomContainer";

import "./overhead.css";

const { TabPane } = Tabs;

export default function Overhead(props) {
  const { orderStates, orderId, order } = props;
  return (
    <div className="overhead">
      <div className="overhead-container">
        <div className="overhead-main">
          <h1>Накладной</h1>
          <div className="count_number">№</div>
          <Tabs defaultActiveKey="1">
            {orderStates.map((item, id) => {
              const {
                firstCode,
                lastCode,
                customHouseFeeId: { countryId },
              } = item;
              return (
                <TabPane tab={countryId.name} key={id + 1}>
                  <FormContainer
                    orderId={orderId}
                    stateId={countryId._id}
                    firstCode={firstCode}
                    lastCode={lastCode}
                  />
                </TabPane>
              );
            })}
          </Tabs>
        </div>
        {order !== null ? (
          <div className="overhead-right">
            <h4>Информация о заказе</h4>
            <p>
              Плательшик : <span>{order.customerId.name}</span>
            </p>
            <p>
              Отправитель : <span> {order.sender}</span>
            </p>
            <p>
              Получатель : <span>{order.recipient}</span>
            </p>
            <p>
              ст. отправления : <span>{order.senderStation}</span>
            </p>
            <p>
              ст. назначения : <span>{order.arrivalStation}</span>
            </p>
            <p>
              Груз : <span>{order.cargoType}</span>
            </p>
            <p>
              Количествавагон : <span>{order.carriageCount}</span>
            </p>
            <p>
              Возврат : <span>{order.carriageReturn}</span>
            </p>
            <p>
              Остало : <span>{order.carriageRemainder}</span>
            </p>
            <p>
              Обем : <span>{order.capacity}</span>
            </p>
            <p>
              Обшая ставка : <span>{order.generalRate}</span>
            </p>
            <p>
              Доп.сбор : <span>{order.additionalFee}</span>
            </p>
            <p>
              Цена за тон : <span>{order.pricePerTon}</span>
            </p>
            <p>
              ТЛГ сумма :{" "}
              <span>
                {order.tlg.uzsPrice}/{order.tlg.usdPrice} USD
              </span>
            </p>
            <p>
              Обшая цена : <span>{order.totalPrice}</span>
            </p>
          </div>
        ) : null}
      </div>
      <div className="bg-dark" />
    </div>
  );
}
