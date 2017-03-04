import React, { PropTypes } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';

export default function SideBarQuizzes(props) {
  const content = props.content;
  return (
    <Nav>
      {
        content.map(item =>
          (
            <NavItem key={item}>
              <Button onClick={() => props.onQuizClick(true, false)}>
                {item}
              </Button>
            </NavItem>
          ),
        )
      }
      <NavItem key={0}>
        <Button onClick={() => props.onQuizClick(false, true)}>
          Quiz CREATOR
        </Button>
      </NavItem>
    </Nav>
  );
}

SideBarQuizzes.propTypes = {
  content: PropTypes.arrayOf(PropTypes.string).isRequired,
  onQuizClick: PropTypes.func.isRequired,
};
