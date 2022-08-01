import React, { useEffect } from "react";
import { ChangeMenu } from "./../../../actions";
import { useSelector, useDispatch } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  const menu = useSelector(state => state.menuAdmin);
  const distpatch = useDispatch();
  useEffect(() => {
    distpatch(ChangeMenu("admin"));
  }, [distpatch]);
  return (
    <div className="push">
      <div className="push-wrapper">
        <div className="push-menu">
          <h1>Привет Темур!</h1>
          <ul>
            <li className={menu === "wagon" ? "active" : ""}>
              <Link to="/admin">Baгон</Link>
            </li>
            <li className={menu === "operator" ? "active" : ""}>
              <Link to="operator">Операторы</Link>
            </li>
            <li className={menu === "payer" ? "active" : ""}>
              <Link to="payer">Плательщик</Link>
            </li>
            <li className={menu === "state" ? "active" : ""}>
              <Link to="state">Государства</Link>
            </li>
            <li className={menu === "border" ? "active" : ""}>
              <Link to="border">Граница</Link>
            </li>
          </ul>
        </div>
        <div className="block">
          <Outlet />
        </div>
      </div>
      <div className="bg-dark" />
    </div>
  );
}
