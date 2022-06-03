import React, { PureComponent } from "react";
import axiosInter from "./../../../utils/axiosInterceptors";
import Overhead from "./Overhead";

class OverheadContainer extends PureComponent {
  state = {
    orderStates: [],
    orderId: "",
    overheads: [],
    order: null,
  };

  componentDidMount() {
    this.getStates();
  }

  getStates = () => {
    const data = window.location.pathname.split("/");
    const id = data[data.length - 1];

    axiosInter.get("/api/order/" + id).then(res => {
      const { territoryTransportation } = res.data;
      this.setState({
        orderStates: territoryTransportation,
        orderId: id,
        order: res.data,
      });
    });
  };

  render() {
    return <Overhead {...this.state} />;
  }
}

export default OverheadContainer;
