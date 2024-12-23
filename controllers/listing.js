const Listing=require("../models/listing")

module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({})
    res.render("listings/index.ejs", { allListings });
    }

module.exports.renderNewForm=(req,res)=>{
        res.render("listings/new.ejs")
    }

module.exports.showListing=async(req,res)=>{
    let{id}=req.params
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");
    if
    (!listing){
        req.flash("error", " listing donot exist!"); 
      return  res.redirect("/listings")  //added
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing})
    }


// module.exports.createListing=async (req, res, next) => {
//     let result= listingSchema.validate(req.body)
//     console.log(result)
//     if(result.error){
//        throw new ExpressError(400,result.error)
//     }
//          const newListing = new Listing(req.body.listing);
//          console.log(req.user)
//           newListing.owner=req.user._id;
//          await newListing.save(); 
//           req.flash("success", "new listing added successfully!");
//          res.redirect("/listings");
//      }
module.exports.createListing = async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url, filename}
    let saveListing = await newListing.save();
    console.log(saveListing);
    req.flash("success", "new listing added successfully!");
    res.redirect("/listings");
  }
  
module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params
    const listing=await Listing.findById(id)
    if
    (!listing){
        req.flash("error", " listing donot exist!"); 
        res.redirect("/listings")
    }
    
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateListing=async(req,res)=>{
        let{id}=req.params
      let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}) 
    if(typeof req.file !=="undefined")
    {
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url, filename}

      await listing.save()
    }
      req.flash("success", " listing updated successfully!");
      res.redirect(`/listings/${id}`)
    }
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id)
    req.flash("success", "listing deleted successfully!");
    console.log(deleteListing)

    res.redirect(`/listings`)
}    