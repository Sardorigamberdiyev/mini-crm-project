import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from './../../../actions'
import { Input, Button, Element } from "../../assistant";

export default function States() {
  
  const dispatch =useDispatch()
  useEffect(()=>{
    dispatch(ChangeAdminMenu('state'))
  }, [dispatch])
  return <div className="state">
            <div className="state_push">
              <h1>Госуарства</h1>
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
            <div className="state_all">
              <Element 
                  textArray={['Element', `sadsa sdsa`]} />
            </div>     
          </div>;
}
