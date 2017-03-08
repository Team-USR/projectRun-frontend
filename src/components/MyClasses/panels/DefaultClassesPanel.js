import React, { PropTypes, Component } from 'react';

export default class DefaultClassesPanel extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <h1><b>My Classes</b></h1>
        <hr />
        <h3>You currently have {this.props.numberOfClasses} classes</h3>
      </div>
    );
  }
}

DefaultClassesPanel.propTypes = {
  numberOfClasses: PropTypes.number.isRequired,
};
