// @ts-nocheck to get err as uninferable type
// @ts-ignore
import "reflect-metadata";
import mainController from '../controllers/mainController.ts';
import express from "express";
import cors from "cors";

async function bootstrap(){
  const app = express();
  const port = 8080;

  app.use(cors())

  app.get('/', (req, res) => {
      res.redirect('/api')
  })
  app.use('/api', mainController)

  app.listen(port, function(err){
      if (err) console.log(err);
      console.log("Server listening on PORT", port);
  });
}

bootstrap();
