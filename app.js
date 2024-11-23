const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Listing = require("./modals/listing.js");
const Review = require("./modals/review.js");
const path = require('path');
const ExpressError = require('./ExpressError.js');
const { listingSchema, reviewSchema } = require('./Schema.js');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./modals/users.js');
const flash = require('connect-flash');
const app = express();
const port = 8080;

// Import routes
const listingsRouter = require('./Routes/listings.js');
const reviewsRouter = require('./Routes/review.js');
const usersRouter = require('./Routes/users.js');

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
        console.log(" connection successful");
    } catch (err) {
        console.error(" connection error:", err);
    }
}

main();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine('ejs', ejsMate);

// Serve static files
app.use(express.static(path.join(__dirname, "/public")));

// Parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set up session with secure cookies in production
app.use(session({
    secret: 'mysecretpass',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 24 * 7 * 60 * 60 * 1000,
        maxAge: 24 * 7 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true // Uncomment this when deploying on HTTPS
    }
}));

// Flash for flash messages
app.use(flash());

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages and current user available to all templates
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    res.locals.currUser = req.user;
    console.log("Current User:", req.user);
    next();
});

// Home route
app.get("/", (req, res) => {
    res.send("It's a root node");
});

// Listings and reviews routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

// Handle 404 errors
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    console.error("Error:", err); // Log full error for debugging
    res.status(status).send(message);
});

// Start the server
app.listen(port, () => {
    console.log(`App is listening on port ${port}.`);
});