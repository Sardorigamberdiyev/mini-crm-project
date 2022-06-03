import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { isCheckAuth } from "../../../actions";
import { toast } from "react-toastify";
import axiosInter from "../../../utils/axiosInterceptors";
import { Input, Button } from "./../../assistant";
import "./login.css";

const Login = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);

  const loginHandler = e => {
    e.preventDefault();
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
      <form className="block" onSubmit={loginHandler}>
        <h1>Login</h1>
        <Input
          type="text"
          placeholder="login"
          required
          value={login}
          onChange={e => setLogin(e.target.value)}
        />
        <Input
          type={check ? "text" : "password"}
          placeholder="password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />
        <input
          id="password-check"
          type="checkbox"
          onChange={() => setCheck(!check)}
          value={check}
        />
        <label htmlFor="password-check">Password</label>
        <div className="login-button">
          <Button type="submit">Войти</Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
