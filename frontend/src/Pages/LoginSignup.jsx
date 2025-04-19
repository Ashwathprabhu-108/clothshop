import React, { useState } from 'react';
import "./CSS/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: {
      fullAddress: "",
      street: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      phoneNumber: ""
    }
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_])[A-Za-z\d_]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(formData.password)) {
      alert("Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.");
      return;
    }

    let responseData;
    await fetch(`http://localhost:4000/${state === "Login" ? "login" : "signup"}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then((response) => response.json())
    .then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <>
              <input type="text" name="username" value={formData.username} onChange={changeHandler} placeholder="Your Name" />
              <input type="text" name="address.fullAddress" value={formData.address.fullAddress} onChange={changeHandler} placeholder="Full Address" />
              <input type="text" name="address.street" value={formData.address.street} onChange={changeHandler} placeholder="Post" />
              <input type="text" name="address.city" value={formData.address.city} onChange={changeHandler} placeholder="City" />
              <input type="text" name="address.district" value={formData.address.district} onChange={changeHandler} placeholder="District" />
              <input type="text" name="address.state" value={formData.address.state} onChange={changeHandler} placeholder="State" />
              <input type="text" name="address.pincode" value={formData.address.pincode} onChange={changeHandler} placeholder="Pincode" />
              <input type="text" name="address.phoneNumber" value={formData.address.phoneNumber} onChange={changeHandler} placeholder="Phone Number" />
            </>
          )}
          <input type="email" name="email" value={formData.email} onChange={changeHandler} placeholder="Email Address" />
          <input type="password" name="password" value={formData.password} onChange={changeHandler} placeholder="Password" />
        </div>
        <button onClick={handleSubmit}>Continue</button>
        {state === "Sign Up"
          ? <p className="loginsignup-login">Already have an account? <span onClick={() => setState("Login")}>Login here</span></p>
          : <p className="loginsignup-login">Create an account? <span onClick={() => setState("Sign Up")}>Click here</span></p>}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
