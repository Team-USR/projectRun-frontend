import React, { PropTypes, Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { SideBarQuizzes, SideBarClasses } from './index';

export default class SideBarWrapper extends Component {

  renderSideBarContent() {
    const quizzes = ['Quiz REVIEWER'];
    const classes = [
      { className: 'Class IX A', classId: '901' },
      { className: 'Class IX B', classId: '902' },
      { className: 'Class X D', classId: '903' },
      { className: 'Class XI A', classId: '904' },
      { className: 'Class XII A', classId: '905' },
    ];
    let sideBarContent = (<Nav />);
    if (this.props.type === 'SideBarQuizzes') {
      sideBarContent = (
        <SideBarQuizzes
          onQuizClick={(review, create) => this.props.onSideBarItemClick(review, create)}
          content={quizzes}
        />
      );
    }

    if (this.props.type === 'SideBarClasses') {
      sideBarContent = (
        <SideBarClasses
          onClassClick={(showClass, currentClass) =>
            this.props.onSideBarItemClick(showClass, currentClass)}
          content={classes}
        />
      );
    }

    return sideBarContent;
  }

  render() {
    return (
      <div className="sideBarWrapper">
        <Navbar inverse collapseOnSelect className="mainNavContainer">
          <Navbar.Header>
            <Navbar.Brand>
              <b>{this.props.title}</b>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse className="sideBarLeft">
            {this.renderSideBarContent()}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

SideBarWrapper.propTypes = {
  onSideBarItemClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
