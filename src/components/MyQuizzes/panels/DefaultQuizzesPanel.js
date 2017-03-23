import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { PieCh } from '../../Charts';
import { STUDENT, TEACHER } from '../../../constants';
import { formatDataForStudentQuizPie,
  formatDataForTeacherQuizPie } from '../../../helpers';

export default class DefaultQuizzesPanel extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    let data = [];
    if (this.props.userT === STUDENT) {
      data = formatDataForStudentQuizPie(this.props.quizzes);
    } else if (this.props.userT === TEACHER) {
      data = formatDataForTeacherQuizPie(this.props.quizzes);
    }
    return (
      <div>
        <h1><b>My Quizzes</b></h1>
        <hr />
        {this.props.quizzes.length > 0 ?
          (<Col xs={8} xsOffset={2}>
            <PieCh data={data} />
          </Col>)
          : <h3>You have {this.props.userT === STUDENT ? 'no assigned' : 'not created any'} quizzes.</h3>
        }
      </div>
    );
  }

}

DefaultQuizzesPanel.propTypes = {
  quizzes: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number,
    status: React.PropTypes.string,
    title: React.PropTypes.String,
  })).isRequired,
  userT: React.PropTypes.string.isRequired,
};
