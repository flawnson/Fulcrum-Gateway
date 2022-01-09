import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';

export async function sendSMS(phoneNumber: string, confirmCode: string) {
  const url = process.env.SMS_API_URL!;

  //if phone number doesn't start with a + then add it.
  if (phoneNumber.startsWith("+") == false){
    phoneNumber = "+" + phoneNumber;
  }

  const data = JSON.stringify({
    "To": phoneNumber,
    "From": "Fiefoe",
    "Text": "Use this code to enter the line: " + confirmCode
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: process.env.SMS_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.SMS_API_TOKEN
    },
    data : data
  };

  if (process.env.NODE_ENV === "production"){
    const response: AxiosResponse = await axios(config);
    console.log("SMS sent to " + phoneNumber);
  }
  else {
    console.log("DEVELOPMENT MODE SMS")
    console.log("(SMS) Use this code to enter the line: " + confirmCode);
  }

}
