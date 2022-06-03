import React, { useState } from "react";
import { Button } from "../assistant";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import axiosInter from "./../../utils/axiosInterceptors";
import "./modal.css";

export default function ModalInfo({ id, text, setModalInfo, getOrders }) {
  const area = text ? text : "";
  const [infoText, setInfoText] = useState(area);
  const [infoColor, setColor] = useState("transparent");
  const colors = ["transparent", "#54DFBE", "#DF545C", "#3A4A6B", "#DFC954"];

  const onSubmit = e => {
    e.preventDefault();
    const data = {
      infoText,
      infoColor,
    };
    axiosInter.put("/api/order/info/" + id, data).then(res => {
      toast.success(res.data);
      setModalInfo(false);
      getOrders();
    });
  };

  return (
    <div className="modal">
      <form onSubmit={onSubmit}>
        <div className="exet" onClick={() => setModalInfo(false)}>
          <AiOutlineClose />
        </div>
        <h1>Дп.информация</h1>
        <label htmlFor="text">Информация</label>
        <textarea
          name="infoText"
          id="text"
          value={infoText}
          onChange={e => setInfoText(e.target.value)}
        ></textarea>
        <div className="colors">
          {colors.map(item => (
            <div
              onClick={() => setColor(item)}
              key={item}
              className={`color ${
                infoColor === item && infoColor !== "transparent"
                  ? "active"
                  : ""
              }`}
              style={{ backgroundColor: item }}
            />
          ))}
        </div>
        <div className="button">
          <Button type="submit">Сохранит</Button>
        </div>
      </form>
    </div>
  );
}
