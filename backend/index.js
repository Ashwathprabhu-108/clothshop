const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require ("path")
const cors = require("cors");
const { log, error } = require("console");

app.use(express.json());
app.use(cors());
//Database Connection With MongoDB
mongoose.connect("mongodb+srv://u05cs22s0006:u05cs22s0006@cluster0.7vczl.mongodb.net/styleshop");

//API creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

//Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating Upload Endpoint for images

app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        img_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for Creating reviews
const Review = mongoose.model("Review", {
  productId: { type: Number, required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  replies: [
    {
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

//Schema for Creating Products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    available: { 
        type: Boolean ,
        required: true,
    },
});

//schema for Purchase 
const Purchase = mongoose.model("Purchase", {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  products: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      category: { type: String, required: true },
      new_price: { type: Number, required: true },
      old_price: { type: Number, required: true },
      description: { type: String, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    type: new mongoose.Schema({
      fullAddress: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    }),
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isCancelled: {
    type: Boolean,
    default: false,
  },
   delivered: {
    type: Boolean,
    default: false, 
  },
});

//Api to add product
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        description: req.body.description,
        size: req.body.size,
        stock: req.body.stock,
        available: req.body.stock > 0,
    });

    await product.save();
    res.json({
        success: true,
        name: req.body.name,
    });
});

// Endpoint to edit a product
app.put('/editproduct/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image, category, new_price, old_price, description, stock } = req.body;

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: parseInt(id) }, // if using custom id
            {
                $set: {
                    name,
                    image,
                    category,
                    new_price,
                    old_price,
                    description,
                    stock,
                    available: stock > 0,
                },
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//Creating API For deleting Products
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Express route example (server-side)
app.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Assuming MongoDB and Mongoose
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product" });
    }
});

// Endpoint to update the delivered status of a purchase
app.put('/update-delivered/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { delivered } = req.body;

        if (typeof delivered !== 'boolean') {
            return res.status(400).json({ success: false, message: "Invalid value for delivered. It must be a boolean." });
        }

        const purchase = await Purchase.findById(id);

        if (!purchase) {
            return res.status(404).json({ success: false, message: "Purchase not found" });
        }

        // Only update stock if marking as delivered and not already delivered
        if (delivered && !purchase.delivered) {
            for (const product of purchase.products) {
                // Ensure product.id is a number for the query
                const prodDoc = await Product.findOne({ id: Number(product.id) });
                if (prodDoc) {
                    const updatedStock = Math.max((prodDoc.stock ?? 0) - product.quantity, 0);
                    prodDoc.stock = updatedStock;
                    prodDoc.available = updatedStock > 0;
                    await prodDoc.save();
                } else {
                    console.warn(`Product not found for id: ${product.id}`);
                }
            }
        }

        purchase.delivered = delivered;
        await purchase.save();

        res.status(200).json({ success: true, message: "Delivered status updated successfully", purchase });
    } catch (error) {
        console.error("Error updating delivered status:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//creating schema for delivery login and register
const Delivery = mongoose.model('Delivery', {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: new mongoose.Schema({
            city: { type: String, required: true },
            district: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        }),
        required: true,
    },
});

// Get all delivery users
app.get('/getalldelivery', async (req, res) => {
    try {
        const deliveryUsers = await Delivery.find({});
        res.status(200).json({ success: true, deliveryUsers });
    } catch (error) {
        console.error("Error fetching delivery users:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Remove a delivery user by email
app.post('/removedelivery', async (req, res) => {
    try {
        const { email } = req.body;
        const removed = await Delivery.findOneAndDelete({ email });
        if (!removed) {
            return res.status(404).json({ success: false, message: "Delivery user not found" });
        }
        res.json({ success: true, message: "Delivery user removed", email });
    } catch (error) {
        console.error("Error removing delivery user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Schema Creating for User model
const Users = mongoose.model('Users', {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Object,
        default: {},
    },
    address: {
        type: new mongoose.Schema({
            fullAddress: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            district: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            phoneNumber: { type: String, required: true },
        }),
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

//creating endpoint for admin user details
app.get('/getallusers',async (req,res)=>{
    let usersdetail = await Users.find({});
    console.log("All Users Fetched");
    res.send(usersdetail);
})


// Endpoint to get reviews by product ID
app.get('/reviews/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const reviews = await Review.find({ productId: parseInt(productId) }).sort({ createdAt: -1 });
        res.status(200).json(reviews); 
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Creating endpoint for deleting reviews
app.delete('/deletereview/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.username !== username) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    await review.deleteOne(); 

    const updatedReviews = await Review.find({ productId: review.productId });
    res.status(200).json({ reviews: updatedReviews });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
});  

//adding endpoint for adding reviews
app.post('/addreview', async (req, res) => {
    const { productId, username, text, rating } = req.body;
    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }
    if (!text || text.trim() === "") {
        return res.status(400).json({ message: "Review text is required" });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating value" });
    }

    try {
        const newReview = new Review({
            productId: Number(productId),
            username,
            text,
            rating,
        });
        await newReview.save();

        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Edit a review
app.put('/review/:id', async (req, res) => {
    const { username, text, rating } = req.body;

    if (!username || !text || typeof rating !== "number") {
        return res.status(400).json({ message: "Incomplete data for update" });
    }

    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.username !== username) {
            return res.status(403).json({ message: "Unauthorized to edit this review" });
        }

        review.text = text;
        review.rating = rating;
        review.updatedAt = new Date();

        await review.save();
        res.status(200).json({ message: "Review updated", review });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//adding endpoint for adding replies
app.post('/addreply/:id', async (req, res) => {
  const { id } = req.params;
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({ message: "Username and text are required" });
  }

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.replies.push({ username, text });
    await review.save();

    res.status(200).json({ message: "Reply added successfully", review });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//creating endpoint for getting all reviews to get average rating
app.get('/productrating/:productId', async (req, res) => {
    const productId = Number(req.params.productId);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        // Fetch all reviews for the given product ID
        const reviews = await Review.find({ productId });

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }

        // Filter only valid ratings (between 1 and 5)
        const validReviews = reviews.filter(review => review.rating >= 1 && review.rating <= 5);

        if (validReviews.length === 0) {
            return res.status(400).json({ message: "No valid ratings found (1-5 range)" });
        }

        // Calculate the total rating and average rating
        const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / validReviews.length) * 100) / 100;

        res.status(200).json({
            productId,
            totalRating,
            totalReviews: validReviews.length,
            averageRating,
        });
    } catch (error) {
        console.error("Error fetching product rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Creating API For deleting users
app.post('/removeuser',async (req,res)=>{
    await Users.findOneAndDelete({email:req.body.email});
    console.log("User Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating Endpoint for registering the user
app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
        address: {
            fullAddress: req.body.address.fullAddress,
            street: req.body.address.street,
            city: req.body.address.city,
            district: req.body.address.district,
            state: req.body.address.state,
            pincode: req.body.address.pincode,
            phoneNumber: req.body.address.phoneNumber,
        }
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

})

//creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

//creating endpoint for newcollection data
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection)
}) 

//creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({});
    let Popullar= products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(Popullar);
})

//creating middelware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({errors:"Please authonticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"please authenticate using a valid token"})
        }
    }
}

//creating endpoint for purchase and save in purchase collection
app.post("/purchase", fetchUser, async (req, res) => {
    try {
        console.log("Request Body:", req.body); 

        const { items, totalAmount, address } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).send({ success: false, message: "No products provided" });
        }

        if (!address) {
            return res.status(400).send({ success: false, message: "Address is required" });
        }

        const newPurchase = new Purchase({
            user: req.user.id,
            products: items,
            totalAmount,
            address,
        });

        await newPurchase.save();
        res.send({ success: true, message: "Purchase successful" });
    } catch (err) {
        console.error("Purchase error:", err);
        res.status(500).send({ success: false, message: "Purchase failed" });
    }
});

// Endpoint to fetch all purchase details
app.get('/purchase-details', async (req, res) => {
    try {
        const purchases = await Purchase.find({})
            .populate('user', 'name email') 
            .populate('products') 
            .populate('address') 
            .select('-__v');

        if (!purchases || purchases.length === 0) {
            return res.status(404).json({ success: false, message: "No purchases found" });
        }

        res.status(200).json({ success: true, purchases });
    } catch (error) {
        console.error("Error fetching all purchase details:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint to cancel a purchase
app.put("/cancelpurchase/:id", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const purchaseId = req.params.id;

    const purchase = await Purchase.findOne({ _id: purchaseId, user: userId });

    if (!purchase) {
      return res.status(404).send({
        success: false,
        message: "Purchase not found",
      });
    }

    const timeDiff = Date.now() - new Date(purchase.date).getTime();
    const fiveDays = 5 * 24 * 60 * 60 * 1000; 

    if (timeDiff > fiveDays) {
      return res.status(403).send({
        success: false,
        message: "Cancellation period expired",
      });
    }

    if (purchase.isCancelled) {
      return res.status(400).send({
        success: false,
        message: "Purchase already cancelled",
      });
    }

    purchase.isCancelled = true;
    await purchase.save();

    return res.status(200).send({
      success: true,
      message: "Purchase cancelled successfully",
      purchase,
    });
  } catch (err) {
    console.error("Cancel error:", err);
    return res.status(500).send({
      success: false,
      message: "Error cancelling purchase",
    });
  }
});

app.put("/undocancelpurchase/:id", fetchUser, async (req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.id);

        if (!purchase) {
            return res.status(404).json({ success: false, message: "Purchase not found" });
        }

        if (!purchase.isCancelled) {
            return res.status(400).json({ success: false, message: "Purchase is not cancelled" });
        }

        purchase.isCancelled = false;
        await purchase.save();

        res.status(200).json({ success: true, message: "Cancellation undone successfully", purchase });
    } catch (error) {
        console.error("Error undoing cancellation:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Middleware to authenticate user to fetch user purchase (already present as fetchUser)
app.get('/my-purchases', fetchUser, async (req, res) => {
    try {
        const purchases = await Purchase.find({ user: req.user.id })
            .populate('user', 'name email')
            .populate('products')
            .select('-__v');
        res.status(200).json({ success: true, purchases });
    } catch (error) {
        console.error("Error fetching user's purchases:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Endpoint to fetch all users' address details for the admin page
app.get('/getaddress', fetchUser, async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.user.id }, { address: 1 });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, address: user.address });
    } catch (error) {
        console.error("Error fetching address:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// API update address
app.put('/updateaddress', fetchUser, async (req, res) => {
    try {
        const { fullAddress, street, city, district, state, pincode, phoneNumber } = req.body;

        const updatedUser = await Users.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    "address.fullAddress": fullAddress,
                    "address.street": street,
                    "address.city": city,
                    "address.district": district,
                    "address.state": state,
                    "address.pincode": pincode,
                    "address.phoneNumber": phoneNumber,
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

//creating endpoint save cart products in cartdata
app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})

//creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("Removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ message: "Removed" })
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.get("/getuser", async (req, res) => {
    const authToken = req.headers["auth-token"];
    const secretKey = "secret_ecom"; // Ensure the secret key is defined

    if (!authToken) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(authToken, secretKey);

        // Fetch the user from the database
        const user = await Users.findById(decoded.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, ...userDetails } = user.toObject();
        res.status(200).json(userDetails);
    } catch (err) {
        console.error("Error in /getuser:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//creating endpoint to get user cartdata in admin page.
app.get('/getallcartdetails', async (req, res) => {
    try {
        let users = await Users.find({}, { email: 1, cartData: 1, _id: 0 });

        let cartDetails = [];

        for (let user of users) {
            let userCart = [];
            for (let productId in user.cartData) {
                if (user.cartData[productId] > 0) { 
                    let product = await Product.findOne({ id: productId }, { name: 1, image: 1, new_price: 1 });

                    if (product) {
                        userCart.push({
                            productId: productId,
                            name: product.name,
                            image: product.image,
                            new_price: product.new_price,
                            quantity: user.cartData[productId],
                        });
                    }
                }
            }
            cartDetails.push({
                email: user.email,
                cart: userCart,
            });
        }

        console.log("All users' cart details fetched");
        res.json(cartDetails);
    } catch (error) {
        console.error("Error fetching cart details:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

//creating endpoint for delivery signup
app.post('/deliverysignup', async (req, res) => {
    try {
        const { name, email, password, location } = req.body;

        const existingDelivery = await Delivery.findOne({ email });
        if (existingDelivery) {
            return res.status(400).json({ success: false, message: "Delivery user with this email already exists" });
        }

        const deliveryUser = new Delivery({
            name,
            email,
            password,
            location: {
                city: location.city,
                district: location.district,
                state: location.state,
                pincode: location.pincode,
            },
        });

        await deliveryUser.save();

        const data = {
            deliveryUser: {
                id: deliveryUser.id,
            },
        };
        const token = jwt.sign(data, 'secret_ecom');

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error("Error in delivery signup:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//creating endpoint for delivery login
app.post('/deliverylogin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const deliveryUser = await Delivery.findOne({ email });
        if (!deliveryUser) {
            return res.status(404).json({ success: false, message: "Delivery user not found" });
        }

        if (deliveryUser.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const data = {
            deliveryUser: {
                id: deliveryUser.id,
            },
        };
        const token = jwt.sign(data, 'secret_ecom');

        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Error in delivery login:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

//creating endpoint for getting all purchse matching to delivery
app.get('/fetch-matching-purchases/:deliveryId', async (req, res) => {
    try {
        const { deliveryId } = req.params;

        // Find the delivery user by ID
        const deliveryUser = await Delivery.findById(deliveryId);
        if (!deliveryUser) {
            return res.status(404).json({ success: false, message: "Delivery user not found" });
        }

        const { city, district, state, pincode } = deliveryUser.location;

        // Find purchases that match the delivery user's location and populate all relevant details
        const matchingPurchases = await Purchase.find({
            "address.city": city,
            "address.district": district,
            "address.state": state,
            "address.pincode": pincode,
        })
        .populate('user', 'name email') // Populate user details (name and email)
        .populate({
            path: 'products',
            select: 'id name image category new_price old_price description quantity', // Select product fields
        })
        .select('-__v'); // Exclude unnecessary fields like `__v`

        if (matchingPurchases.length === 0) {
            return res.status(404).json({ success: false, message: "No matching purchases found" });
        }

        res.status(200).json({ success: true, purchases: matchingPurchases });
    } catch (error) {
        console.error("Error fetching matching purchases:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Schema Creating for User model
app.listen(port,(error)=>{
    if (!error) {
        console.log("Server Running on Port "+port)
    }
    else
    {
        console.log("Error:"+error)
    }
})