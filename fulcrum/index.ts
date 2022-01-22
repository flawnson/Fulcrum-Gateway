// @ts-nocheck to get err as uninferable type
// @ts-ignore

import app from "./api/app";
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8080;

// async function bootstrap(){
//   app.listen(port, function(err){
//       if (err) console.log(err);
//       console.log("Server listening on PORT", port);
//   });
// }
//
// bootstrap();

app.listen(port, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});
