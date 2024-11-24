const joi=require('joi');

module.exports.listingSchema=joi.object({
   
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country:joi.string().required(),
        price: joi.number().required().min(0),
        image:joi.string().allow("",null),
        category: joi.string().valid('Trending', 'Rooms','Cities', 'Mountain', 'Castles','Pools','Camping','Farms', 'Artic Region','Domes','Boating',).required(),  // Added category field with validation
       
    
});

module.exports.reviewSchema=joi.object({
      review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment: joi.string().required(),
      }).required(),
});