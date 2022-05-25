import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChangeMenu } from "./../../../actions";
import "./debts.css";

export default function Debts() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ChangeMenu("debts"));
  }, [dispatch]);

  return <div>Debts</div>;
}
