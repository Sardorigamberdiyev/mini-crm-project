import React, { useState } from "react";
import { Button } from "../assistant";
import { useMask } from "react-mask-field";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import axiosInter from "./../../utils/axiosInterceptors";
import "./modal.css";

const DoingModal = ({ id, firm, setModalDoing, getOrders }) => {
  const refDoing = useMask({ mask: "__/__/____", replacement: { _: /\d/ } });

  const [doing, setDoing] = useState("");
  const [date, setDate] = useState("");
  const onSubmit = e => {
    e.preventDefault();
    let dateArr = date.split("/");
    const [day, month, year] = dateArr;
    const dateIssue = new Date(year, month - 1, day, 0, 0, 0, 0);
    const data = { cost: doing, date: dateIssue };
    axiosInter.put("/api/order/doing/" + id, data).then(res => {
      toast.success(res.data);
      setModalDoing(false);
      getOrders();
    });
  };
  return (
    <div className="modal">
      <form onSubmit={onSubmit}>
        <div className="exet" onClick={() => setModalDoing(false)}>
          <AiOutlineClose />
        </div>
        <h1>Поступая</h1>
        <div className="doing">
          <div>
            <label>Фирма</label>
            <input disabled={true} type="text" name="firm" value={firm} />
          </div>
          <div>
            <label>Дата</label>{" "}
            <input
              onChange={e => setDate(e.target.value)}
              type="text"
              name="date"
              value={date}
              ref={refDoing}
            />
          </div>
          <div>
            <label>Поступая</label>
            <input
              type="number"
              name="doing"
              value={doing}
              onChange={e => setDoing(e.target.value)}
            />
          </div>
        </div>
        <div className="button">
          <Button type="submit">Сохранит</Button>
        </div>
      </form>
    </div>
  );
};

export default DoingModal;
