import React, { PropTypes } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';

export default function SideBarQuizzes(props) {
  if (props.userType === 'teacher') {
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
  if (props.userType === 'student') {
    const content = props.content;
//    console.log(content);
    const notStartedContent = content.filter((item) => {
      if (item.status === 'not_started') {
        return (item);
      }
      return (null);
    });
    const inprogressContent = content.filter((item) => {
      if (item.status === 'in_progress') {
        return (item);
      }
      return (null);
    });
    const submittedContent = content.filter((item) => {
      if (item.status === 'submitted') {
        return (item);
      }
      return (null);
    });
    return (
      <Nav>
        <NavItem key={0}>
          <h4>Not started</h4>
        </NavItem>
        {
            notStartedContent.map((item, index) => {
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
        <NavItem >
          <h4>In progress</h4>
        </NavItem>
        {
          inprogressContent.map((item, index) => {
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
          <h4>Submitted</h4>
        </NavItem>
        {
            submittedContent.map((item, index) => {
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
}

SideBarQuizzes.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  onQuizCreatorClick: PropTypes.func,
  userType: PropTypes.string.isRequired,
};
SideBarQuizzes.defaultProps = {
  onQuizCreatorClick: null,
};
