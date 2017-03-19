import React, { PropTypes } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';

export default function SideBarClasses(props) {
  const content = props.content;
  let createClassButton = (null);

  if (props.userType === 'teacher') {
    createClassButton =
    (
      <NavItem>
        <Button className="createClassBtn" onClick={() => props.onCreateClassClick()}>
          Create Class
        </Button>
      </NavItem>
    );
  }

  return (
    <Nav>
      { createClassButton }
      {
        content.map((obj, index) => {
          if (index < 8) {
            return (
              <NavItem key={`class_${obj.id}`}>
                <Button
                  className="sideBarButton"
                  onClick={() => props.onClassClick(obj.id.toString(), obj.name)}
                >
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
  userType: PropTypes.string.isRequired,
  onCreateClassClick: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

SideBarClasses.defaultProps = {
  onCreateClassClick: null,
};
