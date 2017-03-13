import React, { PropTypes, Component } from 'react';
import { STUDENT, TEACHER } from '../../../constants';

export default class DefaultClassesPanel extends Component {

  renderHeader() {
    if (this.props.userType === TEACHER) {
      return <h3>You currently have {this.props.numberOfClasses} classes</h3>;
    }
    if (this.props.userType === STUDENT) {
      return <h3>You are currently enrolled in {this.props.numberOfClasses} classes</h3>;
    }
    return (null);
  }

  render() {
    return (
      <div>
        <h1><b>My Classes</b></h1>
        <hr />
        { this.renderHeader() }
      </div>
    );
  }
}

DefaultClassesPanel.propTypes = {
  userType: PropTypes.string.isRequired,
  numberOfClasses: PropTypes.number.isRequired,
};
