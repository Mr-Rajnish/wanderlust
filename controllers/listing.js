const Listing =require("../models/listing");
const { geocodeAddress } = require('../geocode');


// module.exports.index=async (req,res)=>{
//     const allListings = await Listing.find({});
//           res.render("listings/index.ejs",{allListings});
  
//   };
// listingController.js

module.exports.index = async (req, res) => {
  const { category } = req.query;  // Get the category query parameter

  let allListings;

  if (category) {
      // If a category is provided, filter listings by category
      allListings = await Listing.find({ category: category });
  } else {
      // Otherwise, fetch all listings
      allListings = await Listing.find();
  }

  // Render the listings page with the filtered or all listings
  res.render("listings/index.ejs", { allListings });
};


// for the search functionallity of the search box x
module.exports.search = async (req, res) => {
  const { title } = req.query; // Extract the search query

  let filteredListings;
  if (title) {
      // Use a case-insensitive search for listings that match the title
      filteredListings = await Listing.find({
          title: { $regex: title, $options: 'i' } // 'i' for case-insensitive search
      });
  } else {
      filteredListings = await Listing.find(); // Return all listings if no search query
  }

  // Send back the filtered listings as JSON
  res.json({ listings: filteredListings });
};





  module.exports.rendernewform=(req,res)=>{  
    res.render("listings/new.ejs");
  };

  module.exports.showlisting=async (req,res)=>{
    let {id}=req.params;
     const listing= await Listing.findById(id).populate
     ({path :"reviews",populate:{path:"author"},}).populate("owner");
     if(!listing){
      req.flash("error","Listing You Requested for does not exists");
      res.redirect("/listings");
     }
    res.render("listings/show.ejs",{listing});
};


module.exports.createlisting = async (req, res) => {
    // Geocode address and return coordinates
    const handleAddress = async (address) => {
      const coordinates1 = await geocodeAddress(address);
      if (coordinates1) {
        return {
          type: "Point",
          coordinates: [
            coordinates1.latitude,
            coordinates1.longitude,
          ]
        };
      } else {
        console.log('No coordinates found for the given address');
        return null;
      }
    };
  
    // Get the address from the request body
    const address = req.body.location;
  
    // Extract other fields from the request body
    let url = req.file.path;
    let filename = req.file.filename;
    let { title, description, image, price, country, location,category } = req.body;
  
    // Prepare the new listing object
    const newListings = {
      title: title,
      description: description,
      image: image,
      price: Number(price),
      country: country,
      location: location,
      category:category,
    };
  
    try {
      // Wait for the handleAddress function to return coordinates before creating the listing
      const coordinates = await handleAddress(address);
      if (coordinates) {
        // Create a new Listing object with the coordinates (geometry)
        const newListing = new Listing({
          ...newListings,
          owner: req.user._id,
          geometry: coordinates,
          image: { url, filename }
        });
  
        // Save the listing to the database
        let savedlisting=await newListing.save();
        //console.log(savedlisting);
  
        // Flash success message and redirect
        req.flash("success", "New Listing Created");
        return res.redirect("/listings");
      } else {
        // If no coordinates were found, send an error response
        req.flash("error", "Failed to geocode address. Please try again.");
        return res.redirect("/listings/create");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      req.flash("error", "An error occurred while creating the listing.");
      return res.redirect("/listings/create");
    }
  };
  


// module.exports.createlisting= async (req,res)=>{
    
//  // geocordinate
//  const handleAddress = async (address) => {
//     // Call the geocodeAddress function from geocode.js
//     const coordinates1 = await geocodeAddress(address);
  
//     if (coordinates1) {
//         return {
//            type:"Point",
//            coordinates:[
//             coordinates1.latitude,
//             coordinates1.longitude,
//            ]
//         }
//     //   console.log(`Latitude: ${coordinates.latitude}`);
//     //   console.log(`Longitude: ${coordinates.longitude}`);
//     } else {
//       console.log('No coordinates found for the given address');
//     }
//   };
  
//   // Example address to geocode
//   const address = req.body.location;
  
//   // Call handleAddress to get the coordinates for the address
// //   handleAddress(address);


    
//     //console.log(req.body);

//        let url=req.file.path;
//        let filename=req.file.filename;
//       let {title,description,image,price,country,location}=req.body;

//       const newListings={
//           title:title,
//           description:description,
//           image:image,
//           price: Number(price),
//           country:country,
//           location:location
//       }


//       const newListing=new Listing(newListings);
//       newListing.owner=req.user._id;
//       newListing.geometry=handleAddress(address);
//       newListing.image={url,filename};
//      await newListing.save();
//       // console.log(newListings)
//       req.flash("success","New Listing Created");
//       res.redirect("/listings"); 
//    };

   module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing You Requested for does not exists");
          res.redirect("/listings");
    }
   let originalImageUrl= listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
 };

 module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;

    let {title,description,image,price,country,location,category}=req.body;
    const editListings={
        title:title,
        description:description,
        image:image,
        price:price,
        country:country,
        location:location,
        category:category,
    } 
    
   let listing= await Listing.findByIdAndUpdate(id,editListings);
      
       if(typeof req.file!=="undefined"){
       let url=req.file.path;
       let filename=req.file.filename;
       listing.image={url,filename};
       await listing.save();
       }
    req.flash("success","Selected Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
 };

 module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Selected Listing has been deleted");
    res.redirect("/listings");
};