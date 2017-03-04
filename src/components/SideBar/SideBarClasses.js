import React, { PropTypes } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';

export default function SideBarClasses(props) {
  const content = props.content;
  return (
    <Nav>
      {
        content.map(obj =>
          (
            <NavItem key={obj.classId}>
              <Button onClick={() => props.onClassClick(true, obj.classId)}>
                {obj.className}
              </Button>
            </NavItem>
          ),
        )
      }
    </Nav>
  );
}

SideBarClasses.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
