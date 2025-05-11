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
    available: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        required: true,
    },
    size: {
        type: [String], 
        required: true,
    },
    reviews: [
        {
            rating: { type: Number, required: true, min: 0, max: 5 }, 
            text: { type: String, required: true },
        },
    ],
});


//Api to add product
app.post('/addproduct',async (req,res) =>{
    let products = await Product.find({});
    let id;
    if (products.length>0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id=last_product.id+1;
    }
    else
    {
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
        description:req.body.description,
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

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
    res.send("Removed")
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

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