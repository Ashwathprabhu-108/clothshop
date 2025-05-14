import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
import add_product_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'
import User_icon from '../../assets/user.png'
import Purchase_icon from '../../assets/Purchase_icon.png'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to={'/addproduct'} style={{textDecoration:"none"}}>
          <div className="sidebar-item">
            <img src={add_product_icon} alt="" />
            <p>Add Product</p>
          </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration:"none"}}>
          <div className="sidebar-item">
            <img src={list_product_icon} alt="" />
            <p>Product List</p>
          </div>
        </Link>
        <Link to={'/usercart'} style={{textDecoration:"none"}}>
          <div className="sidebar-item">
            <img src={User_icon} alt="" />
            <p>Users List</p>
          </div>
        </Link>
        <Link to={'/purchase'} style={{textDecoration:"none"}}>
          <div className="sidebar-item">
            <img src={Purchase_icon} alt="" />
            <p>Purchase</p>
          </div>
        </Link>
    </div>
  )
}

export default Sidebar