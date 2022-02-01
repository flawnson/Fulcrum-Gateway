import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new Twilio(accountSid!, authToken!);

export async function sendSMS(phoneNumber: string, message: string, task: string) {
  //if phone number doesn't start with a + then add it.
  if (phoneNumber.startsWith("+") == false){
    phoneNumber = "+" + phoneNumber;
  }

  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"){
    client.messages.create({
       body: message,
       from: twilioNumber,
       to: phoneNumber
     })
    .then(message => console.log(task + " SMS sent: " + message.sid));
  }
  else {
    console.log("(SMS dev mode) " + message);
  }

}
