const express=require('express');
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const usercontroller=require("../controllers/user")
router.get("/signup",usercontroller.renderSignupForm);

router.post("/signup",wrapAsync(usercontroller.signup));


router.get("/login",usercontroller.renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login' ,failureFlash: true}), wrapAsync(usercontroller.login));

router.get("/logout",usercontroller.logout)


module.exports=router;