const User = require("../modals/users.js");
const passport =require('passport');

module.exports.signupPage =  (req,res)=>{
    res.render('../views/signup.ejs');
}


module.exports.postSignup = async(req,res)=>{
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
}

module.exports.loginPage = (req,res)=>{
    res.render('../views/login.ejs');
}


module.exports.postLogin = async (req,res)=>{
    req.flash("success","Welcome to page");
    let redirectUrl = req.session.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}


module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        res.redirect('/listings')
    })
}