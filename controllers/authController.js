const User = require("../models/User");
const Blog = require('../models/blogs');
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {reg_no:"", email: "", password: "", password2: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }


  if (err.code == 11000) {
    console.log("------------*******");
    
    const message = JSON.stringify(err.message);
    console.log(message);
    if (message.includes("reg_no_1")) { 
      console.log("reg mara");
      errors.reg_no = "that Reg no is already registered";
      return errors;
    } else {
      errors.email = "that email is already registered";
      return errors;
    }
    
  }


  // duplicate email error
  // if (err.code === 11000) {
  //   errors.email = "that email or registration no is already registered";
  //   return errors;
  // }
  if (err.message == "Passwords Do not Match") {
    errors.password2 = "Passwords Do not Match";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("index");
};

module.exports.profile_get = (req, res) => {
  res.render('profile_update');
}

module.exports.profile_post = async (req, res) => {
  const { name, email } = req.body;
  console.log("-----------------");
 
  console.log(name);
  console.log(email);
  console.log("-----------------");

  const user3 = User.findOne(req.body._id)
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {

      } else {
        try {
          let user = await User.findById(decodedToken.id);
          const filter = { reg_no: user.reg_no };
          const update = { name: name, email: email };
          // const user = await User.create({ name,email});
          user = await User.findOneAndUpdate(filter, update);
          res.status(200).json({ user: user._id });
      
        }
        catch (err) {
          const errors = handleErrors(err);
          res.status(400).json({ errors });
        }
        
      
      }
    });
  } else {
  
  }



}



module.exports.signup_post = async (req, res) => {
  const { reg_no, name, email, password, password2 } = req.body;

  try {
    const user = await User.create({
      reg_no,
      name,
      email,
      password,
      password2,
    });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  console.log("----------------");
  console.log(req.body);
  console.log("----------------");

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/index");
};



module.exports.comment_create = async (req, res) => {
  res.render('commentCreate', { title: 'Create a new blog' });
}

module.exports.comments_get = async (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('./playlist', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports.comments_post = async (req, res) => {
  console.log(req.body);

  const { title, snippet } = req.body;



  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;

      } else {
        let user = await User.findById(decodedToken.id);
        const person = { title: user.reg_no, name: user.name, snippet: snippet };
        const blog = new Blog(person);
        blog.save()
          .then(result => {
            res.redirect('/playlist');
          })
          .catch(err => {
            console.log(err);
          });

        res.locals.user = user;

      }
    });
  } else {
    res.locals.user = null;

  }



}

module.exports.comments_delete = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('playlist', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports.comments_delete_2 = async (req, res) => {
  console.log("#################################");
  const id2 = req.params.id;

  const token = req.cookies.jwt;
  const use = await Blog.findOne({ _id: id2 });


  console.log("--------delete----------");
  console.log(use.title);

  console.log("------------------");

  if (token) {
    
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        console.log("errrorrr");

      }
      else {
        let user2 = await User.findById(decodedToken.id);
        // user2=user2[0];
        console.log(user2.reg_no);
        if (user2.reg_no == use.title) {
          Blog.findByIdAndDelete(id2)
            .then(result => {
              console.log("deleted------------------------")
              res.json({ redirect: '/playlist' });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("You cannot delete");
        }
        

      }
    });
  } else {
     console.log("errrrrrrrrrr2");

  }


}

module.exports.videos_get = async (req, res) => {


  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;

      } else {
        // const user = await User.findById(decodedToken.id);
        console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
        // console.log(user.reg_no);
        // const reg = user.reg_no;
        // const name = 
        Blog.find().sort({ createdAt: -1 })
          .then(result => {
            res.render('playlist', { blogs: result, title: 'All blogs' });
          })
          .catch(err => {
            console.log(err);
          });

        // res.locals.user = user;

      }
    });
  } else {
    res.locals.user = null;

  }


  // res.render('videos2');
}