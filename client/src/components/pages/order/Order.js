import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DatePicker, Space } from "antd";
import { ChangeMenu } from "../../../actions";
import { Button, Spiner, Pagination } from "./../../assistant";
import TableCol from "./TableCol";
import "./order.css";
const { RangePicker } = DatePicker;

export default function Order(props) {
  const {
    skip,
    limit,
    ordersMaxLength,
    term,
    orders,
    onChange,
    dateChange,
    getOrders,
    onSkip,
    loading,
    getExel,
  } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ChangeMenu("order"));
  }, [dispatch]);

  return (
    <div className="order">
      <div className="statistic">
        <div className="container">
          <div className="box">
            <p>Количество вагон</p>
            <p>1500</p>
          </div>
          <div className="box">
            <p>Обём</p>
            <p>150</p>
          </div>
          <div className="box">
            <p>Вагони</p>
            <p>150</p>
          </div>
          <div className="box">
            <p>Oбшая цена</p>
            <p>150</p>
          </div>
          <div className="box">
            <p>Поступая</p>
            <p>150</p>
          </div>
          <div className="box">
            <p>Долги</p>
            <p>150</p>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="order-header">
          <div className="conatiner">
            <div className="search">
              <input
                type="text"
                name="term"
                placeholder="Поиск"
                value={term}
                onChange={onChange}
              />
              <Space>
                <RangePicker onChange={dateChange} />
              </Space>
              <Button type="button" className="btn-search">
                Поиск
              </Button>
            </div>
            <div className="exel">
              <Button type="button" onClick={getExel}>
                Скачать Excel
              </Button>
            </div>
          </div>
        </div>
        <div className="table">
          {!loading ? (
            <table>
              <thead>
                <tr>
                  <th>Дата выдача</th>
                  <th>Специалний код</th>
                  <th>ст. отправления</th>
                  <th>ст. назначения </th>
                  <th>Плательщик</th>
                  <th>Отправитель</th>
                  <th>Получатель</th>
                  <th>Груз</th>
                  <th>Количества вагон</th>
                  <th>Возврат</th>
                  <th>Остало</th>
                  <th>Обем</th>
                  <th>Обшая ставка</th>
                  <th>Доп. сбор</th>
                  <th>Цена за тон</th>
                  <th>ТЛГ сумма</th>
                  <th>Обшая цена</th>
                  <th>Поступая</th>
                  <th>Сальдо</th>
                  <th>Дп. информация</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(item => (
                  <TableCol key={item._id} item={item} getOrders={getOrders} />
                ))}
              </tbody>
            </table>
          ) : (
            <Spiner />
          )}
        </div>
        {ordersMaxLength > limit ? (
          <Pagination
            skip={skip}
            defaultCurrent={1}
            limit={limit}
            onSkip={onSkip}
            total={ordersMaxLength}
          />
        ) : null}
      </div>
    </div>
  );
}
