import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowRepeat, BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import WagonModal from "../modal/WagonModal";
import DeleteModal from "./../modal/DeleteModal";
import "./popover.css";

const PopoverInfo = ({ id, wagon, getOrders }) => {
  const [modalWagon, setModalWagon] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const navigate = useNavigate();
  const editPage = () => {
    navigate(`/${id}`);
  };

  return (
    <div className="popoverInfo">
      {modalWagon ? (
        <WagonModal
          id={id}
          wagon={wagon}
          setModalWagon={setModalWagon}
          getOrders={getOrders}
        />
      ) : null}
      {modalDelete ? (
        <DeleteModal
          id={id}
          setModalDelete={setModalDelete}
          getOrders={getOrders}
        />
      ) : null}
      <div className="info" onClick={editPage}>
        <BsFillPencilFill /> Изменить
      </div>
      <div className="info" onClick={() => setModalWagon(true)}>
        <BsArrowRepeat /> Возврат
      </div>
      <div className="info" onClick={() => setModalDelete(true)}>
        <BsTrashFill /> Удалит
      </div>
    </div>
  );
};
export default PopoverInfo;
