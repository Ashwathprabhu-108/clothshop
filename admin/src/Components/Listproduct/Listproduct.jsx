import React, { useEffect, useState } from 'react';
import './Listproduct.css';
import { Link } from 'react-router-dom';
import cross_icon from '../../assets/cross_icon.png';
import edit_icon from '../../assets/edit.png';

const Listproduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => {
        console.log("All products in Listproduct:", data);
        setAllProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    });
    await fetchInfo();
  };

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Stock</p>
        <p>Price</p>
        <p>Category</p>
        <p>Remove</p>
        <p>Edit</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <div key={index} className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>{product.stock}</p>
              <p>₹{product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={() => { remove_product(product.id) }} className='listproduct-remove-icon' src={cross_icon} alt="" />
              <Link to={`/edit/${product.id}`}>
                <img src={edit_icon} alt="edit" className="edit-icon" />
              </Link>
            </div>
          );
        })}
        <hr />
      </div>
    </div>
  );
};

export default Listproduct;