
if(!process.env.NODE_ENV!="production"){
    require("dotenv").config()
}
   
// console.log(process.env.SECRET);

const express= require("express");
const app=express();
const mongoose=require("mongoose");

const path=require("path");
const methodoverride=require('method-override');
const ejsmate=require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStratergy=require("passport-local");
const User=require("./models/user.js");
const axios = require('axios');


const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js");


const dburl=process.env.ATLAS_URL;

main().then(()=>{
    console.log("connected to db");
}).catch(err=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json()); // To parse JSON bodies


//mongo session
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("Error in Mongo SESSION STORE",err);
});

const sessionOption={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*3600*1000,
        maxAge:7*24*3600*1000,
        httpOnly:true,//1week
    }
};





app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//    let fakeUser=new User({
//         email:"student@gamaill.com",
//         username:"delta-student",
//     });
//     let registeredUser=await User.register(fakeUser,"helloWorld");
//     res.send(registeredUser);
// })

//listings routes
app.use("/listings",listingsRouter);

//review routes
app.use("/listings/:id/reviews",reviewsRouter);

//user routes
app.use("/",userRouter);



//middleware

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
})

app.use((err,req,res,next)=>{
   let {statusCode=500,message="something went wrong"}=err;
   res.status(statusCode).render("error.ejs",{message});
});

