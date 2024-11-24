const Review=require("../models/review.js");
const Listing=require("../models/listing.js");


module.exports.createreview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
       let newReview=new Review(req.body.review);
     newReview.author=req.user._id;
       listing.reviews.push(newReview);
       await newReview.save();
       await listing.save();
      // console.log("new review saved");
       req.flash("success","New review Created");
       res.redirect(`/listings/${listing._id}`)
   };

   module.exports.deletereview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Selected Review Deleted");
   res.redirect(`/listings/${id}`)

};