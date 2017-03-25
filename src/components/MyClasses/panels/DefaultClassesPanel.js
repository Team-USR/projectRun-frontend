import React, { PropTypes, Component } from 'react';
import { STUDENT, TEACHER } from '../../../constants';
import { LineCh } from '../../Charts';

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

  renderCharts() {
    if (this.props.userType === TEACHER) {
      if (this.props.averagePerCreatedClass.length > 0) {
        return (
          <div className="col-md-9">
            <LineCh
              data={this.props.averagePerCreatedClass.filter(myClass =>
                myClass.value !== null)}
              color="grey"
            />
          </div>
        );
      }
      return <h3>You either have no classes created or no quizzes published.</h3>;
    }
    return '';
  }

  render() {
    return (
      <div>
        <h1><b>My Classes</b></h1>
        <hr />
        { this.renderHeader() }
        <hr />
        { this.renderCharts() }
      </div>
    );
  }
}

DefaultClassesPanel.propTypes = {
  userType: PropTypes.string.isRequired,
  numberOfClasses: PropTypes.number.isRequired,
  averagePerCreatedClass: PropTypes.arrayOf(React.PropTypes.shape({
    className: PropTypes.string,
    average: PropTypes.number,
  })),
};

DefaultClassesPanel.defaultProps = {
  averagePerCreatedClass: [],
};
