// AWS API Variables
const fs = require('fs');
var configData = JSON.parse(fs.readFileSync('./aws-exports.json'));

// API Application Variables
const express = require('express');
const cors = require('cors')

const app = express();
const port = configData.aws_api_port;
app.use(cors());
app.use(express.json())

// API Protection
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var bodyParser = require('body-parser')
const csrfProtection = csrf({
  cookie: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrfProtection);





// Security Variables
const jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var request = require('request');
var pems;
var issCognitoIdp = "https://cognito-idp." + configData.aws_region + ".amazonaws.com/" + configData.aws_cognito_user_pool_id;
        

// Redis Variable
const Redis = require("ioredis");

const redisClient = Redis.createClient({
  host: configData.aws_redis_server,
  port: configData.aws_redis_port,
});




//-- Socket variables
const wsport = configData.aws_socket_port;
const httpws = require("http");
const WebSocket = require("ws");

const wsapp = express();
const server = httpws.createServer(wsapp);
const wss = new WebSocket.Server({ server });


wss.on("connection", (ws) => {
  
  console.log("WS connected.");

  const redisClientWs = Redis.createClient({
    host: configData.aws_redis_server,
    port: configData.aws_redis_port,
  });

  
  redisClientWs.monitor((err, monitor) => {
    if (err) throw err;

    console.log("Connected to Redis.");

    monitor.on("monitor", (time, args, source, database) => {
      ws.send(JSON.stringify({ time, args }));
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
    redisClientWs.disconnect();
  });
});




// Startup - Download PEMs Keys
gatherPemKeys(issCognitoIdp);



//--#################################################################################################### 
//   ---------------------------------------- SECURITY
//--#################################################################################################### 


//-- Gather PEMs keys from Cognito
function gatherPemKeys(iss)
{

    if (!pems) {
        //Download the JWKs and save it as PEM
        return new Promise((resolve, reject) => {
                    request({
                       url: iss + '/.well-known/jwks.json',
                       json: true
                     }, function (error, response, body) {
                         
                        if (!error && response.statusCode === 200) {
                            pems = {};
                            var keys = body['keys'];
                            for(var i = 0; i < keys.length; i++) {
                                //Convert each key to PEM
                                var key_id = keys[i].kid;
                                var modulus = keys[i].n;
                                var exponent = keys[i].e;
                                var key_type = keys[i].kty;
                                var jwk = { kty: key_type, n: modulus, e: exponent};
                                var pem = jwkToPem(jwk);
                                pems[key_id] = pem;
                            }
                        } else {
                            //Unable to download JWKs, fail the call
                            console.log("error");
                        }
                        
                        resolve(body);
                        
                    });
        });
        
        } 
    
    
}


//-- Validate Cognito Token
function verifyTokenCognito(token) {

   try {
        //Fail if the token is not jwt
        var decodedJwt = jwt.decode(token, {complete: true});
        if (!decodedJwt) {
            console.log("Not a valid JWT token");
            return {isValid : false, session_id: ""};
        }
        
        
        if (decodedJwt.payload.iss != issCognitoIdp) {
            console.log("invalid issuer");
            return {isValid : false, session_id: ""};
        }
        
        //Reject the jwt if it's not an 'Access Token'
        if (decodedJwt.payload.token_use != 'access') {
            console.log("Not an access token");
            return {isValid : false, session_id: ""};
        }
    
        //Get the kid from the token and retrieve corresponding PEM
        var kid = decodedJwt.header.kid;
        var pem = pems[kid];
        if (!pem) {
            console.log('Invalid access token');
            return {isValid : false, session_id: ""};
        }

        const decoded = jwt.verify(token, pem, { issuer: issCognitoIdp });
        return {isValid : true, session_id: ""};
    }
    catch (ex) { 
        console.log("Unauthorized Token");
        return {isValid : false, session_id: ""};
    }
    
};


// API : API Execute SQL Query
app.get("/api/auth/token/", (req,res)=>{
    
    
    // Token Validation
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);
    
    if (cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Cognito Token is invalid"});

    
    try {
        
        res.status(200).send({ csrfToken: req.csrfToken() });
    

    } 
    catch(error) {
        console.log(error)
    }
    
    

});



//--#################################################################################################### 
//   ---------------------------------------- API : COUNTER
//--#################################################################################################### 


//--  Fetch the counter value from Redis
app.get("/api/counter/default", (req, res) => {
    
      
      redisClient.get("counter", (err, reply) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Failed to fetch counter" });
        }
        res.json({ value: parseInt(reply || "0", 10) });
      });
      
      
});



//-- Increment the counter using Redis INCR
app.post("/api/counter/increment", (req, res) => {
      
      redisClient.incr("counter", (err, reply) => {
        if (err)
          return res.status(500).json({ error: "Failed to increment counter" });
        res.json({ value: parseInt(reply, 10) });
      });
      
});



//-- Decrement the counter using Redis DECR
app.post("/api/counter/decrement", (req, res) => {
    
      redisClient.decr("counter", (err, reply) => {
        if (err)
          return res.status(500).json({ error: "Failed to decrement counter" });
        res.json({ value: parseInt(reply, 10) });
      });
  
});



//-- Increment the counter using Redis INCR
app.post("/api/counter/incrementBy", (req, res) => {
    
      redisClient.incrby("counter", 10, (err, reply) => {
        if (err)
          return res.status(500).json({ error: "Failed to increment counter" });
        res.json({ value: parseInt(reply, 10) });
      });
  
});



//-- Decrement the counter using Redis DECR
app.post("/api/counter/decrementBy", (req, res) => {
    
      redisClient.decrby("counter", 10, (err, reply) => {
        if (err)
          return res.status(500).json({ error: "Failed to decrement counter" });
        res.json({ value: parseInt(reply, 10) });
      });
      
});




//-- Set counter value in Redis
app.post("/api/counter/setCounter", (req, res) => {
    
      const value = req.body.value;
      redisClient.set("counter", value, (err, reply) => {
        if (err) return res.status(500).json({ error: "Failed to set counter" });
        res.json({ value: parseInt(value, 10) });
      });
      
});





//--#################################################################################################### 
//   ---------------------------------------- MAIN API CORE
//--#################################################################################################### 


app.listen(port, ()=>{
    console.log(`API Server is running on ${port}`)
})


server.listen(wsport, () => {
  console.log(`Socket Server is running on ${wsport}`)
});
