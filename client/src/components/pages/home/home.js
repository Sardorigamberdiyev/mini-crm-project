import React from 'react';
import Select from 'react-select'
import {FiChevronRight} from 'react-icons/fi'
import './home.css';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const Home = (props) => {

    const {onLogout, onRefreshToken} = props

   

    return (
        <div className="home">
            <div className='form-container'>
                <form>
                    <div className='form-header'>
                        <h1>1 фирма</h1>
                        <button type='button'>
                            <FiChevronRight/>
                        </button>
                    </div>
                    <div className='form-main'>
                        <div className='form-group'>
                            <label>Дата выдачи</label>
                            <input  type='text' />
                        </div>
                        <div className='form-group'>
                            <label>Дата выдачи</label>
                            <input  type='text' />
                        </div>
                        <div className='form-group'>
                            <label>Дата выдачи</label>
                            <input  type='text' />
                        </div>
                        <div className='form-group'>
                            <label>Плательщик</label>
                            <Select options={options} />
                        </div>
                        <div className='form-group'>
                            <label>Дата выдачи</label>
                            <input  type='text' />
                        </div>
                        <div className='form-group'>
                            <label>Дата выдачи</label>
                            <input  type='text' />
                        </div>
                        <div className='form-group'>
                            <label>Тип груза</label>
                            <div className='type'>
                                <div className='type-left'>мпс</div>
                                <div className='type-right'>спс</div>
                                <Select 
                                    className='select'
                                    options={options}/>
                            </div>
                        </div>
                        <div className='form-group pallitra'>
                            <div>
                                <label>количество вагонов</label>
                                <input type='text'/>
                            </div>
                            <div>
                                <label>Обём</label>
                                <input type='text'/>
                            </div>
                        </div>
                    </div>
                    <div className='form-calculator'>
                        <div className='calculator'>
                            <div className='transportation'>
                                <div className='country'>Ира</div>
                                <input type='text' className='money' />
                                <input type='text' className='id' />
                                <input type='text' className='count'/> 
                            </div>
                            <div className='transportation'>
                                <div className='country'>Ира</div>
                                <input type='text' className='money' />
                                <input type='text' className='id' />
                                <input type='text' className='count'/> 
                            </div>
                            <div className='transportation'>
                                <div className='country'>Ира</div>
                                <input type='text' className='money' />
                                <input type='text' className='id' />
                                <input type='text' className='count'/> 
                            </div>
                            <div className='transportation'>
                                <div className='country'>Ира</div>
                                <input type='text' className='money' />
                                <input type='text' className='id' />
                                <input type='text' className='count'/> 
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
                            <input type='text' className='sum'/>
                            <input type='text' className='usb'/>
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