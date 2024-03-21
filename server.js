import express from "express";
import "dotenv/config";
import morgan from 'morgan';
import dbConnect from "./config/connection.js";
import adminRouter from "./routes/adminRouter.js"
import superAdminRouter from "./routes/superAdminRouter.js"
import mongoSanitize from 'express-mongo-sanitize' ;
import xss from 'xss-clean'
import cookieParser from "cookie-parser";
import multer from 'multer';
import path  from 'path'
// import uploadVideo from "./middleware/video-upload.js";



const app = express();
const port = process.env.PORT || 7000;

app.use(morgan('dev'));

// Use cookie-parser middleware
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve() +"/public"))
app.use(mongoSanitize());  

// DATA SANITIZATION  against site script xss 
app.use(xss());


// Connect to MongoDB
dbConnect();

app.use("/admin" , adminRouter)
app.use("/superAdmin" ,superAdminRouter )


app.use(( err ,req , res , next) => {
  if(err instanceof multer.MulterError) {
    
    console.log(err);
   // A multer error occured when uploading
   if(err.code == 'LIMIT_FILE_TYPE') {
     res.json({ message : err.message });
   }else{
     res.status(500).json({ message: err.message });
   }
  }else{
   res.status(500).json({ message: "Unknown error occured" });
  }
 })

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
