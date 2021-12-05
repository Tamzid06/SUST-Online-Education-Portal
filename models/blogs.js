const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  snippet: {
    type: String,
    required: true,
  },
}, { timestamps: true });


// blogSchema.pre('save' , async function(req,next){
//   const token = req.cookies.jwt;


//   if (token) {
//     jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
//       if (err) {
//         res.locals.user = null;

//       } else {
//         let user = await User.findById(decodedToken.id);
//         this.title = user.reg_no;
//         res.locals.user = user;

//       }
//     });
//   } else {
//     res.locals.user = null;

//   }


//   next();
// });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;