import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';

export default class StudentManager extends Component {

  renderButton() {
    if (this.props.type === 'add') {
      return (
        <Button
          className="classStudentBtn"
          onClick={() => this.props.addStudent(this.props.index)}
        >
          {this.props.name}
          <span className="glyphicon glyphicon-plus" />
        </Button>
      );
    } else if (this.props.type === 'remove') {
      return (
        <Button
          className="classStudentBtn"
          onClick={() => this.props.removeStudent(this.props.index)}
        >
          {this.props.name}
          <span className="glyphicon glyphicon-remove" />
        </Button>
      );
    }
    return (null);
  }

  render() {
    return (
      <div className="studentManagerWrapper">
        { this.renderButton() }
      </div>
    );
  }
}

StudentManager.propTypes = {
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  addStudent: PropTypes.func,
  removeStudent: PropTypes.func,
};

StudentManager.defaultProps = {
  addStudent: null,
  removeStudent: null,
};
