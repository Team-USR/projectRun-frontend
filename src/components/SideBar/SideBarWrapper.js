import React, { PropTypes, Component } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { SideBarQuizzes, SideBarClasses } from './index';
import { STUDENT, TEACHER } from '../../constants';

/*
  Sidebar wrapper component
*/
export default class SideBarWrapper extends Component {
  /*
    Default constructor
  */
  constructor() {
    super();
    this.state = {
      sideContent: '',
    };
  }
  /*
  When mounting the component the sideContent is populated with the content received from the parent
  through the props
  */
  componentWillMount() {
    this.setState({ sideContent: this.props.sideBarContent });
  }
  /*
  When updating the data, new content is received through props, and the sideContent is updated
  @nextProps props
  */
  componentWillReceiveProps(nextProps) {
    this.setState({ sideContent: nextProps.sideBarContent });
  }
  /*
  Render sidebar content function based on the user type, rendering here his child components.
  */
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
            onSideBarTitleClick={() => this.props.onSideBarTitleClick()}
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
  /*
  Main render method
  */
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
