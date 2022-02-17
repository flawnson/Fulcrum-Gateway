import { Twilio } from "twilio";
import initMB from 'messagebird';
let twilioNumber = process.env.TWILIO_PHONE_NUMBER;
let messageBirdToken = process.env.MESSAGEBIRD_TOKEN;

let accountSid = process.env.TWILIO_ACCOUNT_SID;
let authToken = process.env.TWILIO_AUTH_TOKEN;

if(process.env.NODE_ENV === "development"){
  accountSid = process.env.TWILIO_ACCOUNT_SID_TEST;
  authToken = process.env.TWILIO_AUTH_TOKEN_TEST;
}

if(process.env.NODE_ENV === "development"){
  messageBirdToken = process.env.MESSAGEBIRD_TOKEN_TEST;
}

const client = new Twilio(accountSid!, authToken!);
const messagebird = initMB(messageBirdToken!);

export async function sendSMS(phoneNumber: string, message: string, task: string) {
  //if phone number doesn't start with a + then add it.
  if (phoneNumber.startsWith("+") == false){
    phoneNumber = "+" + phoneNumber;
  }

  if(process.env.NODE_ENV === "development"){
    //test phone number and twilio (won't actually charge)
    twilioNumber = "+15005550006";
    console.log("(SMS dev mode) " + message);
  }


  // //Messagebird API (backup)
  // const params = {
  //   'originator': process.env.SMS_NUMBER,
  //   'recipients': [
  //     phoneNumber
  //   ],
  //   'body': message
  // };
  //
  // // @ts-ignore
  // messagebird.messages.create(params, function (err, response) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   console.log(response);
  // });
  //

  // Twilio API
  client.messages.create({
     body: message,
     from: twilioNumber,
     to: phoneNumber
   })
  .then(message => console.log(message.sid));

}
