import { sendVerificationCode, verifyOtp } from "../Helpers/otpVerification.js";
import Admin from "../model/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from 'axios';
import { sendEmail } from "../Helpers/sendEmail.js";
import { randomNumber } from "../Utils/randomNum.js";

const admin_secret_key = process.env.JWT_SECRET_KEY_ADMIN;
const maxAge = 3 * 24 * 60 * 60;

let adminDetails;

// create a jwt token
const createToken = (id) => {
  return jwt.sign({ id }, admin_secret_key, {
    expiresIn: maxAge,
  });
};

// post Signup
export async function generateOtp(req, res) {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    // check the admin is exist
    if (admin) {
      return res.json({
        err: true,
        message: "Email is already exist try another one",
      });
    } else {
      //  send otp to email
      sendVerificationCode(email, req)
        .then((response) => {
          res.json({ status: true, message: "OTP successfully send" });
          adminDetails = req.body;
        })
        .catch((response) => {
          res.json({ status: false, message: "OTP not send" });
        });
    }
  } catch (error) {}
}

// verify otp
export async function doSignup(req, res) {
  try {
    const verified = verifyOtp(req.body.otp);

    if (verified) {
      const { firstName, lastName, email, phone, password, about } =
        req.body.adminDetails;

      if (!firstName || !email || !password || !about)
        throw new Error("All fields are mandatory");

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await Admin.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        about,
      });

      res
        .status(201)
        .json({ status: true, message: "Otp verified successfully" });
    } else {
      res.json({ status: false, message: "Otp does not match " });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
}

// login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ login: false, message: "All fields are required" });
    }
    const admin = await Admin.findOne({ email });
    console.log(admin);
    if (admin) {
      if (!admin.status) {
        return res.json({ login: false, message: "Sorry, you are banned" });
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      console.log(validPassword);
      if (!validPassword) {
        return res.json({ login: false, message: "Incorrect password" });
      }

      // Creating Token With user id
      const token = createToken(admin._id);
      res
        .status(200)
        .json({ admin, token, login: true, message: "Login successfully " });
    } else {
      res.json({ login: false, message: "Incorrect admin name or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ login: false, message: "Internal Server Error" });
  }
}



// login with google

// export async function googleAuth(req, res) {
//   try {
//          console.log(req.body);

//     if (req.body.access_token) {
//       // fetching admin details  from google
//       axios
//         .get(
//           `https://www.googleapis.com/oauth2/v1/admininfo?access_token=${req.body.access_token}`
//         )
//         .then(async (response) => {
//           // checking admin exist or not
//           const admin = await Admin.findOne(
//             { googleId: response.data.id, loginWithGoogle: true },
//             { password: 0 }
//           ).catch((error) => {
//             console.log(error);
//             res
//               .status(500)
//               .json({ created: false, message: "internal server error " });
//           });

//           if (admin) {
//             // check the admin is banned or not
//             if (admin.status) {
//               const token = createToken(admin._id);
//               res
//                 .status(200)
//                 .json({
//                   created: true,
//                   admin,
//                   token,
//                   message: "Login Success ",
//                 });
//             } else {
//               res
//                 .status(200)
//                 .json({ admin, message: "Sorry you are banned..!" });
//             }
//           } else {
//             // if admin not exist creating new account

//             const newAdmin = await Admin.create({
//               googleId: response.data.id,
//               firstName: response.data.given_name,
//               lastName: response.data.family_name,
//               email: response.data.email,
//               loginWithGoogle: true,
//               picture: response.data.picture,
//               password: response.data.id,
//             });

//             // create token after creating
//             const token = createToken(newAdmin._id);
//             res
//               .status(200)
//               .json({
//                 created: true,
//                 admin: newAdmin,
//                 token,
//                 message: "Signup Success",
//               });
//           }
//         });
//     } else {
//       res.status(401).json({ massage: "Not authorized" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ login: false, message: "Internal Serverl Error" });
//   }
// }


//Get Admin Account

export async function getAdminDetails(req, res) {
  try {
    const adminDetails = await Admin.findById(
      { _id: res.adminId },
      { password: 0 }
    );

    if (!adminDetails) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }

    res.status(200).json({ adminDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: "Internal server Error" });
  }
}

export async function updateAdminProfile(req, res) {
  try {
    const { firstName, lastName } = req.body;
    const updatedAdmin = await Admin.updateOne(
      { _id: res.adminId },
      { $set: { firstName, lastName } }
    );
    res
      .status(200)
      .json({ status: true, message: "Profile updated Successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server Error" });
  }
}

export async function updateAdminAvatar (req , res) {
  try {
    // updating the image upload path 
    const image = process.env.BASE_URL + req.files.image[0].path.substring('public'.length);
    // updating the data 
    const updateAdmin = await Admin.findByIdAndUpdate(
      res.adminId,
      { $set: { picture: image } },
      { new: true } // This option returns the updated document
    );

    res.status(200).json({status : true, message : "Profile updated successfully"})

  } catch (error) {
    console.log(error);
    res.status(500).json({status : false, message : "Internal Server Error"})
  }

}  








// Forgot password email varification
export async function forgotPassword(req, res) {
  try {
    const admin = await Admin.findOne({
      email: req.body.email,
      login:false
    });
    if (admin) {
      let otp =randomNumber()
       sendEmail(admin.email,otp);
       const tempToken = jwt.sign({
        otp: otp,
    }, "00f3f20c9fc43a29d4c9b6b3c2a3e18918f0b23a379c152b577ceda3256f3ffa");

    return res.cookie("tempToken", tempToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "none",
    }).json({ err: false, message: `Otp send successfully ${admin.email}` });
 
}
}catch(err){
  console.log(err);
  return res.status(500).json({ err: true, message: 'Internal server error' });

}
}

//Checking otp
export const chackingOtp = async (req, res) => {
  try {
      const { email, otp } = req.body;
      let admin = await Admin.findOne({ email });
      let tempToken = req.cookies.tempToken;
      const OtpToken = jwt.verify(tempToken, '00f3f20c9fc43a29d4c9b6b3c2a3e18918f0b23a379c152b577ceda3256f3ffa');
      
      if (otp == OtpToken.otp) {
          let id = admin._id;
          const newTempToken = jwt.sign({ ID: id }, "00f3f20c9fc43a29d4c9b6b3c2a3e18918f0b23a379c152b577ceda3256f3ffa");

          return res.cookie("tempToken", newTempToken, {
              httpOnly: true,
              secure: true,
              maxAge: 1000 * 60 * 60 * 24 * 7,
              sameSite: "none",
          }).status(200).json('success');
      } else {
          res.status(404).json("Not found");
      }
  } catch (error) {
    console.log(error);
      res.status(500).json("Server error. Please contact the developer.");
  }
};


//Reset password

export const changePassword = async (req, res) => {
  try {
      let tempToken = req.cookies.tempToken;
      const OtpToken = jwt.verify(tempToken, '00f3f20c9fc43a29d4c9b6b3c2a3e18918f0b23a379c152b577ceda3256f3ffa');
      let id = OtpToken.ID;

      const { password } = req.body;
      let bcrypPassword = await bcrypt.hash(password, 10);

      await Admin.updateOne({ _id: id }, { $set: { password: bcrypPassword } }).then(() => {
          res.status(200).json("success");
      });
  } catch (error) {
      res.status(500).json("Server error. Please contact the developer.");
  }
};



 

