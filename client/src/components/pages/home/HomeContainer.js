import {Component} from 'react'
import { isCheckAuth } from '../../../actions';
import { connect } from 'react-redux'
import axios from '../../../utils/axiosInterceptors';
import Home from './home';
import { Navigate } from 'react-router-dom';

class HomeContainer extends Component {

    handleLogout = () => {
        axios.delete('/api/user/logout')
        .then((response) => {
            isCheckAuth();
            <Navigate to='/' />
            console.log(response);
        })
        .catch((err) => {
            console.log(err.response);
        })
    }

    handleRefreshToken = () => {
        axios.get('/api/token/refresh/access')
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err.response);
            })
    }


    render() { 
        return ( <Home 
            onRefreshToken={this.handleRefreshToken}
            onLogout={this.handleLogout}
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
        menuChecked: () => dispatch(isCheckAuth())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( HomeContainer);