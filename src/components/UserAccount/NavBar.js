import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem, NavItem, IndexLinkContainer } from 'react-bootstrap';
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

            <LinkContainer to="/quiz">
              <NavItem >
                View Quiz
              </NavItem>
            </LinkContainer>

            <LinkContainer to="/quiz-generator">
              <NavItem >
                Create Quiz
              </NavItem>
            </LinkContainer>
            <NavDropdown title="My Account" id="basic-nav-dropdown">
              <MenuItem >Profile</MenuItem>
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
