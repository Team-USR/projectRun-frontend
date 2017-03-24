import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { PieCh, LineCh } from '../../Charts';
import { STUDENT, TEACHER } from '../../../constants';
import { formatDataForStudentQuizPie,
  formatDataForTeacherQuizPie, compareSubmitDates } from '../../../helpers';

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
          (<Col sm={8} smOffset={2}>
            <PieCh data={data} />
          </Col>)
          : <h3>You have {this.props.userT === STUDENT ? 'no assigned' : 'not created any'} quizzes.</h3>
        }
        <br />
        { this.props.userT === STUDENT &&
          (<Col sm={8} smOffset={1}>
            <LineCh
              data={this.props.submittedQuizzes.sort((a, b) => compareSubmitDates(a.date, b.date))}
              color="grey"
            />
          </Col>)
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
  submittedQuizzes: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    date: React.PropTypes.string,
    score: React.PropTypes.number,
  })).isRequired,
  userT: React.PropTypes.string.isRequired,
};
