import React, { Component } from "react";
import { ChangeMenu, isCheckAuth } from "../../../actions";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import axiosInter from "../../../utils/axiosInterceptors";
import Home from "./home";
import currency from "./../../../utils/usbTosum";

class HomeContainer extends Component {
  state = {
    options: [],
    states: [],
    wagons: [],
    firm: "firm-1",
    date: "",
    senderStation: "",
    arrivalStation: "",
    customerId: "",
    sender: "",
    recipient: "",
    cargoType: "мпс",
    carriageId: "",
    carriageCount: "",
    capacity: "",
    territoryTransportation: [],
    territorialTotalCost: 0,
    additionalFee: "",
    pricePerTon: 0,
    sum: "",
    usb: "",
  };

  componentDidMount() {
    this.props.Changemenu("home");
    this.getPayers();
    this.getStates();
    this.getWagons();
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      capacity: a,
      carriageCount: b,
      additionalFee: c,
      territorialTotalCost: d,
    } = prevState;
    const {
      capacity,
      carriageCount,
      additionalFee,
      territorialTotalCost,
    } = this.state;
    if (
      capacity &&
      carriageCount &&
      additionalFee &&
      territorialTotalCost &&
      (capacity !== a ||
        carriageCount !== b ||
        additionalFee !== c ||
        territorialTotalCost !== d)
    ) {
      let pricePerTon = additionalFee / (capacity / carriageCount);
      pricePerTon =
        Math.round((pricePerTon + territorialTotalCost) * 1000) / 1000;
      console.log(pricePerTon);
      this.setState({ pricePerTon });
    }
    if (
      (!capacity ||
        !carriageCount ||
        !additionalFee ||
        !territorialTotalCost) &&
      (capacity !== a ||
        carriageCount !== b ||
        additionalFee !== c ||
        territorialTotalCost !== d)
    ) {
      this.setState({
        pricePerTon: 0,
      });
    }
  }
  getPayers = async () => {
    await axiosInter.get("/api/customer").then(res => {
      res.data.customers.forEach(item => {
        this.setState({
          options: [
            ...this.state.options,
            {
              value: item._id,
              label: item.name,
            },
          ],
        });
      });
    });
  };
  getWagons = async () => {
    await axiosInter.get("/api/carriage").then(res => {
      res.data.carriages.forEach(item => {
        this.setState({
          wagons: [
            ...this.state.wagons,
            {
              value: item._id,
              label: item.typeCarriage,
            },
          ],
        });
      });
    });
  };
  getStates = async () => {
    await axiosInter.get("/api/state").then(res => {
      const { states } = res.data;
      this.setState({ states });
    });
  };

  handleState = (key, value) => {
    this.setState({
      [key]: value,
    });
  };
  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };
  handleSelectChange = (e, type) => {
    const { value } = e;
    const { name } = type;
    this.setState({
      [name]: value,
    });
  };
  handleInputMoney = e => {
    const { name, value } = e.target;
    if (name === "usb") {
      this.setState({ [name]: value });
    } else if (name === "sum") {
      currency(value, "USD").then(usb => {
        const usd = Math.round(usb * 10000) / 10000;
        this.setState({ sum: value, usb: usd });
      });
    }
  };
  handleSubmit = async e => {
    e.preventDefault();
    const {
      date,
      firm,
      carriageId,
      customerId,
      senderStation,
      arrivalStation,
      sender,
      recipient,
      cargoType,
      carriageCount,
      capacity,
      territoryTransportation,
      territorialTotalCost,
      additionalFee,
      pricePerTon,
      sum,
      usb,
    } = this.state;

    let dateArr = date.split("/");
    const [day, month, year] = dateArr;
    const dateIssue = new Date(year, month - 1, day);
    const data = {
      firm,
      dateIssue,
      senderStation,
      arrivalStation,
      carriageId,
      customerId,
      sender,
      recipient,
      cargoType,
      carriageCount,
      capacity,
      territoryTransportation,
      territorialTotalCost,
      additionalFee,
      pricePerTon,
      tlg: {
        uzsPrice: sum,
        usdPrice: usb,
      },
    };
    await axiosInter
      .post("/api/order", data)
      .then(res => {
        toast.success(res.data);
        this.setState({
          options: [],
          states: [],
          wagons: [],
          date: "",
          senderStation: "",
          arrivalStation: "",
          customerId: "",
          sender: "",
          recipient: "",
          cargoType: "мпс",
          carriageId: "",
          carriageCount: "",
          capacity: "",
          territoryTransportation: [],
          territorialTotalCost: 0,
          additionalFee: "",
          pricePerTon: 0,
          sum: "",
          usb: "",
        });
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  render() {
    return (
      <Home
        {...this.state}
        onSelectChange={this.handleSelectChange}
        onInputChange={this.handleInputChange}
        handleState={this.handleState}
        onSubmit={this.handleSubmit}
        onInputMoney={this.handleInputMoney}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    menu: state.menu,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    isCheckAuth: () => dispatch(isCheckAuth()),
    Changemenu: menu => dispatch(ChangeMenu(menu)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
