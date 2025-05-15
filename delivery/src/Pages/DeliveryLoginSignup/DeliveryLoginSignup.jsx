import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./DeliveryLoginSignup.css";

const DeliveryLoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: {
      city: "",
      district: "",
      state: "",
      pincode: "",
    },
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [locationField]: value },
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
    await fetch(`http://localhost:4000/${state === "Login" ? "deliverylogin" : "deliverysignup"}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);

      // Extract deliveryId from the token and navigate to DeliveryPurchases
      const tokenPayload = JSON.parse(atob(responseData.token.split('.')[1]));
      const deliveryId = tokenPayload.deliveryUser.id;
      navigate(`/delivery-purchases/${deliveryId}`);
    } else {
      alert(responseData.message || "An error occurred.");
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={changeHandler}
                placeholder="Your Name"
              />
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={changeHandler}
                placeholder="City"
              />
              <input
                type="text"
                name="location.district"
                value={formData.location.district}
                onChange={changeHandler}
                placeholder="District"
              />
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={changeHandler}
                placeholder="State"
              />
              <input
                type="text"
                name="location.pincode"
                value={formData.location.pincode}
                onChange={changeHandler}
                placeholder="Pincode"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Email Address"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder="Password"
          />
        </div>
        <button onClick={handleSubmit}>Continue</button>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLoginSignup;