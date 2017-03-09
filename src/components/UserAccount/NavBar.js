import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

export default function NavBar(props) {
  return (
    <div>
      <Navbar inverse collapseOnSelect className="topNabBarWrapper">
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" className="navbar-brand">
              Interactive Language
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <LinkContainer to="/my-quizzes">
              <NavItem>
                My Quizzes
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/my-classes">
              <NavItem>
                My Classes
              </NavItem>
            </LinkContainer>
            <NavDropdown title="My Account" id="basic-nav-dropdown">
              <MenuItem >Settings</MenuItem>
              <MenuItem divider />
              <MenuItem >Help</MenuItem>
            </NavDropdown>
            <LinkContainer onClick={props.onLogout} to="/login">
              <NavItem >
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
