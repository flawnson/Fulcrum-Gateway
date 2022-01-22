import nodemailer from "nodemailer";

export async function sendEmail(email: string, url: string, task: string) {

  let transporter = null;

  if (process.env.NODE_ENV === "production"){
    //production environment
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
  else {
    console.log("Using test email account to send email.")
    //development environment
    const account = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass // generated ethereal password
      }
    });

  }

  let mailOptions = {};

  if (task === "confirm"){
    mailOptions = {
      from: '"Fiefoe" <' + process.env.SENDER_EMAIL + '>', // sender address
      to: email, // list of receivers
      subject: "Confirm your email to finish signup", // Subject line
      text: "Please click the link below to confirm your email:", // plain text body
      html: `<a Please finish your account signup at the following link: href="${url}">${url}</a>` // html body
    };
  }
  else if (task == "reset"){
    mailOptions = {
      from: '"Fiefoe" <' + process.env.SENDER_EMAIL + '>', // sender address
      to: email, // list of receivers
      subject: "Reset your password", // Subject line
      text: "Please click the link below to reset your password:", // plain text body
      html: `<Please click the link below to reset your password: a href="${url}">${url}</a>` // html body
    };
  }

  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  if (process.env.NODE_ENV === "development") {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}
