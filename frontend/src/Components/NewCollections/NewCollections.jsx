import React, { useEffect, useState } from 'react'
import "./NewCollections.css"
import Item from '../Item/Item'

const NewCollections = () => {

  const [new_collections,setNew_collection] = useState([]);
  
  useEffect(()=>{
    fetch('http://localhost:4000/newcollections')
    .then((response)=>response.json())
    .then((data)=>setNew_collection(data));
  },[])

  return (
    <div id="new-collections-section" className='newcollections'>
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <div className="collections">
            {new_collections.map((item,i)=>{
                return <Item  key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} stock={item.stock} available={item.available} />
            })}
        </div>
    </div>
  )
}

export default NewCollections