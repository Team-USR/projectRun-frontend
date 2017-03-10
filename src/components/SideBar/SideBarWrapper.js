import React, { PropTypes, Component } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { SideBarQuizzes, SideBarClasses } from './index';

export default class SideBarWrapper extends Component {

  renderSideBarContent() {
    let sideBarContent = (<Nav />);
    if (this.props.type === 'SideBarQuizzes') {
      sideBarContent = (
        <SideBarQuizzes
          onQuizClick={id =>
            this.props.onSideBarItemClick(id)}
          content={this.props.sideBarContent.quizzes}
          onQuizCreatorClick={() => this.props.createQuiz()}
        />
      );
    }

    if (this.props.type === 'SideBarClasses') {
      sideBarContent = (
        <SideBarClasses
          onCreateClassClick={() => this.props.onCreateClassClick()}
          onClassClick={(currentClassId, classTitle) =>
            this.props.onSideBarItemClick(currentClassId, classTitle)}
          content={this.props.sideBarContent.classes}
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
              <Button onClick={() => this.props.onSideBarTitleClick()}>{this.props.title}</Button>
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
  onSideBarTitleClick: PropTypes.func.isRequired,
  onCreateClassClick: PropTypes.func,
  onSideBarItemClick: PropTypes.func.isRequired,
  createQuiz: PropTypes.func,
  sideBarContent: PropTypes.shape({
    classes: PropTypes.arrayOf(PropTypes.shape({})),
    quizzes: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

SideBarWrapper.defaultProps = {
  onCreateClassClick: null,
  createQuiz: null,
};
