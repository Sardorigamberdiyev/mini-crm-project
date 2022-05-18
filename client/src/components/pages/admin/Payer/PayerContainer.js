import React, {Component} from "react";
import axiosInter from './../../../../utils/axiosInterceptors'
import { toast } from "react-toastify";
import Payer from './Payer'
class PayerContainer extends Component {
    
    
        state = { 
            name : '',
            phone: '',
            nameValue : '',
            phoneValue: '',
            limit: 6,
            skip: 0,
            customersMaxLength: 0,
            allPayers : [],
            loading: true, 
            uploadLoading: false
        }
        
        componentDidMount(){
            this.getPayers()
        }
        componentDidUpdate(prevProps, prevState){
            const {skip : prevSkip} = prevState
            const {skip, customersMaxLength, limit} = this.state
      
            if(customersMaxLength%limit === 0 && skip > limit){
              this.setState({
                loading: true,
                skip: 0
              })
            }
            if(skip !== prevSkip){
              this.setState({
                loading: true
              })
              this.getPayers(skip)
            }
          }
          handleSetSkip = (value) =>{
            const { limit } = this.state
            let skip = (value - 1)*limit
            this.setState({
               skip
             })
          }
        handleChange = (e)=>{
            const {name, value} = e.target
            this.setState({
                [name] : value
            })
        }

        handleSubmit = async (e) =>{
            e.preventDefault()
            const {phoneValue, nameValue} = this.state
            
            const data = { phone: phoneValue, 
                        name: nameValue,}

            await axiosInter.post('/api/customer', data)
            .then(res=>{
                    toast.success(res.data)
                    this.setState({
                    uploadLoading: true,
                    nameValue : '',
                    phoneValue: '',
                    name: '',
                    phone: '',
                    })
                    this.getPayers()
                
            }).catch(err=>{
                const {errors} = err.response.data
                if(errors){
                    errors.forEach(item=>{
                    const {param, msg} = item
                    this.setState({
                        [param] : msg
                    })
                    })
                }else{ 
                    toast.error(err.response.data)
                }
            })
        }
        
    getPayers = async () =>{
        const { limit, skip}  = this.state
        await axiosInter.get('/api/customer/', {
            params: {
                skip,
                limit
            }
        }).then(res=>{
            const {customersMaxLength, customers} =res.data
            this.setState({
                allPayers: customers,
                customersMaxLength,
                loading: false,
                uploadLoading: false,
            })
        })
    }

    deletePayer = async (id) =>{
        await axiosInter.delete('/api/customer/'+id).then(res=>{
            toast.success(res.data)
            this.getPayers()
            })
    }
    render() { 
        return ( <Payer 
                    {...this.state}
                    onDelete={this.deletePayer}
                    onChange={this.handleChange} 
                    onSubmit={this.handleSubmit}    
                    onSkip = {this.handleSetSkip}      
                    /> );
    }
}
 
export default PayerContainer;