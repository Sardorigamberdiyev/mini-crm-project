import React, { Component } from "react";
import { toast } from "react-toastify";
import axiosInter from "./../../../utils/axiosInterceptors";
import Form from "./Form";
class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      defaultItems: [],
    };
  }
  componentDidMount() {
    this.getOverhead();
  }

  InputArr = () => {
    const { firstCode, lastCode } = this.props;
    let itemEnd = firstCode % 1000;
    let itemStart = Math.round(firstCode / 1000, 0);

    let defaultItems = [];
    while (itemEnd <= lastCode) {
      let item = itemStart * 1000 + itemEnd;
      defaultItems.push({
        sending: {
          numberOne: "",
          numberTwo: "",
        },
        carriage: item,
        weight: {
          value: "",
          units: "",
        },
        payment: "",
      });
      itemEnd++;
    }
    this.setState({ defaultItems });
  };

  handleState = (key, value) => {
    this.setState({ [key]: value });
  };

  getOverhead = () => {
    const { orderId, stateId } = this.props;
    axiosInter
      .get("/api/overhead/order", {
        params: {
          orderId,
          stateId,
        },
      })
      .then(res => {
        if (res.data === null) {
          this.InputArr();
        } else {
          this.setState({
            defaultItems: res.data.items,
            items: res.data.items,
          });
        }
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { orderId, stateId } = this.props;
    const { items } = this.state;
    items.sort((a, b) => parseFloat(a.carriage) - parseFloat(b.carriage));
    const data = {
      orderId,
      stateId,
      items,
    };
    axiosInter
      .post("/api/overhead", data)
      .then(res => {
        toast.success(res.data);
      })
      .catch(err => {
        console.log(err.response);
      });
  };
  render() {
    return (
      <Form
        {...this.state}
        onSubmit={this.handleSubmit}
        handleState={this.handleState}
      />
    );
  }
}

export default FormContainer;
