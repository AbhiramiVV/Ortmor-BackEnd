
// import cloudinary  from 'cloudinary'

// cloudinary.v2.config({
//   cloud_name:process.env.CLOUDINARY_NAME,
//   api_key:process.env.CLOUDINARY_API_KEY,
//   api_secret:process.env.CLOUDINARY_SECRET_KEY 
// })

// export default cloudinary.v2




// Step 1: Import the S3Client object and all necessary SDK commands.

import {  S3Client } from '@aws-sdk/client-s3';


const s3Client = new S3Client({
    endpoint:process.env.DIGITALOCEANSPACE_END_POINT, 
    forcePathStyle: false, 
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.DIGITALOCEANSPACE_ACCESS_KEY_ID, 
      secretAccessKey: process.env.SPACES_SECRET 
    }
});

export default s3Client;