import nodemailer from 'nodemailer'

export function sendBlogNotification  (email , message ){

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
            subject: "Ortmor Technology Agency Pvt Ltd Blog Added ",
            html: `
            <h4>   A new  Blog (${message?.blog}) has been added . Please see the Admin Panel for more details. </h4>
          
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