import jwt from 'jsonwebtoken';
import Admin from "../model/adminModel.js"

const admin_secret_key = process.env.JWT_SECRET_KEY_ADMIN;
// check the admin logged in 
export async function verifyAdminLogin (req , res, next ) {
    try {
      // getting token from headers
      const authHeader = req.headers.authorization ;
      if(authHeader) {
        const token = authHeader.split(' ')[1];
     // verify that token with the secret_key ;
        jwt.verify(token , admin_secret_key , async(err , decoded) => {
          if(err) {
           res.json({status: false , message : "Permission not allowed" });
          }else{

        // finding the admin with the decoded id

            const admin = await Admin.findById(decoded.ID)
            if(admin) {
             res.adminId = decoded.ID
              next()
            }else{
             
              res.json({ status: false, message: "admin not exists" });
            }
          }
        })
        
        }
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: "Internal server error" })
    }
}