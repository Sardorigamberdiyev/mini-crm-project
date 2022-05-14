import React, { useState } from 'react';
import Select from 'react-select'
import {FiChevronRight} from 'react-icons/fi'
import './home.css';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const Home = (props) => { 

    const { 
        farm,
        extradition, startStation, endStation, sender, recipient,
        number_wagons, valume, sum, usb, 
        onInputMoney,
        handleState, onInputChange, onSubmit } = props

    const [farmBol, setFarm] = useState(true)
    const [type, setType] = useState(true)
    const [code1, setCode1] = useState(true)
    const [code2, setCode2] = useState(true)
    const [code3, setCode3] = useState(true)
    const [code4, setCode4] = useState(true)

    const changeFarm = () =>{
        if(farmBol){
            handleState('farm', 1)
        }else{
            handleState('farm', 2)
        }
        setFarm(!farmBol)
    }

    return (
        <div className="home">
            <div className='form-container'>
                <form onSubmit={onSubmit}>
                    <div className='form-header'>
                        <h1>{farm} фирма</h1>
                        <button 
                            type='button'
                            onClick = {changeFarm}  >
                            <FiChevronRight/>
                        </button>
                    </div>
                    <div className='form-main'>
                        <div className='form-group'>
                            <label>Дата выдачи</label>
                            <input type='text'
                                   value={extradition}
                                   name='extradition'
                                   onChange={onInputChange} />
                        </div>
                        <div className='form-group'>
                            <label>Станция отправления</label>
                            <input  type='text'
                                    value={startStation}
                                    name='startStation'
                                    onChange={onInputChange} />
                        </div>
                        <div className='form-group'>
                            <label>Станция прибытия</label>
                            <input  type='text'
                                    value={endStation}
                                    name='endStation'
                                    onChange={onInputChange} />
                        </div>
                        <div className='form-group'>
                            <label>Плательщик</label>
                            <Select 
                                name='payer'
                                className='select'
                                options={options} />
                        </div>
                        <div className='form-group'>
                            <label>Отправитель</label>
                            <input  type='text'
                                    value={sender}
                                    name='sender'
                                    onChange={onInputChange} />
                        </div>
                        <div className='form-group'>
                            <label>Получатель</label>
                            <input  type='text'
                                    value={recipient}
                                    name='recipient'
                                    onChange={onInputChange} />
                        </div>
                        <div className='form-group'>
                            <label>Тип груза</label>
                            <div className='type'>
                                <div className={`type-left ${type ? 'active' : ''}`}
                                    onClick={()=>setType(true)}>мпс</div>
                                <div className={`type-right ${type ? '' : 'active'}`}
                                    onClick={()=>setType(false)}>спс</div>
                                <Select 
                                    name='type_cargo'
                                    isDisabled={type}
                                    className='select'
                                    options={options}/>
                            </div>
                        </div>
                        <div className='form-group pallitra'>
                            <div>
                                <label>количество вагонов</label>
                                <input type='text'
                                      name='number_wagons'
                                      value={number_wagons}
                                      onChange={onInputChange}/>
                            </div>
                            <div>
                                <label>Обём</label>
                                <input type='text'
                                       name='valume'
                                       value={valume}
                                       onChange={onInputChange}  />
                            </div>
                        </div>
                    </div>
                    <div className='form-calculator'>
                        <div className='calculator'>
                            <div className='transportation'>
                                <div className={`country ${code1 ? '' : 'active'}`}
                                     onClick={()=>setCode1(!code1)} >Ира</div>
                                <input type='text'
                                       disabled={code1} 
                                       className='money'
                                       placeholder='10,2 USB' />
                                <input type='text' 
                                        disabled={code1} 
                                        className='id'
                                        placeholder='123456789' />
                                <input type='text' 
                                        disabled={code1} 
                                        className='count'
                                        placeholder='789'/> 
                            </div>
                            <div className='transportation'>
                                <div className={`country ${code2 ? '' : 'active'}`}
                                     onClick={()=>setCode2(!code2)}>Трк</div>
                                <input type='text'
                                       disabled={code2} 
                                       className='money'
                                       placeholder='10,2 USB' />
                                <input type='text' 
                                        disabled={code2} 
                                        className='id'
                                        placeholder='123456789' />
                                <input type='text' 
                                        disabled={code2} 
                                        className='count'
                                        placeholder='789'/> 
                            </div>
                            <div className='transportation'>
                                <div className={`country ${code3 ? '' : 'active'}`}
                                     onClick={()=>setCode3(!code3)}>Узб</div>
                                <input type='text'
                                       disabled={code3} 
                                       className='money'
                                       placeholder='10,2 USB' />
                                <input type='text' 
                                        disabled={code3} 
                                        className='id'
                                        placeholder='123456789' />
                                <input type='text' 
                                        disabled={code3} 
                                        className='count'
                                        placeholder='789'/> 
                            </div>
                            <div className='transportation'>
                                <div className={`country ${code4 ? '' : 'active'}`}
                                     onClick={()=>setCode4(!code4)}>Кзх</div>
                                 <input type='text'
                                       disabled={code4} 
                                       className='money'
                                       placeholder='10,2 USB' />
                                <input type='text' 
                                        disabled={code4} 
                                        className='id'
                                        placeholder='123456789' />
                                <input type='text' 
                                        disabled={code4} 
                                        className='count'
                                        placeholder='789'/> 
                            </div>
                        </div>
                        <div className='main'>
                            <p>Общий стоимость</p>
                            <h1>32,6 USD</h1>
                        </div>
                    </div>
                    <div className='form-add'>
                        <div className='form-group'>
                            <label>Дополнительный. сбор</label>
                            <input type='text'/>
                        </div>
                        <div className='form-group'>
                            <label>Цена за тонну</label>
                            <input type='text'/>
                        </div>
                        <div className='form-group'>
                            <label>ТЛГ сумма</label>
                            <input type='number'
                                   className='sum'
                                   name='sum'
                                   value={sum}
                                   onChange={onInputMoney}
                                   placeholder='SUM'/>
                            <input type='number' 
                                   placeholder='USB'
                                   name='usb'
                                   value={usb}
                                   onChange={onInputMoney}
                                   className='usb'/>
                        </div>
                    </div>
                    <div className='form-button'>
                        <button type='submit'>Получит заявку</button>
                        <button type='submit'>Сохранить</button>
                    </div>
                </form>
                
            </div>

            <div className='bg-dark' />
            {/* <button 
            type="button"
            onClick={onRefreshToken}>Рефрещить токен</button>
            <button 
            type="button"
            onClick={onLogout}>Выйти</button> */}
        </div>
    )
}

export default Home;