import React, { useEffect} from "react";
import { useDispatch } from "react-redux";
import { ChangeAdminMenu } from '../../../../actions'
import {Input, Button, Element, Spiner, Pagination} from '../../../assistant'

export default function Wagon(props) {

  const {
    typeCarriage, typeCarriageValue, carriagesMaxLength,
    allWagons, loading, uploadLoading, skip, limit,
    onSubmit, onChange, onDelete, onSkip} = props

    const dispatch = useDispatch()
    useEffect(()=>{
      dispatch(ChangeAdminMenu('wagon'))
    }, [dispatch])

  return <div className="wagon">
            <div className="wagon_push">
              <h1>Baгон</h1>
              <form onSubmit={onSubmit}>
                  <Input 
                      placeholder='спс'
                      type='text'
                      name='typeCarriageValue'
                      onChange={onChange}
                      value={typeCarriageValue}
                      error={typeCarriage}/>
                  <Button type='submit'>
                      Добавлять
                  </Button>
              </form>
            </div> 
            <div className="wagon-element">
              {loading ? <Spiner /> : <><div className="wagon_all">
                {allWagons.map(item=><Element
                    key={item._id}
                    onDelete={onDelete}
                    id={item._id}
                    textArray={[item.typeCarriage]} />)}
              </div>
              {uploadLoading ? <Spiner/> : null}
              </>}
            </div>
            <Pagination 
                skip={skip}
                limit = {limit}
                total={carriagesMaxLength} 
                onSkip = {onSkip}/>  
        </div>;
}
