import React, { Component } from "react";
import axiosInter from "./../../../../utils/axiosInterceptors";
import Border from "./Border";
import { toast } from "react-toastify";

class BorderContainer extends Component {
  state = {
    carriages: [],
    countries: [],
    carriageId: "",
    countryId: "",
    price: "",
    loading: true,
    uploadLoading: true,
    data: [],
  };

  componentDidMount() {
    this.getCarriages();
    this.getCountries();
    this.getAllBorders();
  }

  getCarriages = () => {
    axiosInter.get("/api/carriage").then(res => {
      const { carriages } = res.data;
      carriages.forEach(item => {
        this.setState({
          carriages: [
            ...this.state.carriages,
            { value: item._id, label: item.typeCarriage },
          ],
        });
      });
    });
  };

  getCountries = () => {
    axiosInter.get("/api/country").then(res => {
      const { countries } = res.data;
      countries.forEach(item => {
        this.setState({
          countries: [
            ...this.state.countries,
            {
              value: item._id,
              label: item.name,
            },
          ],
        });
      });
    });
  };

  getAllBorders = () => {
    axiosInter.get("/api/customHouseFee").then(res => {
      this.setState({
        data: res.data,
        loading: false,
        uploadLoading: false,
      });
    });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSelectChange = (e, type) => {
    const { label, value } = e;
    const { name } = type;
    this.setState({
      [name]: {
        value,
        label,
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      carriageId: { value: carriageId },
      countryId: { value: countryId },
      price,
    } = this.state;
    const data = { carriageId, countryId, price: Number(price) };
    axiosInter
      .post("/api/customHouseFee", data)
      .then(res => {
        toast.success(res.data);
        this.getAllBorders();
        this.setState({ uploadLoading: true });
      })
      .catch(err => {
        console.log("error");
        // const { errors } = err.response.data;
        // if (errors) {
        //   errors.forEach(item => {
        //     const { param, msg } = item;
        //     this.setState({
        //       [param]: msg,
        //     });
        //   });
        // } else {
        //   toast.error(err.response.data);
        // }
      });
  };

  handleDelete = id => {
    axiosInter.delete("/api/customHouseFee/" + id).then(res => {
      toast.success(res.data);
      this.getAllBorders();
    });
  };

  render() {
    return (
      <Border
        {...this.state}
        onChange={this.handleChange}
        onSelectChange={this.handleSelectChange}
        onDelete={this.handleDelete}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default BorderContainer;
