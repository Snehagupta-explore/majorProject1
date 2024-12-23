const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review=require("./reviews.js");
const { required, string } = require("joi");
const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        
    },
    image: {
        url:String,
        filename:String,
    },
    price: {
        type: Number,
        
    },
    location: {
        type: String,
        
    },
    country: {
        type: String,
        
    },
    reviews:[
        {
            type: schema.Types.ObjectId,ref:"Review"
        }
    ],
    owner:{
        type:schema.Types.ObjectId,ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{ $in:listing.reviews}})
    }
    })
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

