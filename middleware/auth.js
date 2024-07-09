// const userModel = require('../models/userModel')
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const app =express();

// function isAdmin (req,res ,next){
//     if (req.path === '/admin-signup' && req.method ==='POST') {
//         return next(); 
//       }
//     const token = req.header('x-auth-token');

//     if (!token) {
//         return res.status(401).json({ msg: 'No token, authorization denied' });
//       }
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
      
       
       
//         if (req.user.role !== 'admin') {
//           return res.status(403).json({ msg: 'Not authorized as an admin' });
//         }
//         next();
//       } catch (e) {
//         res.status(400).json({ msg: 'Token is not valid' });
//       }



// }





// module.exports={
//     isAdmin
// }