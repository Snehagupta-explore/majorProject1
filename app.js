if(process.env.NODE_ENV !="production")
{
    require("dotenv").config();
}

console.log(process.env.SECRET)
const express=require("express")
const app=express()
const mongoose=require("mongoose")

const Listing=require("./models/listing.js")
const Review=require("./models/reviews.js")
const User=require("./models/user.js")


const session = require('express-session')
const MongoStore=require("connect-mongo")
const flash=require("connect-flash")

const path=require("path")
const methodOverride=require("method-override")
app.use(methodOverride("_method"))
// const wrapAsync=require("./utils/wrapAsync.js")
 const ExpressError=require("./utils/ExpressError.js")
// const{listingSchema,reviewSchema}=require("./schema.js")
const ejsMate=require("ejs-mate")
// const reviews = require("./models/reviews.js")
app.use(express.static(path.join(__dirname,"/public")))
port=8080

const passport=require("passport")
const Localstratergy=require("passport-local")


const listingsRouter=require("./routes/listings.js")
const reviewsRouter=require("./routes/reviews.js")
const userRouter=require("./routes/user.js")

// const mongo_Url="mongodb://127.0.0.1:27017/wanderlust"

const dbUrl=process.env.ATLASDB_URL

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 
app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}));

main()
.then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err)
})

async function main() {
    await mongoose.connect(dbUrl)
}
 
const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24 *3600
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session());
passport.use(new Localstratergy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser=req.user
    next()
});

app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter)
// app.get("/demos",async(req,res)=>{
// let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"sigamda"
// });
// let registeredUser=await User.register(fakeUser,"helloword")
// res.send(registeredUser)
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
});

app.use((err,req,res,next)=>{
   let{statusCode=500,message="something went wrong"}=err;
   res.render("error.ejs",{message})
//    res.status(statusCode).send(message)
});
app.listen(port,()=>{
    console.log("server is listing")
});