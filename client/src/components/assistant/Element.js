import React from "react"
import {MdDelete} from 'react-icons/md'
import './assistant.css';

export default function Element(props) {
    const { textArray } = props

  return <div className='assistant_element'>
      {textArray.map((item, idx)=><p key={idx}>{item}</p>)}
      <div className="element_delte">
          <MdDelete />
      </div>
  </div>;
}
