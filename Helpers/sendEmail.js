import nodemailer from 'nodemailer'

export function sendEmail (email , otp){
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
            subject: "Ortmor Agency mail verification",
            html: `
            <p> mail verification for Ortmor Agency </p>
            <h3>use this code <h2>${otp}</h2> to verify your email</h3>
            `,
          }
      
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log("error", error, info)
              reject(error)

            } else {
              console.log("success")
              resolve({status :true, message:"Email sent successfull"})
            }
          });
  })
}

export function sendNotificationEmail (email , password){


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
            <p>We are excited to have you as a admin of Ortmor Technology Agency Pvt Ltd. To get started, please use your  email address and the following password to log in</p>
            <p><b>Password: ${password}</b></p>
            `,
          }
      
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log("error", error, info)
              reject(error)

            } else {
              console.log("success")
              resolve({status :true, message:"Email sent successfull"})
            }
          });
  })
}