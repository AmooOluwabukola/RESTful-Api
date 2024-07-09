const mongoose =require ('mongoose');
const validator = require("validator");
const jwt= require ("jsonwebtoken");
const bcrypt = require('bcryptjs');
const crypto =require ("crypto")


const userSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    email:{type:String, required:true, unique:[true, "Email already in use"],  lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Email is invalid");
          }
        }, 
       },
    password:{type:String, required:true},
   
    
})

// comparepassword
userSchema.methods.comparePassword = async function (userPassword){
  const isCorrect = await bcrypt.compare(userPassword, this.password);
  return isCorrect;
}

// generate token
userSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign({ userId: this._id, email:this.email }, process.env.JWT_SECRET);
    console.log(this);
    return token;
  } catch (error) {
    console.log(error);
    return null
  }
 
};


// resetPassword
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 2000);
  return resetToken;
};

module.exports=mongoose.model('User', userSchema)