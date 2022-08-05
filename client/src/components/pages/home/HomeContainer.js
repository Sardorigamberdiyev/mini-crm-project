import React, { PureComponent } from "react";
import { useNavigate } from "react-router-dom";
import { ChangeMenu } from "../../../actions";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosInter from "../../../utils/axiosInterceptors";
import Home from "./home";
import currency from "./../../../utils/usbTosum";

export default function HomeContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return <Container dispatch={dispatch} navigate={navigate} />;
}

class Container extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      customHouseFees: [],
      countries: [],
      wagons: [],
      firm: "firm-1",
      date: "",
      senderStation: "",
      arrivalStation: "",
      customerId: "",
      defaultCustomerId: "",
      sender: "",
      recipient: "",
      cargoType: "мпс",
      carriageId: "",
      defaultCarriageId: "",
      carriageCount: "",
      capacity: "",
      territoryTransportation: [],
      defaultTerritoryTransportation: [],
      generalRate: 0,
      additionalFee: "",
      pricePerTon: 0,
      sum: "",
      usb: "",
    };
    this.ref = React.createRef();
    this.ref = true;
  }
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(ChangeMenu("home"));
    const data = window.location.pathname.split("/");
    const id = data[data.length - 1];
    if (id) {
      this.getOrder(id);
    }
    this.getPayers();
    this.getStates();
    this.getWagons();
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      capacity: a,
      carriageCount: b,
      additionalFee: c,
      generalRate: d,
    } = prevState;
    const { capacity, carriageCount, additionalFee, generalRate } = this.state;
    if (
      capacity &&
      carriageCount &&
      additionalFee &&
      generalRate &&
      (capacity !== a ||
        carriageCount !== b ||
        additionalFee !== c ||
        generalRate !== d)
    ) {
      let pricePerTon = additionalFee / (capacity / carriageCount);
      pricePerTon = Math.round((pricePerTon + generalRate) * 1000) / 1000;
      this.setState({ pricePerTon });
    }
    if (
      (!capacity || !carriageCount || !additionalFee || !generalRate) &&
      (capacity !== a ||
        carriageCount !== b ||
        additionalFee !== c ||
        generalRate !== d)
    ) {
      this.setState({
        pricePerTon: 0,
      });
    }
  }
  componentWillUnmount() {
    this.ref = false;
    this.setState = (state, callback) => {
      return;
    };
  }
  getOrder = async id => {
    await axiosInter.get("/api/order/" + id).then(res => {
      const {
        firm,
        dateIssue,
        senderStation,
        arrivalStation,
        sender,
        customerId,
        recipient,
        cargoType,
        carriageCount,
        carriageReturn,
        carriageRemainder,
        capacity,
        generalRate,
        territoryTransportation,
        additionalFee,
        pricePerTon,
        carriageId,
        tlg: { uzsPrice: sum, usdPrice: usd },
      } = res.data;
      const defaultCustomerId = {
        label: customerId.name,
        value: customerId._id,
      };
      const defaultCarriageId = {
        label: carriageId.typeCarriage,
        value: carriageId._id,
      };
      this.getCustomHouseFee(carriageId._id);
      const date = new Date(dateIssue),
        day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate(),
        month = date.getMonth() > 9 ? date.getMonth() : "0" + date.getMonth(),
        year = date.getFullYear();
      const datafull = day + "/" + (month + 1) + "/" + year;

      if (this.ref)
        this.setState({
          defaultCustomerId,
          defaultCarriageId,
          firm,
          customerId: customerId._id,
          carriageId: carriageId._id,
          date: datafull,
          senderStation,
          arrivalStation,
          sender,
          recipient,
          cargoType,
          carriageCount,
          carriageReturn,
          carriageRemainder,
          capacity,
          generalRate,
          territoryTransportation,
          additionalFee,
          pricePerTon,
          sum,
          usd,
        });
    });
  };
  getPayers = async () => {
    await axiosInter.get("/api/customer").then(res => {
      res.data.customers.forEach(item => {
        if (this.ref)
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
        if (this.ref)
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
  getCustomHouseFee = async (carriageId = null) => {
    await axiosInter
      .get("/api/customHouseFee", {
        params: {
          carriageId,
        },
      })
      .then(res => {
        const customHouseFees = res.data;
        this.setState({ customHouseFees });
      });
  };
  getStates = async () => {
    await axiosInter.get("/api/country").then(res => {
      const { countries } = res.data;
      this.setState({ countries });
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
    const { value, label } = e;
    const { name } = type;
    if (name === "customerId") {
      this.setState({
        defaultCustomerId: {
          label,
          value,
        },
        [name]: value,
      });
    } else if (name === "carriageId") {
      this.setState({
        defaultCarriageId: {
          label,
          value,
        },
        [name]: value,
        territoryTransportation: [],
        generalRate: 0,
      });
      this.getCustomHouseFee(value);
    } else {
      this.setState({
        [name]: value,
      });
    }
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
  handleSubmit = e => {
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
      generalRate,
      additionalFee,
      pricePerTon,
      sum,
      usb,
    } = this.state;

    let dateArr = date.split("/");
    const [day, month, year] = dateArr;
    const dateIssue = new Date(year, month - 1, day, 0, 0, 0, 0).toISOString();

    const territories = territoryTransportation.map(item => {
      const {
        firstCode,
        lastCode,
        customHouseFeeId: { _id: customHouseFeeId },
      } = item;
      return {
        firstCode,
        lastCode,
        customHouseFeeId,
      };
    });

    const data = {
      firm,
      dateIssue,
      senderStation,
      arrivalStation,
      customerId,
      sender,
      recipient,
      cargoType,
      carriageId,
      carriageCount,
      capacity,
      territoryTransportation: territories,
      generalRate,
      additionalFee,
      pricePerTon,
      tlg: {
        uzsPrice: Number(sum),
        usdPrice: Number(usb),
      },
    };

    const ipArr = window.location.pathname.split("/");
    const id = ipArr[ipArr.length - 1];
    const IpURL = id ? "/api/order/" + id : "/api/order";
    const rest = id ? "put" : "post";

    axiosInter[rest](IpURL, data)
      .then(res => {
        toast.success(res.data);
        if (id) {
          const { navigate } = this.props;
          navigate("/order");
        }
        // this.setState({
        //   date: "",
        //   senderStation: "",
        //   arrivalStation: "",
        //   customerId: "",
        //   sender: "",
        //   recipient: "",
        //   cargoType: "мпс",
        //   carriageId: "",
        //   carriageCount: "",
        //   capacity: "",
        //   territoryTransportation: [],
        //   generalRate: 0,
        //   additionalFee: "",
        //   pricePerTon: 0,
        //   sum: "",
        //   usb: "",
        //   defaultCustomerId: "",
        //   defaultCarriageId: "",
        //   defaultTerritoryTransportation: [],
        // });
      })
      .catch(err => {
        console.log(err.response);
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

// const mapStateToProps = state => {
//   return {
//     menu: state.menu,
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     isCheckAuth: () => dispatch(isCheckAuth()),
//     Changemenu: menu => dispatch(ChangeMenu(menu)),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
