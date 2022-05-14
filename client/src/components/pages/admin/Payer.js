import React, { useEffect} from "react";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from './../../../actions'
import { Element, Button, Input } from "../../assistant";

export default function Payer() {

  const dispatch =useDispatch()
  useEffect(()=>{
    dispatch(ChangeAdminMenu('payer'))
  }, [dispatch])

  return <div className="payer">
           <div className="payer_push">
              <h1>Клиенты</h1>
              <form>
                  <Input 
                      name='wagon'
                      type='text'/> 
                    <Input 
                      name='wagon'
                      type='text'/> 
                  <div className="button">
                    <Button type='submit'>
                        Добавлять
                    </Button>
                  </div>
              </form>
            </div> 
            <div className="payer_all">
              <Element 
                  textArray={['Element', "998989999"]} />
            </div>     
  </div>;
}
