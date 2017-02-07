import React, { Component } from 'react';

class Question extends Component {
render() {
 const { id, question } = this.props;
  return (
      <h3>{id}. {question}</h3>
  );
}
}

export { Question };
