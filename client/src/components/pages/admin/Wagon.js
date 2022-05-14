import React, { useEffect} from "react";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from './../../../actions'
import {Input, Button, Element} from './../../assistant'

export default function Wagon() {
  
  const dispatch =useDispatch()
  useEffect(()=>{
    dispatch(ChangeAdminMenu('wagon'))
  }, [dispatch])
  return <div className="wagon">
            <div className="wagon_push">
              <h1>Baгон</h1>
              <form>
                  <Input 
                      name='wagon'
                      type='text'/>
                  <Button type='submit'>
                      Добавлять
                  </Button>
              </form>
            </div> 
            <div className="wagon_all">
              <Element
                  textArray={['Element']} />
            </div>     
        </div>;
}
