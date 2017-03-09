import React, { PropTypes } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';

export default function SideBarQuizzes(props) {
  const content = props.content;
  const publishedContent = content.filter((item) => {
    if (item.published) {
      return (item);
    }
    return (null);
  });
  const unpublishedContent = content.filter((item) => {
    if (!item.published) {
      return (item);
    }
    return (null);
  });
  return (
    <Nav>
      <NavItem key={0}>
        <Button onClick={() => props.onQuizCreatorClick()}>
          Quiz CREATOR
          </Button>
      </NavItem>
      <NavItem>
        <h4>Unpublished</h4>
      </NavItem>
      {
        unpublishedContent.map((item, index) => {
          if (index < 5) {
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
      <NavItem>
        <h4>Published</h4>
      </NavItem>
      {
        publishedContent.map((item, index) => {
          if (index < 5) {
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
