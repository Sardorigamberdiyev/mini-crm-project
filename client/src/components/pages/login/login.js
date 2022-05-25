import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { isCheckAuth } from "../../../actions";
import { toast } from "react-toastify";
import axiosInter from "../../../utils/axiosInterceptors";
import "./login.css";

const Login = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = () => {
    axiosInter
      .post("/api/auth/login", { login, password })
      .then(response => {
        toast.success(response.data);
        dispatch(isCheckAuth());
      })
      .catch(err => {
        toast.error(err.response.data);
      });
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="login"
        value={login}
        onChange={e => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="button" onClick={loginHandler}>
        Войти
      </button>
    </div>
  );
};

export default Login;
