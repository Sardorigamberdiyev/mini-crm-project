import React, { useEffect} from "react";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from '../../../../actions'
import { Element, Input, Button, Spiner, Pagination } from "../../../assistant";

export default function Operators(props) {
  const {
    firstName, lastName, login, password,
    firstNameValue, lastNameValue, loginValue, passwordValue,
    allOperators, loading, uploadLoading, 
    usersMaxLength, limit, skip, onSkip,
    onSubmit, onChange, onDelete} = props

  const dispatch =useDispatch()
  useEffect(()=>{
    dispatch(ChangeAdminMenu('operator'))
  }, [dispatch])

  return <div className="operator">
            <div className="operator_push">
              <h1>учетная запись</h1>
              <form onSubmit={onSubmit}>
                  <Input 
                      name='firstNameValue'
                      type='text'
                      placeholder='имя'
                      onChange={onChange}
                      value={firstNameValue}
                      error={firstName}/> 
                    <Input 
                      name='lastNameValue'
                      type='text'
                      placeholder='фамилия'
                      onChange={onChange}
                      value={lastNameValue}
                      error={lastName}/> 
                    <Input 
                      name='loginValue'
                      type='text'
                      placeholder='авторизоваться'
                      onChange={onChange}
                      value={loginValue}
                      error={login}/> 
                    <Input 
                      name='passwordValue'
                      type='text'
                      placeholder='пароль'
                      onChange={onChange}
                      value={passwordValue}
                      error={password}/> 
                  <div className="button">
                    <Button type='submit'>
                        Добавлять
                    </Button>
                  </div>
              </form>
            </div> 
            
            <div className="operator-element">
              {loading ? <Spiner /> : <><div className="operator_all">
                {allOperators.map(item=><Element
                    key={item._id}
                    onDelete={onDelete}
                    id={item._id}
                    textArray={[item.firstName, item.lastName, item.login]} />)}
              </div>
              {uploadLoading ? <Spiner/> : null}
              </>}  
            </div>
            <Pagination 
                skip={skip}
                limit = {limit}
                total={usersMaxLength} 
                onSkip = {onSkip}/>     
          </div>;
}
