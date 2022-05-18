import React, {Component} from 'react'
import { ChangeMenu, isCheckAuth } from '../../../actions';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import axios from '../../../utils/axiosInterceptors';
import Home from './home';
import currency from './../../../utils/usbTosum'

class HomeContainer extends Component {

    state = {
        farm: 1,
        extradition: '',
        startStation: '',
        endStation: '',
        payer: '',
        sender: '',
        recipient: '',
        type_cargo: '',
        number_wagons: '',
        valume: '',
        sum: '',
        usb: ''
    }

    componentDidMount(){
        this.props.Changemenu('home')
    }

    handleState = (key, value) =>{
        this.setState({
            [key] : value
        })
    }
    handleInputChange = (e) =>{
        const {name, value} = e.target
        console.log(e.target)
        this.setState({
            [name]: value
        })
    }
    handleInputMoney = (e)=>{
        const  { name, value } = e.target
        if(name === 'usb'){
            currency(value, "UZS").then(sum=>{
                this.setState({ usb : value, sum })
            })
        }else if(name === 'sum'){
            currency(value, 'USD').then(usb =>{
                this.setState({sum: value, usb})
            })
        }
    }
    handleSubmit = (e) =>{
        e.preventDefault()

        const formData = new FormData(e.target)

        console.log(...formData)
        this.setState({
            extradition: '',
            startStation: '',
            endStation: '',
            payer: '',
            sender: '',
            recipient: '',
            type_cargo: '',
            number_wagons: '',
            valume: '',
            transportation: '',
            code: '',
            additional: '',
            price: '',
            sum: ''
        })
    }


    handleLogout = () => { 
        axios.delete('/api/user/logout')
        .then((response) => {
            this.props.isCheckAuth();
            toast.success(response.data)
        })
        .catch((err) => {
            console.log(err.response);
        })
    }

    handleRefreshToken = () => {
        axios.get('/api/token/refresh/access')
            .then((response) => {
                toast.success(response.data)
            })
            .catch((err) => {
                console.log(err.response);
            })
    }

    render() { 
        return ( 
        <Home 
            {...this.state}
            onRefreshToken={this.handleRefreshToken}
            onLogout={this.handleLogout}
            onInputChange = {this.handleInputChange}
            handleState={this.handleState}
            onSubmit = {this.handleSubmit}
            onInputMoney ={this.handleInputMoney }
        /> );
    }
}
 

const mapStateToProps = (state) => {
    return {
        menu: state.menu
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        isCheckAuth: () => dispatch(isCheckAuth()),
        Changemenu : (menu) =>dispatch(ChangeMenu(menu))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( HomeContainer);