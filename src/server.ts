import express,{Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get('/filteredimage/',async (req:Request, res: Response)=>{

    try{
        const {image_url} = req.query;

        if(!image_url){
          return res.status(400).send("bad request: image url required");
        }
        const imageFile = await filterImageFromURL(image_url);

        return res.status(200).sendFile(imageFile, ()=>{
          deleteLocalFiles([imageFile])
    });
  }
    catch(err){
      return res.status(500).send({err: 'Unable to process your request'})
  }
});
  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();