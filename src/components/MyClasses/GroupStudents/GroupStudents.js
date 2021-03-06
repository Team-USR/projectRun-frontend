import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

/**
 * Component that shows class information about its students
 * @type {Array}
 */
export default class GroupStudents extends Component {
/**
 * Method creates and returns an array of the students enrolled in a class. Shows
 * only a message if there are no students.
 * @return {array} Array of html elements
 */
  renderStudents() {
    const returnComponent = [];
    if (this.props.students.length === 0) {
      returnComponent.push(<h4 key={'nostudent'}>There are no students enrolled in this class!</h4>);
    } else {
      let moreCounter = 0;
      this.props.students.map((obj, index) => {
        if (index <= 29) {
          returnComponent.push(<li className="elementList" key={`group_student_${obj.id}`}>
            <span><b> {obj.name} </b></span>
          </li>);
        } else {
          moreCounter += 1;
        }
        return 0;
      },
    );
      if (moreCounter > 0) {
        returnComponent.push(<h5 key={'morestud'}>and {moreCounter} more</h5>);
      }
    }
    return returnComponent;
  }
  /**
   * Component render method
   * @return {Object} component instance
   */
  render() {
    return (
      <div className="groupSectionWrapper">
        <div className="titleSection">
          <h1>Students</h1>
        </div>
        <ul>
          { this.renderStudents() }
        </ul>
        <Button
          className="enjoy-css"
          onClick={this.props.handleManageStudentsFromClass}
        >
          Manage</Button>
      </div>
    );
  }
}

GroupStudents.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleManageStudentsFromClass: PropTypes.func.isRequired,
};
