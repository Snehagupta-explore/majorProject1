const express=require("express")
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const Listing=require("../models/listing.js")
const Review=require("../models/reviews.js")
const{listingSchema,reviewSchema}=require("../schema.js")
const{isLoggedIn}=require("../middleware.js")
const { isOwner,validateListing} = require('../middleware'); 

const listingController=require("../controllers/listing.js")

const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage})

router
    .route("/")
    //index 
    .get(wrapAsync(listingController.index))
     //create listing
    .post(
     isLoggedIn,
     upload.single('listing[image][url]'),
     validateListing,
     wrapAsync(listingController.createListing),
    );
    

    //new form
    router.get("/new",isLoggedIn,listingController.renderNewForm);
    
router
    .route("/:id")
    //show
    .get(wrapAsync(listingController.showListing))
    //edit- will save edit part of the form and render to listing pg
    .put(
     isLoggedIn,  
     upload.single('listing[image][url]'),
     validateListing,
     wrapAsync(listingController.updateListing))
    //delete
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
     
    //edit-will provide edit for which details are filled 
    router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
    
    module.exports=router