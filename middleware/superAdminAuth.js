import SuperAdminModel from '../model/superAdminModel.js';
import jwt from 'jsonwebtoken' ;
const superAdmin_secret_key  = process.env.JWT_SECRET_KEY_SUPERADMIN;

// check the admin logged in 
export async function verifySuperAdmin(req , res , next )  {
  const authHeader = req.headers.authorization ;
  // getting token from headers
  if(authHeader) {
    // separating Bearer Token and take token only
    const token = authHeader.split(' ')[1];
  // verify that token with the superAdmin_secret_key;
    jwt.verify(token , superAdmin_secret_key  , async(err , decoded) => {
        if(err) {
          res.json({status : false , message : "Permission not allowed" }) ;
        }else { 
        // finding the admin with the decoded id
          const superAdmin = await SuperAdminModel.findById(decoded.id) ;
          if(superAdmin ) {
            // if admin true pass to the next function
            next() ;
          }else {
            res.json({status : false , message : "superAdmin  not Exists"})
          }
        }
    })

  }else {
    res.json({ status : false , message : "Token not Provided "})
    next()
  }
}