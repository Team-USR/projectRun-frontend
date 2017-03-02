import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

export default function NavBar(props) {
  return (
    <div>
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" className="navbar-brand">
              USR Interactive-Language
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <LinkContainer to="/quiz">
              <NavItem eventKey={1}>
                My Quiz
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/quiz-generator">
              <NavItem eventKey={2}>
                Create Quiz
              </NavItem>
            </LinkContainer>
            <NavDropdown eventKey={3} title="My Account" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>
            <LinkContainer onClick={props.onLogout} to="/login">
              <NavItem eventKey={4}>
                Logout
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

NavBar.propTypes = {
  onLogout: React.PropTypes.func.isRequired,
};
