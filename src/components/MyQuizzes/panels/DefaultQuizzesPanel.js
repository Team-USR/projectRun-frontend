import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { PieCh, LineCh } from '../../Charts';
import { STUDENT, TEACHER } from '../../../constants';
import { formatDataForStudentQuizPie,
  formatDataForTeacherQuizPie, compareSubmitDates } from '../../../helpers';

let margin = 600;
let panel = 'default';
export default class DefaultQuizzesPanel extends Component {

  constructor() {
    super();
    this.state = {
      type: null,
    };
  }
  render() {
    let data = [];
    if (this.props.userT === STUDENT) {
      data = formatDataForStudentQuizPie(this.props.quizzes);
      margin = 1000;
      panel = 'sessions';
    } else if (this.props.userT === TEACHER) {
      margin = 600;
      data = formatDataForTeacherQuizPie(this.props.quizzes);
      panel = 'reviewer';
    }
    return (
      <div className="">
        <h1><b>Statistics</b></h1>
        {
          (this.props.userT === TEACHER && (
            <h5><b>Published/Unpublished quizzes</b></h5>
          )) || (
          this.props.userT === STUDENT && (
            <h5><b>Not started/ In progress/ Submitted quizzes</b></h5>
          ))
        }

        <hr />
        {this.props.quizzes.length > 0 ?
          (<div className="pie-chart-container">
            <PieCh data={data} />
          </div>)
          : <h3>You have {this.props.userT === STUDENT ? 'no assigned' : 'not created any'} quizzes.</h3>
        }
        <br />
        { this.props.userT === STUDENT &&
          (<div className="line-chart-container">
            <h5><b>Average marks for all quizzes</b></h5>
            <LineCh
              data={this.props.submittedQuizzes.sort((a, b) => compareSubmitDates(a.date, b.date))}
              color="grey"
            />
          </div>)
        }
        <div className="quizList" style={{ marginTop: margin }}>
          {
          (this.props.quizzes.length > 0 &&
            <h5><b>All quizzes</b></h5>)
          }
          {
          this.props.quizzes.map((item, index) =>
             (
               <Button
                 className="quizListItem"
                 key={`quiz${index + 1}`}
                 onClick={() => this.props.onSideBarItemClick(item.id, panel)}
               >
                 {item.title}
               </Button>
            ),
          )
        }
        </div>
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
  onSideBarItemClick: React.PropTypes.func.isRequired,
};
