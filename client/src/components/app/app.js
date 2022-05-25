import React from "react";
import { Routes } from "react-router-dom";
import { connect } from "react-redux";
import useRoutes from "../../routes";

const App = ({ logged_in }) => {
  const routes = useRoutes(logged_in);

  return <Routes>{routes}</Routes>;
};

const mapStateToProps = state => {
  return {
    logged_in: state.loggedIn,
  };
};

export default connect(mapStateToProps)(App);
