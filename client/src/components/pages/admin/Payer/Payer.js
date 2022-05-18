import React, { useEffect} from "react";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from '../../../../actions'
import { Element, Button, Input, Pagination } from "../../../assistant";
import { Spiner } from "../../../assistant";
export default function Payer(props ){

  const {
    name, nameValue, phone, phoneValue,
    loading,  uploadLoading, allPayers, 
    onChange, onSubmit, onDelete, onSkip,
    limit, skip, customersMaxLength
  } = props

  const dispatch =useDispatch()
  useEffect(()=>{
    dispatch(ChangeAdminMenu('payer'))
  }, [dispatch])

  return <div className="payer">
           <div className="payer_push">
              <h1>Клиенты</h1>
              <form onSubmit={onSubmit}>
                  <Input 
                       placeholder='имя и фамилия'
                       type='text'
                       name='nameValue'
                       onChange={onChange}
                       value={nameValue}
                       error={name}/> 
                    <Input 
                      placeholder='Тел номер'
                      type='text'
                      name='phoneValue'
                      onChange={onChange}
                      value={phoneValue}
                      error={phone}/> 
                  <div className="button">
                    <Button type='submit'>
                        Добавлять
                    </Button>
                  </div>
              </form>
            </div>   
              <div className="payer-element">
                {loading ? <Spiner /> : <><div className="payer_all">
                  {allPayers.map(item=><Element
                      key={item._id}
                      onDelete={onDelete}
                      id={item._id}
                      textArray={[item.name, item.phone]} />)}
                </div>
                {uploadLoading ? <Spiner/> : null}
                </>} 
            </div>
            <Pagination 
                skip={skip}
                limit = {limit}
                total={customersMaxLength} 
                onSkip = {onSkip}/>      
  </div>;
}
