import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import API from './Lib/API';
// Import Polyfills for Promise and fetch() (for IE)
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';

import '../scss/index.scss';

import App from './App';

const session = {
  hasSession: false,
  user: null
};
// Check for an open session before doing anything else
API.session().then((response) => {
  // Overwrite Session values with the returned values
  session.hasSession = response.hasSession;
  session.user = response.user;
  startReactApp();
}, (error) => {
  console.log(error);
  // If requests fails, then just start app without session
  startReactApp();
});

function startReactApp() {
  const element = document.getElementById('content');
  ReactDOM.render((<BrowserRouter><App session={session} /></BrowserRouter>), element);
  document.body.classList.remove('loading');
}
