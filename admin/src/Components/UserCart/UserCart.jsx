import React, { useEffect, useState } from 'react';
import './UserCart.css';
import cart_icon from '../../assets/cart.jpg';
import cross_icon from '../../assets/cross_icon.png';
import { Link } from 'react-router-dom';

const UserCart = () => {
  
  const [users, setUsers] = useState([]);

  const fetchCarts = async () => {
    await fetch('http://localhost:4000/getallcarts')
      .then((res) => res.json())
      .then((data) => { setUsers(data) });
  };

   useEffect(()=>{
    fetchCarts();
    },[])

    const remove_user = async (email)=>{
      await fetch('http://localhost:4000/removeuser',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json',
        },
        body:JSON.stringify({email:email})
      })
      await fetchCarts();
    }

  return (
    <div className='user-cart'>
      <h1>Users & Their Carts</h1>
      <div className="cart-format-main">
        <p>Username</p>
        <p>Email</p>
        <p>Cart</p>
        <p>Remove</p>
      </div>
      <div className="cart-allusers">
        <hr />
        {users.map((user, index) => (
          <div key={index} className="cart-user-info">
            <p>{user.name}</p>
            <p>{user.email}</p>
            <Link to={'/usercartitems'} state={{ cart: user.cartData }}><img src={cart_icon} alt="cart" className="cart-icon" /></Link>
            <img onClick={()=>{remove_user(user.email)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCart;
