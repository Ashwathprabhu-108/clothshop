import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes,Route } from 'react-router-dom'
import Addproduct from '../../Components/Addproduct/Addproduct'
import Listproduct from '../../Components/Listproduct/Listproduct'
import UserCart from '../../Components/UserCart/UserCart'
import UserCartItems from '../../Components/UserCart/UserCartItems/UserCartItems'
import PurchaseDetails from '../../Components/PurchaseDetails/PurchaseDetails'
import EditProduct from '../../Components/Listproduct/EditProduct/EditProduct'
import Couriers from '../../Components/Couriers/Couriers'

const Admin = () => {
  return (
    <div className='admin'>
        <Sidebar/>
        <Routes>'
          <Route path='/addproduct' element={<Addproduct/>}/>
          <Route path='/listproduct' element={<Listproduct/>}/>
          <Route path="/edit/:id" element={<EditProduct />} />
          <Route path='/usercart' element={<UserCart/>}/>
          <Route path="/usercartitems" element={<UserCartItems/>} />
          <Route path='/purchase' element={<PurchaseDetails/>}/>
          <Route path='/courier' element={<Couriers/>}/>
        </Routes>
    </div>
  )
}

export default Admin