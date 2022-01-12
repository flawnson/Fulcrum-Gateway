// import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';
import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new Twilio(accountSid!, authToken!);

export async function sendSMS(phoneNumber: string, confirmCode: string) {
  //if phone number doesn't start with a + then add it.
  if (phoneNumber.startsWith("+") == false){
    phoneNumber = "+" + phoneNumber;
  }

  if (process.env.NODE_ENV === "production"){
    client.messages.create({
       body: confirmCode + " is your Fiefoe verification code.",
       from: twilioNumber,
       to: phoneNumber
     })
    .then(message => console.log("SMS sent: " + message.sid));
  }
  else {
    console.log("(SMS dev mode) " + confirmCode + " is your Fiefoe verification code.");
  }
  
  // const url = process.env.SMS_API_URL!;
  //
  // //if phone number doesn't start with a + then add it.
  // if (phoneNumber.startsWith("+") == false){
  //   phoneNumber = "+" + phoneNumber;
  // }
  //
  // const data = JSON.stringify({
  //   "To": phoneNumber,
  //   "From": "Fiefoe",
  //   "Text": "Use this code to enter the line: " + confirmCode
  // });
  //
  // const config: AxiosRequestConfig = {
  //   method: 'post',
  //   url: process.env.SMS_API_URL,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + process.env.SMS_API_TOKEN
  //   },
  //   data : data
  // };
  //
  // if (process.env.NODE_ENV === "production"){
  //   const response: AxiosResponse = await axios(config);
  //   console.log("SMS sent to " + phoneNumber);
  // }
  // else {
  //   console.log("DEVELOPMENT MODE SMS")
  //   console.log("(SMS) Use this code to enter the line: " + confirmCode);
  // }

}
