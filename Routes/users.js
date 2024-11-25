const express  = require('express');
const router = express.Router({mergeParams : true});
const passport =require('passport');
const { saveRedirectUrl, isLoggedIn } = require('../middleware.js');
const { signupPage, postSignup, loginPage, postLogin, logout } = require('../controllers/users.js');

router.get("/signup",signupPage)

router.post("/signup",isLoggedIn,postSignup)

router.get("/login",loginPage)

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}), postLogin
);

router.get("/logout",logout)

module.exports = router;
