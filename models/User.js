const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    reg_no: {
        type: String,
        requires: [true,'Please enter your registration number'],
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        requires: true
    },
    email: {
        type: String,
        requires: [true,'Please enter an email'],
        unique: true,
        lowercase: true,
        validate:[isEmail,'Please Enter a Valid Email']
    },
    password: {
        type: String,
        required: [true,'Please enter a password'],
        minLength: [6,'Password must be atleast 6 digits']
    },
    password2: {
        type: String,
        required: [true,'Please enter previous password again'],
        minLength: [6,'Password must be atleast 6 digits']
    }
});

userSchema.pre('save' , async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    this.password2 = await bcrypt.hash(this.password2,salt);
    next();
});


userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };

const User = mongoose.model('user',userSchema);

module.exports = User;