import React, { useEffect} from "react";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from './../../../actions'
import { Element, Input, Button } from "../../assistant";

export default function Operators() {

  const dispatch =useDispatch()
  useEffect(()=>{
    dispatch(ChangeAdminMenu('operator'))
  }, [dispatch])

  return <div className="operator">
            <div className="operator_push">
              <h1>учетная запись</h1>
              <form>
                  <Input 
                      name='wagon'
                      type='text'/> 
                    <Input 
                      name='wagon'
                      type='text'/> 
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
            <div className="operator_all">
              <Element 
                  textArray={['Element', "item", "Item"]} />
                
            </div>     
          </div>;
}
