import React, { useContext } from 'react'
import "./CSS/ShopCategory.css"
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'
const ShopCategory = (props) => {
  const {all_product}= useContext(ShopContext);
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing all the products</span> 
        </p>
      </div>
      <div className="shopcategory-products">
        {all_product.map((item, i) => {
        if (props.category === item.category) {
          console.log("Props passed to <Item />:", {
            id: item.id,
            name: item.name,
            image: item.image,
            new_price: item.new_price,
            old_price: item.old_price,
            stock: item.stock,
            available: item.available,
        });
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} stock={item.stock} available={item.available}/>;
         }else{
          return null;
         }
         })}

      </div>
    </div>
  )
}

export default ShopCategory