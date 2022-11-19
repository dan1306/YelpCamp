const User = require("../models/user");


let pstRegister = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({
        email,
        username
      });
      const registeredUser = await User.register(user, password);
     
      req.login(registeredUser, err => {
        if (err) {
          return next(err)
        }
        req.flash("success", "Welcome To Yelp Camp");
        res.redirect("/campgrounds");
      });
     
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
}
  
let pstLogin =  (req, res) => {
    const redirecturl = req.body.prevUrl
    req.flash('success', "welcome back")
        res.redirect(redirecturl)
}
  
let login = (req, res) => {
    // console.log("LOGMEIN", req.session.returnTo)
    let prevUrl
    if (req.session.returnTo) {
      prevUrl = req.session.returnTo
    } else {
      prevUrl = '/campgrounds'
    }
    res.render("users/login", {
      prevUrl
    });
}
  
let register = (req, res) => {
    res.render("users/register");
}
  

let logout = (req, res) => {
    res.redirect('/campgrounds')

}

module.exports = {
    pstRegister,
    pstLogin,
    login,
    register,
    logout
}