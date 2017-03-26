import React, { PropTypes, Component } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { SideBarQuizzes, SideBarClasses } from './index';
import { STUDENT, TEACHER } from '../../constants';

export default class SideBarWrapper extends Component {
  constructor() {
    super();
    this.state = {
      sideContent: '',
    };
  }
  componentWillMount() {
    this.setState({ sideContent: this.props.sideBarContent });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ sideContent: nextProps.sideBarContent });
  }

  renderSideBarContent() {
    let sideBarContent = (<Nav />);
    if (this.props.type === 'SideBarQuizzes') {
      if (this.props.userType === STUDENT) {
        sideBarContent = (
          <SideBarQuizzes
            onSideBarTitleClick={() => this.props.onSideBarTitleClick()}
            key={'stud'}
            userType={this.props.userType}
            onQuizClick={id =>
            this.props.onSideBarItemClick(id, 'sessions')}
            content={this.state.sideContent.session}
          />
        );
      } else if (this.props.userType === TEACHER) {
        sideBarContent = (
          <SideBarQuizzes
            onSideBarTitleClick={() => this.props.onSideBarTitleClick()}
            key={'teach'}
            userType={this.props.userType}
            onQuizClick={id =>
            this.props.onSideBarItemClick(id, 'reviewer')}
            content={this.state.sideContent.quizzes}
            onQuizCreatorClick={() => this.props.createQuiz()}
          />
        );
      }
    }

    if (this.props.type === 'SideBarClasses') {
      if (this.props.userType === TEACHER) {
        sideBarContent = (
          <SideBarClasses
            userType={this.props.userType}
            onCreateClassClick={() => this.props.onCreateClassClick()}
            onClassClick={(currentClassId, classTitle) =>
              this.props.onSideBarItemClick(currentClassId, classTitle)}
            content={this.state.sideContent.classes}
          />
        );
      } else if (this.props.userType === STUDENT) {
        sideBarContent = (
          <SideBarClasses
            onSideBarTitleClick={() => this.props.onSideBarTitleClick()}
            userType={this.props.userType}
            onClassClick={(currentClassId, classTitle) =>
              this.props.onSideBarItemClick(currentClassId, classTitle)}
            handleSearchClassForRequestInvite={() => this.props.handleSearchClassForRequestInvite()}
            content={this.state.sideContent.classes}
          />
        );
      }
    }

    return sideBarContent;
  }

  render() {
    return (
      <div className="sideBarWrapper">
        <Navbar inverse collapseOnSelect className="mainNavContainer">
          <Navbar.Header>
            <Navbar.Brand>
              <Button
                className="mainButton"
                onClick={() => this.props.onSideBarTitleClick()}
              >
                {this.props.title}</Button>
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
    session: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  handleSearchClassForRequestInvite: PropTypes.func,
};

SideBarWrapper.defaultProps = {
  onCreateClassClick: null,
  createQuiz: null,
  handleSearchClassForRequestInvite: null,
};
