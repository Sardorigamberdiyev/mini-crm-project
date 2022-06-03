import React from "react";
import { Button } from "../assistant";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import axiosInter from "./../../utils/axiosInterceptors";
import "./modal.css";

export default function WagonModal({ id, setModalDelete, getOrders }) {
  const deleteCol = () => {
    axiosInter.delete("/api/order/" + id).then(res => {
      toast.success(res.data);
      setModalDelete(false);
      getOrders();
    });
  };
  return (
    <div className="modal">
      <form>
        <div className="exet" onClick={() => setModalDelete(false)}>
          <AiOutlineClose />
        </div>
        <h1>Ты хочешь умереть?</h1>
        <div className="group">
          <div>
            <Button type="button" onClick={() => setModalDelete(false)}>
              Нет
            </Button>
          </div>
          <div>
            <Button type="button" onClick={deleteCol}>
              Да
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
