import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

export default function NavBar(props) {
  return (
    <Navbar inverse collapseOnSelect className="topNabBarWrapper">
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/" className="navbar-brand">
            <div className="BrandTitleWrapper">
              <i className="fa fa-check-square-o logo" aria-hidden="true" />
              <span> Interactive Language </span>
              <i aria-hidden="true" className={`fa ${props.userTypeClass} userTypeIcon`} />
            </div>
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
            <LinkContainer to="/settings">
              <MenuItem>Settings</MenuItem>
            </LinkContainer>
            <MenuItem divider />
            <MenuItem >Help</MenuItem>
          </NavDropdown>
          <LinkContainer onClick={props.onLogout} to="/home">
            <NavItem >
              Logout
            </NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

NavBar.propTypes = {
  onLogout: React.PropTypes.func.isRequired,
  userTypeClass: React.PropTypes.string.isRequired,
};
