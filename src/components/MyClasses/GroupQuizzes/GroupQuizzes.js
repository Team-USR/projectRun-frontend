import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { TEACHER } from '../../../constants';

export default class GroupQuizzes extends Component {

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

  render() {
    return (
      <div className="groupSectionWrapper">
        <div className="titleSection">
          <h1>Quizzes</h1>
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
