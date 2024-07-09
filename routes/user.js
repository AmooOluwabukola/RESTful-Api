const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const crypto =require ('crypto')
const sendMail = require('../helper/sendMail')


// signup
router.post("/signup", async (req, res) => {
  const { email, password , role} = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "all fields are required to register" });
    return;
  }
  const existingEmail = await User.findOne({email});
  if(existingEmail){
      res.status(400).json({success:false,message:"Email already in use"});
      return
  };
  try {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: req.body.password,
      role :req.body.role
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.save();
    const token = await user.generateToken()
    res
      .status(201)
      .json({ success: true, message: "registration successfull", user: {
        email: user.email,
          token,} });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(404)
        .json({ success: false, message: "Email address already in use" });
      return;
    }
    console.log(error.message);
    res.status(500).send(error);
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'wrong credentials' });
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
      return res.status(401).json({ error: 'Wrong credentials' });
    }
    const token = await user.generateToken();
    res.json({ 
      success: true,
        message: "logged in",
        user: {
          email: user.email,
          token,
      
     }});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// get all
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// get single user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// update user
router.patch('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });
    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// update user
router.put('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updates = req.body;
    user.email = updates.email;
    user.password = updates.password;
    user.role = updates.role;
    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// delete user
router.delete("/:userId", async (req, res,) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});






module.exports = router;
