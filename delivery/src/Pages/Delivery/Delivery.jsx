import React from 'react'
import './Delivery.css'
import DeliveryLoginSignup from '../DeliveryLoginSignup/DeliveryLoginSignup'
import { Routes,Route } from 'react-router-dom'
import DeliveryPurchases from '../../Components/DeliverPurchases/DeliveryPurchases'

const Delivery = () => {
  return (
    <div className='Delivery'>
      <Routes>
        <Route path="/" element={<DeliveryLoginSignup />} />
        <Route path="/delivery-purchases/:deliveryId" element={<DeliveryPurchases />} />
      </Routes>
    </div>
  )
}

export default Delivery