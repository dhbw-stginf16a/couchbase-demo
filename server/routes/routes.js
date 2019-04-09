const routes = require('express').Router();
const password = require('password-hash-and-salt');
const log = require('../lib/log')('REST');

let db = null;

// REST Endpoints
routes.post('/login', (req, res) => {
  const email = req.body.username.toLowerCase();
  const remember = req.body.rememberMe;
  log.info(`Incoming: User: ${email}\t`);
  db.getUser(email).then((result) => {
    console.log(`retrieve user ${result}`)
    password(req.body.password).verifyAgainst(result.password, (err, verified) => {
      if(err) {
        log.info('Login failed due to an error');
        res.status(401);
        res.send({ error: err});
      } else {
        if(!verified) {
          log.info('Login failed due to wrong credentials');
          res.status(401);
          res.send({ error: 'Wrong credentials' });
        } else {
          log.info('User authenticated');
          req.session.rememberMe = remember;
          req.session.email = email;
          req.session.name = result.name;
          res.status(200);
          res.send({ message: 'authenticated', 
            user: { email: result.email, name: result.name } });
        }
      }
    });
  }, (err) => {
    log.error(`Error: ${err}`);
    res.status(401);
    res.send({ error: 'An error occured while checking credentials.' });
  });
});

routes.get('/session', (req, res) => {
  // Check if user has a session, which is the case if remember is set to True
  if (req.session.rememberMe === true) {
    db.getUser(req.session.email).then((result) => {
      // Send obtained user to client
      log.info(`User ${result.email} identified by Session`);
      res.status(200);
      res.send({
        message: 'authenticated',
        hasSession: true,
        user: { email: result.email, name: result.name }
      });
    }, (err) => {
      log.error('User identification failed');
      log.error(err);
      res.status(200);
      res.send({ message: `User ${req.session.email} not found`, hasSession: false, user: null });
    });
  } else {
    log.info('No session found');
    res.status(200);
    res.send({ message: 'No session found', hasSession: false, user: null });
  }
});

routes.post('/logout', (req, res) => {
  // Check if user has a session
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        log.error(`Error while deleting session: \n${err}`);
        res.status(200).send({ message: 'An Error occured while deleting the session' });
      } else {
        log.info('Deleted Session');
        res.clearCookie('connect.sid').status(200).send({ message: 'Deleted Session' });
      }
    });
  } else {
    log.info('No Session was found');
    res.status(200).send({ message: 'No Session found' });
  }
});

module.exports = function routing(database) {
  db = database;
  return routes;
};
