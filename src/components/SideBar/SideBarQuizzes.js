import React, { PropTypes } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';

export default function SideBarQuizzes(props) {
  const content = props.content;
  return (
    <Nav>
      <NavItem key={0}>
        <Button onClick={() => props.onQuizCreatorClick()}>
          Quiz CREATOR
          </Button>
      </NavItem>
      {
        content.map((item, index) => {
          if (index < 10) {
            return (
              <NavItem key={item.id}>
                <Button onClick={() => props.onQuizClick(item.id)}>
                  {item.title}
                </Button>
              </NavItem>
            );
          }
          return (null);
        },
        )
      }
    </Nav>
  );
}

SideBarQuizzes.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  onQuizCreatorClick: PropTypes.func.isRequired,
};
