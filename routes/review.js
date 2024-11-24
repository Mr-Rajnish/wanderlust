const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validatereview, isLoggedIn, isReviewAuthor} =require("../middleware.js")
const reviewcontroller=require("../controllers/review.js")


// REviews
        
        //Post Route
        router.post("/",isLoggedIn,validatereview,wrapAsync(reviewcontroller.createreview));
   
           //Delete Route
           router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewcontroller.deletereview))
   
           module.exports=router;