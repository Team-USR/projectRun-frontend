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

  renderAllQuizzes() {
    const result = [];
    const content = this.props.quizzes;
    if (this.props.userT === TEACHER) {
      const publishedContent = content.filter((item) => {
        if (item.published) {
          return (item);
        }
        return (null);
      });
      const unpublishedContent = content.filter((item) => {
        if (!item.published) {
          return (item);
        }
        return (null);
      });
      if (unpublishedContent.length > 0) {
        result.push(
          <h5
            key="unpublished"
            className="subtitleQuizzes"
          >
            <b>Unpublished quizzes</b>
          </h5>,
        );
      }
      unpublishedContent.map((item, index) =>
      result.push(
        <Button
          className="quizListItem"
          key={`unpublished${index + 1}`}
          onClick={() => this.props.onSideBarItemClick(item.id, panel)}
        >
          {item.title}
        </Button>,
   ),
  );
      if (publishedContent.length > 0) {
        result.push(<h5 key="published" className="subtitleQuizzes"><b>Published quizzes</b></h5>);
      }
      publishedContent.map((item, index) =>
      result.push(
        <Button
          className="quizListItem"
          key={`published${index + 1}`}
          onClick={() => this.props.onSideBarItemClick(item.id, panel)}
        >
          {item.title}
        </Button>,
        ),
      );
    }
    if (this.props.userT === STUDENT) {
      const notStartedContent = content.filter((item) => {
        if (item.status === 'not_started') {
          return (item);
        }
        return (null);
      });
      const inprogressContent = content.filter((item) => {
        if (item.status === 'in_progress') {
          return (item);
        }
        return (null);
      });
      const submittedContent = content.filter((item) => {
        if (item.status === 'submitted') {
          return (item);
        }
        return (null);
      });
      if (notStartedContent.length > 0) {
        result.push(<hr key={'hr1'} />);
        result.push(<h5
          key="notstarted"
          className="subtitleQuizzes"
        >
          <b>Not started quizzes</b>
        </h5>);
      }
      notStartedContent.map((item, index) =>
      result.push(
        <Button
          className="quizListItem"
          key={`nostarted${index + 1}`}
          onClick={() => this.props.onSideBarItemClick(item.id, panel)}
        >
          {item.title}
        </Button>,
       ),
      );
      if (inprogressContent.length > 0) {
        result.push(<hr key={'hr2'} />);
        result.push(<h5
          key="inprogress"
          className="subtitleQuizzes"
        >
          <b>In progress quizzes</b></h5>);
      }
      inprogressContent.map((item, index) =>
      result.push(
        <Button
          className="quizListItem"
          key={`inprogress${index + 1}`}
          onClick={() => this.props.onSideBarItemClick(item.id, panel)}
        >
          {item.title}
        </Button>,
       ),
      );
      if (submittedContent.length > 0) {
        result.push(<hr key={'hr3'} />);
        result.push(<h5 key="submitted" className="subtitleQuizzes"><b>Submitted quizzes</b></h5>);
      }
      submittedContent.map((item, index) =>
      result.push(
        <Button
          className="quizListItem"
          key={`submitted${index + 1}`}
          onClick={() => this.props.onSideBarItemClick(item.id, panel)}
        >
          {item.title}
        </Button>,
       ),
      );
    }
    return result;
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
          this.props.userT === STUDENT && (this.props.quizzes.length > 0) &&
            (<h5><b>Not started/ In progress/ Submitted quizzes</b></h5>)
          )
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
            {
            ((this.props.submittedQuizzes.length > 0) &&
              (<h5><b>Average marks for all quizzes</b></h5>))
            }
            <LineCh
              data={this.props.submittedQuizzes.sort((a, b) => compareSubmitDates(a.date, b.date))}
              color="grey"
            />
          </div>)
        }
        <div className="quizList" style={{ marginTop: margin }}>
          {
          (this.props.quizzes.length > 0 &&
            <h1><b>All quizzes</b></h1>)
          }
          {
          this.renderAllQuizzes()
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
