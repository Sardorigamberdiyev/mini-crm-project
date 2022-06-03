import React, { useState } from "react";
import { Button, Input } from "../assistant";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import axiosInter from "./../../utils/axiosInterceptors";
import "./modal.css";

export default function WagonModal({ id, wagon, setModalWagon, getOrders }) {
  const [wagonValue, setWagonValue] = useState(wagon);
  const [carriageReturn, setCarriageReturn] = useState("");

  const onChange = e => {
    const item = wagon - e.target.value;
    if (wagon * item >= 0) {
      setCarriageReturn(e.target.value);
      setWagonValue(item);
    }
  };
  const onSubmit = e => {
    e.preventDefault();
    const data = { carriageReturn };
    axiosInter.put("/api/order/wagon/return/" + id, data).then(res => {
      toast.success(res.data);
      setModalWagon(false);
      getOrders();
    });
  };
  return (
    <div className="modal">
      <form onSubmit={onSubmit}>
        <div className="exet" onClick={() => setModalWagon(false)}>
          <AiOutlineClose />
        </div>
        <h1>Возврать вагон</h1>
        <div className="group">
          <div>
            <label htmlFor="wagonValue">Количество вагон</label>
            <Input
              id="wagonValue"
              disabled={true}
              type="number"
              value={wagonValue}
            />
          </div>
          <div>
            <label>Возвратит</label>
            <Input type="number" value={carriageReturn} onChange={onChange} />
          </div>
        </div>
        <div className="button">
          <Button type="submit">Сохранит</Button>
        </div>
      </form>
    </div>
  );
}
