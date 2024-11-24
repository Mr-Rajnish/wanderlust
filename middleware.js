const wrapAsync = require("./utils/wrapAsync");
const  Listing=require("./models/listing");
const Review=require("./models/review")
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./Schema.js");
const {reviewSchema}=require("./Schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","you must be logged in to create");
       return  res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let listing = await  Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
      req.flash("error","you are not the owner of the listing");
    return  res.redirect(`/listings/${id}`);
    }
    next();
});

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    //console.log(error);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        console.error('Validation error:', errMsg); // Log detailed error info
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.validatereview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        console.error('Validation error:', errMsg); // Log detailed error info
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor=wrapAsync(async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review = await  Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
      req.flash("error","you did not create this Review");
    return  res.redirect(`/listings/${id}`);
    }
    next();
});
