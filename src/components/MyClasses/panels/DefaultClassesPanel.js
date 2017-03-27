import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { STUDENT, TEACHER } from '../../../constants';
import { LineCh } from '../../Charts';

let margin = 0;
export default class DefaultClassesPanel extends Component {

  renderHeader() {
    if (this.props.userType === TEACHER) {
      margin = 600;
      return <h3>You currently have {this.props.numberOfClasses} classes</h3>;
    }
    if (this.props.userType === STUDENT) {
      margin = 0;
      return <h3>You are currently enrolled in {this.props.numberOfClasses} classes</h3>;
    }
    return (null);
  }

  renderCharts() {
    if (this.props.userType === TEACHER) {
      if (this.props.averagePerCreatedClass.length > 0) {
        return (
          <div className="line-chart-container">
            <LineCh
              data={this.props.averagePerCreatedClass.filter(myClass =>
                myClass.value !== null)}
              color="grey"
            />
          </div>
        );
      }
      return (<h4>Statistics will be available as soon as you create a class,
         publish a quiz and someone will solve your quizzes.</h4>);
    }
    return '';
  }
  renderAllClasses() {
    return this.props.classes.map((item, index) =>
       (
         <Button
           className="quizListItem"
           key={`quiz${index + 1}`}
           onClick={() => this.props.handleSideBarClassClick(item.id.toString(), item.name)}
         >
           {item.name}
         </Button>
      ),
    );
  }

  render() {
    return (
      <div>
        <h1><b>Statistics</b></h1>
        { this.renderHeader() }
        { this.renderCharts() }
        <div className="quizList" style={{ marginTop: margin }}>
          {
            (this.props.classes.length > 0 &&
              <h1 style={{ marginTop: 50 }}><b>All classes</b></h1>)
          }
          { this.renderAllClasses()}
        </div>
      </div>
    );
  }
}

DefaultClassesPanel.propTypes = {
  userType: PropTypes.string.isRequired,
  numberOfClasses: PropTypes.number.isRequired,
  averagePerCreatedClass: PropTypes.arrayOf(React.PropTypes.shape({
    className: PropTypes.string,
    average: PropTypes.string,
  })),
  classes: PropTypes.arrayOf(React.PropTypes.shape({})).isRequired,
  handleSideBarClassClick: PropTypes.func.isRequired,
};

DefaultClassesPanel.defaultProps = {
  averagePerCreatedClass: [],
};
