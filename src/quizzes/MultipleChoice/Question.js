import React, { Component } from 'react';

class Question extends Component {
render() {
 const { index, question } = this.props;
  return (
      <h3>{index}. {question}</h3>
  );
}
}

export { Question };
