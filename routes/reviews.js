const express=require("express")
const router=express.Router({mergeParams:true});
const Review=require("../models/reviews.js")
const Listing=require("../models/listing.js")
const reviewController=require("../controllers/review.js")
const ExpressError=require("../utils/ExpressError.js")
const wrapAsync=require("../utils/wrapAsync.js")

const{validateReview,isLoggedIn,isreviewAuthor}=require("../middleware.js")

//creating reviws
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

//delete reviw & post review route

router.delete("/:reviewId",isLoggedIn,isreviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports=router


