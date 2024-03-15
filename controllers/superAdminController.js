import SuperAdminModel from "../model/superAdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../model/adminModel.js";
import Blog from "../model/blogModel.js"
import { sendNotificationEmail } from "../Helpers/sendEmail.js";





const maxAge = 3 *24 * 60 * 60 ;
const superAdmin_secret_key = process.env.JWT_SECRET_KEY_SUPERADMIN;

// Creating jwt token with secret key
const createToken = (id) => {
  return jwt.sign({id} ,superAdmin_secret_key , {
    expiresIn : maxAge
  })
}

// check admin logged in 
export async function authAdmin (req,res) {
    try {
      const authHeader = req.headers.authorization;
    if(authHeader) {
  
      // seperating bearer and token and taking the token 
      const token = authHeader.split(' ')[1];
      jwt.verify(token , superAdmin_secret_key , async(err , decoded )=>{
      
        if(err) {
          res.json({ status: false, message: "Unauthorized" })
        }else {
          // finding the superAdmin with the decoded id
          const superAdmin = SuperAdminModel.findById({_id : decoded.id });
          if (superAdmin) {
            res.json({ status: true, message: "Authorized" });
  
        } else {
            res.json({ status: false, message: "superAdmin not exists" })
  
        }
        }
  
  
      })
    }else {
      res.json ({ status : false , message : "Admin not exist "})
    }
    } catch (error) {
      res.json({ status: false, message: "Internal Server Error " })
    }
  
  }
  
export async function SuperAdminLogin(req , res) {

    const {email , password } = req.body;
    try {
       
      if(!email || !password  ) {
        return res.json({ message : "All fields are mandatory"});
      }
  
      const superAdmin = await SuperAdminModel.findOne({ email:email });
      if(!superAdmin) {
        return res.json({message: "Email not exist " , login: false})
      }
      const validPassword = await bcrypt.compare(password , superAdmin.password)
      if(!validPassword){
        return res.json({message: "Incorrect email or password"})
      }
      // creating token with adminid
      const token = createToken(superAdmin._id);
      res.cookie("jwt" , token , {
        withCredentials: true,
        httpOnly : false ,
        maxAge: maxAge *1000
  
      })
      // hiding password and pass the admin only
      superAdmin.password = "empty"
      res.status(200).json({superAdmin , token , login : true });
  
    } catch (error) {
        console.log(error);
      res.status(500).json({message: "Internal Server Error"})
    }
  
  
   }


//ADMIN MNANNAGEMENT
 
export async function addAdmin(req, res) { 
  

    try {
       const { firstName, lastName, email, phone,password, about } =  req.body;
    
      if(!firstName , !lastName , !email , !phone ,!password, !about) {
        throw new Error("All fields are mandatory")
      }
    
    // creating  password for Admin
    const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await Admin.findOne({
        $or:[{email:email} , {phone : phone }]
      }); 
    
    
      if(admin){
       return res.json({created:false , message :"admin already exists"});
      }
     
    // create newadmin with random pass
      const newAdmin = await Admin.create({
        firstName,
        lastName,
        email ,
        password : hashedPassword ,
        phone , 
        about
    
      })
    
      // here send the password to the admin via email 
        const emailSend = await sendNotificationEmail(email , password);
    
        if(emailSend.status) {
            res.json({ created : true , message : " Admin Details added successfully"})
        }
        else {
          res.json({created : false ,  message : "Email not send" })
        }
    } catch (error) {
        console.log(error);
      res.status(500).json("internal server error") ;
    }
    
    }
    
export async function getAllAdmin(req, res) {
  
    try {
      // Finding all Admin with paginated Results
      const admin =  await Admin.find().skip(req.paginatedResults.startIndex).limit(req.paginatedResults.endIndex)
      if(admin){
        res.status(200).json({status : true , admin , pagination :req.paginatedResults})
      }
    } catch (error) {
      res.status(500).json({created : false , message:"Internal Server Error" })
    }
  }

export async function blockAdmin (req , res){
    try {
  
      // find admin with id and update the status
      const admin = await Admin.findByIdAndUpdate(req.params.id ,{$set : {status: false}}, {new: true} );
      if(admin){
        res.status(200).json({ status : true , message : "Admin Blocked Successfully"})
      }else {
        res.status(404).json({ status : false , message : "Something went wrong"})
      }
    } catch (error) {
      res.status(500).json({ status : false , message: "Internal server Error"})
    }
  }

 export async function unBlockAdmin (req , res) {
    try {
      // find admin with id and update the status
      const admin = await Admin.findByIdAndUpdate(req.params.id , 
        {$set : {status : true}} , {new : true} )
  
        if(admin){
          res.status(200).json({ status : true , message : "Admin Unblocked Successfully"})
        }else{
          res.status(404).json({status : false , message : "Something went wrong "})
        }
  
    } catch (error) {
    res.status(500).json({status : false , message : "Internal server error" })    
    }
  }
  
  //BLOG MANAGEMENT

  //get blogs

export async function getBlog (req , res) {

    try {
      
      // finding All blog and find the title details also by populating
      const blog = await Blog.find().skip(req.paginatedResults.startIndex).limit(req.paginatedResults.limit).populate('title').lean()
      if(blog) {
        res.status(200).json({ status : true , blog , pagination : req.paginatedResults})
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ status : false , message : " Internal Server Error "}) ;
    }
  }

  export async function changeBlogStatus (req , res) {
  
    try {
      
      const blogId = req.params.id
      const { status } = req.params ;
  
      let updatedData = {} ;
  
      switch(status) {
        case 'block' : 
            updatedData.status = false;
          break;
        case 'unblock' : 
            updatedData.status = true;
        break ;
        default : 
        return res.status(400).json({status : false, message : 'Invalid status'})
      }
  
  
      const response = await Blog.updateOne({ _id :blogId} , {$set : updatedData})
      if(response.modifiedCount ===1) {
        const message = status === 'block' ? 'Blog Blocked Successfully' : 'Blog Unblocked Successfully'
        return res.status(200).json({ status : true , message })
      }
  
      res.status(404).json({ status : false , message : 'Blog not found'}) ;
  
    } catch (error) {
      res.status(500).json({ status : false , message : 'Internal Server Error'}) ;
      
    }
  
  }
  