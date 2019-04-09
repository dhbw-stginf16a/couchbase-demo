// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Grommet UI Components
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import LoginForm from 'grommet/components/LoginForm';
import Footer from 'grommet/components/Footer';
import Toast from 'grommet/components/Toast';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';

import Logo from 'grommet/components/icons/Grommet';

// Custom Modules
import API from '../../../Lib/API';

class LoginLayout extends Component {
  state = {
    showToast: false,
    toastMessage: '',
  }

  _onLoginClick = (values) => {
    API.login(values).then((response) => {
      console.log({ hasSession: true, ...response });
      this.props.onLoggedIn({ hasSession: true, ...response });
    }).catch((error) => {
      console.log(error);
      this.setState({ showToast: true, toastMessage: 'Login unsuccessful' });
    });
  }

  _onToastClosed = () => {
    this.setState({ showToast: false });
  }

  render() {
    const toast = this.state.showToast ?
      (
        <Toast status='critical'
          onClose={this._onToastClose}>
          {this.state.toastMessage}
        </Toast>
      ) : null;

    return (
      <Split flex='left' separator={true}>
      <Article>
        <Section
          full={true}
          colorIndex='brand'
          texture='url(img/splash.png)'
          pad='large'
          justify='center'
          align='center'
        >
          <Heading tag='h1' strong={true}>Store sessions with Couchbase</Heading>
          <Paragraph align='center' size='large'>
          </Paragraph>
        </Section>
      </Article>

      <Sidebar justify='between' align='center' pad='none' size='large'>
      {toast}
        <span />
        <LoginForm
          align='start'
          logo={<Logo className='logo' colorIndex='brand' />}
          title='Couchbase Demo'
          onSubmit={this._onLoginClick}
          usernameType='email'
          rememberMe={true}
        />
        <Footer
          direction='row'
          size='small'
          pad={{ horizontal: 'medium', vertical: 'small' }}
        >
          <span className='secondary'>By Cathleen Schmalfuß, Alex Schäfer, Andreas Fuchs</span>
        </Footer>
      </Sidebar>

    </Split>
    );
  }
}

export default LoginLayout;

LoginLayout.propTypes = {
  // history: PropTypes.object.isRequired,
  onLoggedIn: PropTypes.func.isRequired
};
