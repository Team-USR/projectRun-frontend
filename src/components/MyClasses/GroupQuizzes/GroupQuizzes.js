import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { TEACHER, STUDENT } from '../../../constants';

/**
 * Component that shows class information about its assigned quizzes
 * @type {Array}
 */
export default class GroupQuizzes extends Component {

  /**
   * Method creates and returns an array of the assinged quizzes for a class.
   * Shows only a message if there are no quizzes.
   * @return {array} Array of html elements
   */
  renderQuizzes() {
    const returnComponent = [];
    if (this.props.quizzes.length === 0) {
      returnComponent.push(<h4 className="elementList" key={'noquiz'}>There are no quizzes assigned to this class!</h4>);
    } else {
      let moreCounter = 0;
      this.props.quizzes.map((obj, index) => {
        if (index < 29) {
          returnComponent.push(
            <li className="elementList" key={`group_quiz_${obj.id}`}>
              <span><b> {obj.title} </b></span>
            </li>);
        } else {
          moreCounter += 1;
        }
        return 0;
      },
    );
      if (moreCounter > 0) {
        returnComponent.push(<h5 key={'morequiz'} >and {moreCounter} more</h5>);
      }
    }
    return returnComponent;
  }

  /**
   * Method that renders the Manage Quizzes Button only on Teacher Mode
   * @return {Object} component instance
   */
  renderManageButton() {
    if (this.props.userType === TEACHER) {
      return (
        <Button
          className="enjoy-css elementList"
          onClick={this.props.handleManageQuizzesFromClass}
        >
          Manage</Button>
      );
    }
    return (null);
  }

  /**
   * Component render method
   * @return {Object} component instance
   */
  render() {
    return (
      <div className="groupSectionWrapper">
        <div className="titleSection">
          {
            ((this.props.userType === TEACHER) && <h1>Quizzes</h1>) ||
            ((this.props.userType === STUDENT) && <h1>Assigned quizzes</h1>)
          }
        </div>
        <ul>
          { this.renderQuizzes() }
          { this.renderManageButton() }
        </ul>
      </div>
    );
  }
}

GroupQuizzes.propTypes = {
  userType: PropTypes.string.isRequired,
  quizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleManageQuizzesFromClass: PropTypes.func,
};

GroupQuizzes.defaultProps = {
  handleManageQuizzesFromClass: null,
};
