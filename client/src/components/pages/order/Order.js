import React, { useEffect } from "react";
import { ChangeMenu } from "../../../actions";
import { useDispatch } from "react-redux";
import { useMask } from "react-mask-field";
import { Button } from "./../../assistant";
import TableCol from "./TableCol";
import "./order.css";

export default function Order(props) {
  const { term, startDate, endDate, orders, onChange } = props;
  const refStartDate = useMask({
    mask: "__.__.____",
    replacement: { _: /\d/ },
  });
  const refEndDate = useMask({ mask: "__.__.____", replacement: { _: /\d/ } });
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
              <input
                type="text"
                name="startDate"
                placeholder="24.02.2022"
                ref={refStartDate}
                value={startDate}
                onChange={onChange}
              />
              <input
                type="text"
                name="endDate"
                placeholder="24.02.2022"
                ref={refEndDate}
                value={endDate}
                onChange={onChange}
              />
              <Button type="button">Поиск</Button>
            </div>
            <div className="exel">
              <Button type="button">Скачать Excel</Button>
            </div>
          </div>
        </div>
        <div className="table">
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
                <TableCol key={item._id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
