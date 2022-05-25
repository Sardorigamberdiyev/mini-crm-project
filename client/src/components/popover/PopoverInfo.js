import React, { useState } from "react";
import InfoModal from "../modal/InfoModal";
import WagonModal from "../modal/WagonModal";
import DeleteModal from "./../modal/DeleteModal";
import { BsArrowRepeat, BsFillPencilFill, BsTrashFill } from "react-icons/bs";
import "./popover.css";

const PopoverInfo = ({ id, text, wagon }) => {
  const [modalInfo, setModalInfo] = useState(false);
  const [modalWagon, setModalWagon] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  return (
    <div className="popoverInfo">
      {modalInfo ? (
        <InfoModal id={id} text={text} setModalInfo={setModalInfo} />
      ) : null}
      {modalWagon ? (
        <WagonModal id={id} wagon={wagon} setModalWagon={setModalWagon} />
      ) : null}
      {modalDelete ? (
        <DeleteModal id={id} setModalDelete={setModalDelete} />
      ) : null}
      <div className="info" onClick={() => setModalInfo(true)}>
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
