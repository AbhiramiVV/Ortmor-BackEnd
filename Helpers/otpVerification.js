import nodemailer from 'nodemailer'

let otpValue

export function sendVerificationCode (email){

  const otp = Math.floor(1000 + Math.random() * 9000);
  return new Promise((resolve, reject)=>{
      let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD ,
          },
        });
    
          var mailOptions={
            from: process.env.EMAIL,
            to: email,
            subject: "Ortmor Technology Agency Pvt Ltd Email verification",
            html: `
            <h1>Verify Your Email ForOrtmor Technology Agency Pvt Ltd</h1>
              <h3>use this code inOrtmor Technology Agency Pvt Ltd to verify your email</h3>
              <h2>${otp}</h2>
            `,
          }
      
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log("error", error, info)
              reject(error)

            } else {
              console.log("success")
              otpValue = otp
              resolve({success:true, message:"Email sent successfull"})
            }
          });
  })
}


export function verifyOtp (otp) {
  return new Promise((resolve,reject)=>{
    if (otpValue==otp){
        resolve({status:true});
    }else{
        reject();
    }
})
}