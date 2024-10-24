const express  = require('express');
const router = express.Router({mergeParams : true});
const User = require("../modals/users.js");
const passport =require('passport');
const { saveRedirectUrl, isLoggedIn } = require('../middleware.js');

router.get("/signup",(req,res)=>{
    res.render('../views/signup.ejs');
})


router.post("/signup",isLoggedIn,async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser,(err)=>{
            if(err) {
                return next(err);
            }
            res.redirect("/listings");
        })
        
        
    } catch (error) {
        // req.flash("errorMsg",e.message);
        res.redirect("/signup");
    }
})

router.get("/login",(req,res)=>{
    res.render('../views/login.ejs');
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}), async (req,res)=>{
    req.flash("success","Welcome to page");
    let redirectUrl = req.session.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}
);

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        res.redirect('/listings')
    })
})

module.exports = router;
