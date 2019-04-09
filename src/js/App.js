import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

// Grommet components
import App from 'grommet/components/App';
// Custom Container
import LoginLayout from './Components/Layout/LoginLayout/LoginLayout';
import AppLayout from './Components/Layout/AppLayout/AppLayout';

export default class BasicApp extends Component {
  state = {
    session: this.props.session
  }

  _onLoggedIn = (newSession) => {
    console.log(newSession);
    this.setState({ session: newSession });
  }

  _onLoggedOut = () => {
    this.setState({ session: { hasSession: false, user: null } });
  }

  render() {
    // Create different routes depending on whether the user has a session or not
    const content = (this.state.session.hasSession) ?
      (
        <Switch>
          <Redirect from='/login' to='/' />
          <Route path='/'
            render={() =>
              (<AppLayout
                session={this.state.session}
                onLoggedOut={this._onLoggedOut} />)} />
        </Switch>
      ) :
      (
        <Switch>
          <Route path='/login' exact render={() => <LoginLayout onLoggedIn={this._onLoggedIn} />} />
          <Redirect from='/' to='/login' />
          <Route render={() => <h1>Page Not found</h1>} />
        </Switch>
      );

    return (
      <App centered={false}>
        {content}
      </App>
    );
  }
}

BasicApp.propTypes = {
  session: PropTypes.object.isRequired
};
