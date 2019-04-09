console.log('--------------------------------');
console.log('Couchbase-Demo Server started');

// Global Settings
const port = 1234;

// load external dependencies
const app = require('express')(); // web framework for nodejs
const server = require('http').Server(app); // used to start a webserver listening for http requests
const bodyParser = require('body-parser'); // express middleware to parse body object of REST requests
const cors = require('cors'); // CORS middleware for express
const expressSession = require('express-session'); // Session middleware for express
const CouchbaseStore = require('connect-couchbase')(expressSession); // Store Session info in Couchbase
const db = require('./lib/db')({
  host: 'localhost:8091',
  user: 'couchbase-demo-user',
  password: 'cbdemouser',
  bucket: 'demo-bucket'
});

async function initComponents(express) {
  db_client = await db.open();

  const sessionStore = new CouchbaseStore({
    db: db_client
  });

  const routes = require('./routes/routes')(db); // Contains the REST Interfaces

  // setup cors options
  const whitelist = ['http://localhost:3000'];
  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`Orgin ${origin} not allowed by CORS`));
      }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
  };
  
  
  const session = expressSession({
    store: sessionStore,
    secret: 'Im blue da ba dee da ba daa', //random secret value 
    cookie: {maxAge:28*24*60*60*1000}, //stay open for 4 weeks of inactivity
    saveUninitialized: false,
    resave: false
  })
  
  // HTTP
  // MIDDLEWARE
  // set up bodyParser
  express.use(bodyParser.json());
  // set up CORS, to avoid blocking of our requests
  express.use(cors(corsOptions));
  // enable pre-flights (still CORS related)
  express.options('*', cors(corsOptions));
  // use express-session for session management
  express.use(session);

  // Connect routes (REST APIs) to application
  express.use('/', routes);
}

initComponents(app).then(() => {
  // Start server
  console.log(`Initialized components successfully`);
  console.log(`Server running on port ${port}`);
  console.log('--------------------------------');
  server.listen(port);

  // createUser();
  // retrieveUser();
}, err => {
  console.log(`An Error occured while starting the server`);
  console.log(`${err}`);
  console.log('--------------------------------');
});

function createUser() {
  console.log('Adding User')
  const password = require('password-hash-and-salt');

  hash = password('testpw').hash((err, hash) => {
    if(err)
      throw new Error('Something went wrong!');

    const user = {
      email: 'andreas.fuchs@hpe.com',
      name: 'Andreas Fuchs',
      password: hash
    };

    db.addUser(user).then((result) => {
      console.log(`User added: ${result}`)
    }, (err) => {
      console.log(`An Error occured while adding the user: ${err}`)
    });
  });
}

function retrieveUser() {
  db.getUser("andreas.fuchs@hpe.com").then((result) => {
    console.log(`Users: ${JSON.stringify(result)}`)
  }, (err) => {
    console.log(`An Error occured while adding the user: ${err}`)
  });
}