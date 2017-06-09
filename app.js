var express = require("express"),
    app = express(),
    request = require("request"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment =  require("./models/comment"),
    seedDB = require("./seeds"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localAuth = require("passport-local"),
    localMongoose = require("passport-local-mongoose"),
    User = require("./models/user");
    

mongoose.connect(process.env.DATABASEURL);
app.set("view engine", "ejs");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());



 app.use(require("express-session")({
        secret: "What is your name",
        resave: false,
        saveUninitialized: false
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(new localAuth(User.authenticate()));
    
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.oopss = req.flash("oops");
    res.locals.success = req.flash("success");
    next();
    })

//seedDB();
app.get("/", function(req, res){
    res.redirect("/campgrounds");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, body){
       if(err){
           console.log("An error occured: "+err);
       } 
       else{
           res.render("index", {campgrounds: body});
       }
    });
        
});

app.post("/campgrounds", isLoggedIn, function(req, res){
    Campground.create({name: req.body.name, image: req.body.image, description: req.body.description}, function(err, campground){
       if(err){
           console.log("An error occured: "+err);
       } 
       else{
           campground.author.id = req.user._id;
           campground.author.username= req.user.username;
           campground.save();
           res.redirect("/campgrounds");
       }
    });
    
});

app.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("new");
});

app.post("/campgrounds/:id", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err)
        {
            console.log(err);
            
        }
        else
        {
            Comment.create({author:req.user, content: req.body.cont}, function(err, newComment){
        if(err)
        {
            console.log(err);
        }
        else
        {
            newComment.author.id = req.user._id;
            newComment.author.username = req.user.username;
            newComment.save();
            foundCampground.comments.push(newComment);
            foundCampground.save();
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
        }
    })
    
});

app.get("/campgrounds/:id/edit", isLoggedIn, function(req, res){
     Campground.findById(req.params.id, function(err, foundCampground){
        if(err)
        {
            console.log(err);
            
        }
        else
        {
        res.render("edit", {campground: foundCampground});
        }
     });
    
});

app.put("/campgrounds/:id", isLoggedIn, function(req, res){
     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
        if(err)
        {
            console.log(err);
            
        }
        else
        {
        res.redirect("/campgrounds/"+req.params.id);
        }
     });
    
});

app.delete("/campgrounds/:id", isLoggedIn, function(req, res){
     Campground.findById(req.params.id, function(err, foundCampground){
        if(err)
        {
            console.log(err);
            
        }
        else
        {
            if(req.user.username == foundCampground.author.username)
            {
                foundCampground.remove();
                res.redirect("/campgrounds");
            }
            else
            {
                req.flash("oops", "You can only delete the campground you added!!");
                res.redirect("/campgrounds/"+req.params.id);
            }
        }
     });
    
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, body){
        if(err){
            console.log("An error occured: "+err);
        }
        else{
                res.render("show", {campgrounds: body});   
                }
    });
    
});


//SIGN UP ROUTES

app.get("/signup", function(req, res){
    res.render("signup");
});

app.post("/signup", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            res.render("signup");
        }
        else
        {
            res.render("login");
        }
    });
});

//LOGIN ROUTES

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){
    
});

function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("oops", "Please login!");
    res.redirect("/login");
}

// LOGOUT ROUTE
app.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logged out");
    res.redirect("/login");
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started");
})

