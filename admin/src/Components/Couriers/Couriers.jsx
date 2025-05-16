import React, { useEffect, useState } from 'react';
import './Couriers.css';
import courier_icon from '../../assets/courier.png';
import cross_icon from '../../assets/cross_icon.png';

const Couriers = () => {
  const [couriers, setCouriers] = useState([]);

  const fetchCouriers = async () => {
    await fetch('http://localhost:4000/getalldelivery')
      .then((res) => res.json())
      .then((data) => {
        setCouriers(data.deliveryUsers || []);
      });
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const removeCourier = async (email) => {
    await fetch('http://localhost:4000/removedelivery', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    await fetchCouriers();
  };

  return (
    <div className="couriers-list">
      <h1>Couriers</h1>
      <div className="courier-format-main">
        <p>Name</p>
        <p>Email</p>
        <p>Location</p>
        <p>Remove</p>
      </div>
      <div className="courier-all">
        <hr />
        {couriers.map((courier, index) => (
          <div key={index}>
            <div className="courier-info">
              <p>{courier.name}</p>
              <p>{courier.email}</p>
              <p>
                {courier.location
                  ? `${courier.location.city}, ${courier.location.district}, ${courier.location.state} - ${courier.location.pincode}`
                  : 'No location'}
              </p>
              <img
                onClick={() => removeCourier(courier.email)}
                className="courier-remove-icon"
                src={cross_icon}
                alt="remove"
                style={{ cursor: 'pointer', width: '24px', height: '24px' }}
              />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Couriers;