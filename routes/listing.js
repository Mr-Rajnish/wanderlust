const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")

const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")
const listingController=require("../controllers/listing.js")

const multer=require('multer');
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})

// we can write route with router.route() read document

//index route
router.get("/",wrapAsync(listingController.index));
  
        //New Route
      router.get("/new",isLoggedIn ,listingController.rendernewform);

      // Search Route
      router.get("/search", wrapAsync(listingController.search));

  
       //create route
         router.post("/",isLoggedIn,upload.single('image'),validateListing,wrapAsync(listingController.createlisting));
      

       //edit route
       router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
  
       //update route
       router.put("/:id",isLoggedIn,isOwner,upload.single('image'),validateListing,wrapAsync(listingController.updateListing))
  
          //show route(Read)
          router.get("/:id",wrapAsync(listingController.showlisting));
  
  
          //delete route
          router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))
  

          module.exports=router