require('dotenv').config()
const express = require('express');  // bringing in the express library
const cors = require('cors');       //bringing in the cors module
const monk = require('monk');       //bringing in the mongodb middleware to thedatabase 
const rateLimit = require('express-rate-limit');
const app = express();              //now the express aplication has been ?declared || inserted || defined



const db = monk(process.env.MONGO_URI || 'localhost/tester'); //creating a connection to the database using monk(basically says 'connect to the mongodb on my local machine to a database called tester ) if this environment variable is defined connect to that database otherwise connect to the localhost one
const info = db.get('info');          //mongo works with collections of data we will have and array and everytime someone submits a mew we will put an object with a name and content into the data base(mongo automatically gives it an id)
                                       // (info is a collection inside of our database)if the database or the collection does not exist, it will auto create it 
app.use(cors());                    // use the cors module (adds cors as a middleware). Any incoming request to my server is going to pass through and its going to automatically add the cors headers to it
app.use(express.json());
app.use(express.json());            // any incoming request that has a content-type of application json will be parsed by this middleware and then put on the body (before the client was sending the data but the server could not process it)

//users making request to access the webpage
app.get('/', (request, response) =>{   //"server, when you get a git request on the '/' route run this function" (get is used to request data from a source)
    response.json({                     // when the client makes a git request, respond with...
        message: 'working test'
    });                                 
});

app.get('/testing',(request, response) =>{      //server when you get a git request on the /testing route do the following
    info        
        .find()                                 // as there is no parameter on the find() method, find everything that is in the database
        .then(info => {                         // we get back the object
            response.json(info);                // then we respond with it
        });

});



function isValidContent(dados){
    return dados.name && dados.name.toString().trim() !== '' && // if dados.name is 'a thing' and take the info convert to string and the remove all the white space
    dados.content && dados.content.toString().trim() !== '';
}

   //rate limit the requests         
app.use(rateLimit({
    windowMs: 5*1000,
    max: 1
}));

//users submitting requests to send data
app.post('/testing', (request, response) =>{  //when the server receives a post request on /testing(its the fetch method from client.js) run the request handler(basically the route waiting for the incoming data when you press the 'send your shit' button) 
    if(isValidContent(request.body)){       //checking to see if the data received is valid
        //insert into db
        const data = {                      // creating an object for now(before inserting into db i guess)
            name: request.body.name.toString(), // whatever they're senting us, i'm converting to a string(preventing injections) making sure its a string
            content: request.body.content.toString(),
            created : new Date()
            
        };
        console.log(data)
        info
            .insert(data)  //passing into the collection inside of our database the object data
            .then(createdInfo =>{   //then we are getting back the createdInfo
                response.json(createdInfo); //when we get back the createdInfo respond back with the createdInfo
            });
    }else{
       response.status(422)    //just show status 422
       response.json({
           message: 'Name and content are required'
       }); 

    }                                     
});

app.listen(5000, () => {                //  "server, listen on port 5000, when you're listening run the functions"
    console.log("listening on http://localhost:5000");
});