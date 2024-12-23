const Listing=require("./models/listing.js")
const ExpressError=require("./utils/ExpressError.js")
const{listingSchema,reviewSchema}=require("./schema.js")
const Review=require("./models/reviews.js")

//to check whther the user is logged in or not
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path,"..",req.originalUrl)
    if(!req.isAuthenticated()){
            req.session.redirectUrl=req.originalUrl
        req.flash("error","you must be logged in to create listing")
       return res.redirect("/login")
    }
    next()
}

//for checking where user visited any pg before login 
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

//only the owner can edit delt update

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params
    let listing= await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
     req.flash("error","you are not the owner of these listing")
    return res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports.isreviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params
    let review= await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
     req.flash("error","you did not create this review")
    return res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body)
   
    if(error){
       throw new ExpressError(400,error)
    }else{
        next();
    }
}

//for review validation
module.exports.validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body)
   
    if(error){
       throw new ExpressError(400,error)
    }else{
        next();
    }
}