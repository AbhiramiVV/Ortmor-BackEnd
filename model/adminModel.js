import mongoose from "mongoose";


const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Admin FirstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "Admin lastName is required"],
    },
    email: {
      type: String,
      required: [true, "Admin email is required"],
    },
    phone: {
      type: String,
      requird: [true, "Admin Phone No is required"],
    },
    password: {
      type: String,
    },
    login: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    about: {
      type: String,
    },
    googleId : {
      type : String ,
      allowNull : true
    },

    loginWithGoogle : {
      type : Boolean ,
      default : false 
    },
    picture : {
      type: String,

    },

    image: {
      type : Object 
    },
  },
  {
    timestamps: true,
  }
);



const adminModel = mongoose.model("Admin", adminSchema);

export default adminModel;
