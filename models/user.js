const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
});

// username field and password feild both are created by the passport-local-Schema

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
