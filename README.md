# StyleShop

StyleShop is a full-stack e-commerce platform for clothing and fashion products, featuring separate portals for users, admins, and delivery personnel.

## Features

- **User Portal:**  
  - Browse/search products  
  - Add to cart and purchase  
  - Manage addresses  
  - View purchase history and order status  
  - Product reviews and ratings

- **Admin Portal:**  
  - Manage products (add, edit, delete)  
  - View all purchases and users  
  - Manage delivery personnel

- **Delivery Portal:**  
  - Delivery personnel login/signup  
  - View assigned deliveries by location  
  - Update delivery status

## Tech Stack

- **Frontend:**  
  - User: React.js (Create React App)  
  - Admin: React.js (Vite)  
  - Delivery: React.js (Vite)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT

## Folder Structure

```
styleshop/
  admin/      # Admin dashboard (React + Vite)
  backend/    # Node.js + Express API server
  delivery/   # Delivery personnel portal (React + Vite)
  frontend/   # User-facing shop (React)
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB server

## Installation & Running

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd styleshop
   ```

2. **Install dependencies for each part:**
   - Backend:
     ```sh
     cd backend
     npm install
     ```
   - Frontend (User):
     ```sh
     cd ../frontend
     npm install
     ```
   - Admin:
     ```sh
     cd ../admin
     npm install
     ```
   - Delivery:
     ```sh
     cd ../delivery
     npm install
     ```

3. **Set up environment variables:**  
   - In `backend/`, create a `.env` file:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=4000
     ```

4. **Run the backend server:**
   ```sh
   cd backend
   node index.js
   ```

5. **Run the frontends (each in a separate terminal):**
   - User portal:
     ```sh
     cd frontend
     npm start
     ```
   - Admin portal:
     ```sh
     cd admin
     npm run dev
     ```
   - Delivery portal:
     ```sh
     cd delivery
     npm run dev
     ```

6. **Access the apps:**
   - User portal: [http://localhost:3000](http://localhost:3000)
   - Admin portal: [http://localhost:5173](http://localhost:5173)
   - Delivery portal: [http://localhost:5174](http://localhost:5174) (if port is same as admin, change one in `vite.config.js`)

## Notes

- Make sure MongoDB is running and accessible from your backend.
- Default backend port is `4000`. Change in `.env` if needed.
- For production, build the frontends using `npm run build` (user) or `npm run build` (admin/delivery with Vite).

## License

This project is for educational purposes.