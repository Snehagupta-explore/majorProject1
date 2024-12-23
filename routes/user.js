const express=require("express")
const router=express.Router()
const passport = require('passport');

const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const userController=require("../controllers/user.js")
const {saveRedirectUrl}=require("../middleware.js")

router
    .route("/signup")
//render signup form
.get(userController.renderSignupForm)
//it will sumbit the form and save it
.post(wrapAsync(userController.signup));

router
    .route("/login")
    //register login form
    .get(userController.renderLoginForm)
    //it will help to login
    .post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),
userController.login);

router.get("/logout",userController.logout);

module.exports=router            