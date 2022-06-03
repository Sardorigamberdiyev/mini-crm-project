import React from "react";
import { Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/app";
import {
  Login,
  Home,
  Debts,
  Order,
  Admin,
  AdminPayer,
  AdminState,
  AdminOperator,
  AdminWagon,
  Overhead,
} from "./components/pages";

const useRoutes = (isAuth, authRole) => {
  const authRoutes = (
    <>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/:id" element={<Home />} />
        <Route path="/debts" element={<Debts />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order/:id" element={<Overhead />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminWagon />} />
          <Route path="operator" element={<AdminOperator />} />
          <Route path="payer" element={<AdminPayer />} />
          <Route path="state" element={<AdminState />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </>
  );

  const unauthRoutes = (
    <>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  );

  return isAuth === "yes" ? authRoutes : unauthRoutes;
};

export default useRoutes;
