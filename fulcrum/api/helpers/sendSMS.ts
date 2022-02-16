import { Twilio } from "twilio";
import initMB from 'messagebird';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const messageBirdToken = process.env.MESSAGEBIRD_TOKEN;
const client = new Twilio(accountSid!, authToken!);
const messagebird = initMB(messageBirdToken!);

export async function sendSMS(phoneNumber: string, message: string, task: string) {
  //if phone number doesn't start with a + then add it.
  if (phoneNumber.startsWith("+") == false){
    phoneNumber = "+" + phoneNumber;
  }

  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"){
    var params = {
      'originator': process.ENV.SMS_NUMBER,
      'recipients': [
        phoneNumber
      ],
      'body': message
    };

    messagebird.messages.create(params, function (err, response) {
      if (err) {
        return console.log(err);
      }
      console.log(response);
    });
    // client.messages.create({
    //    body: message,
    //    from: twilioNumber,
    //    to: phoneNumber
    //  })
    // .then(message => console.log(task + " SMS sent: " + message.sid));
  }
  else {
    console.log("(SMS dev mode) " + message);
  }

}
