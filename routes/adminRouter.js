const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleWare = require('../middleware/auth')


// superAdmin-SignUp
router.post(
    '/admin-signup', async (req,res)=>{
      const {email,password}=req.body;
      const user= new User ({email,password,role :'admin'});
      await user.save();
      // token
      const token = jwt.sign({userId:user._id,role:'admin'},process.env.JWT_SECRET);
      res.json({token,user})
    }
  )


  module.exports = router;