import React, { PropTypes, Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { SideBarQuizzes, SideBarClasses } from './index';

export default class SideBarWrapper extends Component {

  renderSideBarContent() {
    const quizzes = ['BAC 2017', 'Math Quiz', 'Anathomy Quiz', 'Phisics Quiz', 'Philosophy Quiz'];
    const classes = ['Class IX A', 'Class IX B', 'Class X D', 'Class XI C', 'Class XII D'];
    let sideBarContent = (<Nav />);
    if (this.props.type === 'SideBarQuizzes') {
      sideBarContent = (
        <SideBarQuizzes
          onQuizClick={quiz => this.props.onSideBarItemClick(quiz)}
          content={quizzes}
        />
      );
    }

    if (this.props.type === 'SideBarClasses') {
      sideBarContent = (
        <SideBarClasses
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
