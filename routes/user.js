const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const {logOut} = require("../middleware")
const userCtrl = require("../controllers/user")


router.get("/register", userCtrl.register);

router.post(
  "/register",
  catchAsync(userCtrl.pstRegister)
);

router.get("/login", userCtrl.login);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userCtrl.pstLogin
);

router.get('/logout', logOut, catchAsync(userCtrl.logout))

module.exports = router;
