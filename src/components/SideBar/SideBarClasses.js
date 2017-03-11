import React, { PropTypes } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';

export default function SideBarClasses(props) {
  const content = props.content;
  return (
    <Nav>
      <NavItem>
        <Button className="createClassBtn" onClick={() => props.onCreateClassClick()}>
          Create Class
        </Button>
      </NavItem>
      {
        content.map((obj, index) => {
          if (index < 8) {
            return (
              <NavItem key={`class_${obj.id}`}>
                <Button onClick={() => props.onClassClick(obj.id.toString(), obj.name)}>
                  {obj.name}
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

SideBarClasses.propTypes = {
  onCreateClassClick: PropTypes.func.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
