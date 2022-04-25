import {Component} from 'react'
import { isCheckAuth } from '../../../actions';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import axios from '../../../utils/axiosInterceptors';
import Home from './home';

class HomeContainer extends Component {
    
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
        isCheckAuth: () => dispatch(isCheckAuth())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( HomeContainer);