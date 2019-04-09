import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Grommet Components
import Title from 'grommet/components/Title';
import Header from 'grommet/components/Header';
import Box from 'grommet/components/Box';
import Article from 'grommet/components/Article';
import Label from 'grommet/components/Label';
import Button from 'grommet/components/Button';
import Toast from 'grommet/components/Toast';

// Icons
import Logout from 'grommet/components/icons/base/Logout';

// Custom Modules
import API from '../../../Lib/API';

class AppLayout extends Component {
  onLogoutClick = () => {
    API.logout().then(() => {
      this.props.onLoggedOut();
    }).catch((error) => {
      console.log(`Error: ${error}`);
    });
  }

  render() {
    return (
      <Article full='vertical'>
        <Header float={false} fixed={true} splash={false}>
          <Box margin={{ horizontal: 'medium' }}>
            <Title>
            Session Demo with Couchbase
            </Title>
          </Box>
          <Box flex={true} justify='end' direction='row' responsive={false} margin={{ horizontal: 'medium' }}>
            <Label>{this.props.session.user.name}</Label>
            <Button icon={<Logout />} onClick={this.onLogoutClick} />
          </Box>
        </Header>
      </Article>
    );
  }
}

AppLayout.propTypes = {
  session: PropTypes.object.isRequired,
  onLoggedOut: PropTypes.func.isRequired
};

export default AppLayout;
