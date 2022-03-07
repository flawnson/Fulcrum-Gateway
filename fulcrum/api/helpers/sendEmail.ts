import nodemailer from "nodemailer";

export async function sendEmail(email: string, url: string, task: string) {

  let transporter = null;

  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"){
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
    let body = `<p>Please use this link to complete the sign-up process: <a href="${url}">${url}</a></p>`;
    mailOptions = {
      from: '"Fiefoe" <' + process.env.SENDER_EMAIL + '>', // sender address
      to: email, // list of receivers
      subject: "Confirm your email to finish signup", // Subject line
      text: "Please use this link to complete the sign-up process: " + url, // plain text body
      html: body // html body
    };
  }
  else if (task == "reset"){
    let body = `<p>Please use this link to reset your password: <a href="${url}">${url}</a></p>`;
    mailOptions = {
      from: '"Fiefoe" <' + process.env.SENDER_EMAIL + '>', // sender address
      to: email, // list of receivers
      subject: "Reset your password", // Subject line
      text: "Please use this link to reset your password: " + url, // plain text body
      html: body // html body
    };
  }

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    if (process.env.NODE_ENV === "development") {
      console.log("Preview URL: ")
      console.log("%s", nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development"){
      console.log("Ethereal service is not working currently. Manually printing email contents.")
      console.log("EMAIL CONTENT: ");
      console.log(mailOptions);
      console.log("Link to complete signup is: " + url);
    }
    else {
      console.log("Email service not working in production");
      throw err;
    }
  }

}
