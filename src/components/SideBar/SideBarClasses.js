import React, { PropTypes } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function SideBarClasses(props) {
  const content = props.content;
  return (
    <Nav>
      {
        content.map((item) => {
          const link = `/${item}`;
          return (
            <LinkContainer to={link} key={item} >
              <NavItem>
                {item}
              </NavItem>
            </LinkContainer>
          );
        })
      }
    </Nav>
  );
}

SideBarClasses.propTypes = {
  content: PropTypes.arrayOf(PropTypes.string).isRequired,
};
