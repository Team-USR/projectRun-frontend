import React, { Component } from 'react';

class MixQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '', words: [] };
    this.handleChange = this.handleChange.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    const currentString = event.target.value;
    if (currentString.endsWith('\n')) {
      console.log('newline found');
    }
  }
  submitData() {
    const xd = this.state.value;
    const dataArray = xd.split('\n');
    const finalDataArray = dataArray.map(element => element.trim());
    for (let i = finalDataArray.length - 1; i >= 0; i--) {
      if (finalDataArray[i] === '') {
        finalDataArray.splice(i, 1);
      }
    }
    console.log(finalDataArray);
  }
  render() {
    return (
      <div className="mixQuizContainer">
        <h1> MixQuiz title</h1>
        <div className="mixQuizContainer">
          <div className="mixQuizInput">
            { this.props.text }
            <textarea value={this.state.value} rows="10" cols="30" onChange={this.handleChange} />
          </div>
          <button type="button" onClick={this.submitData}>Create Quiz</button>
        </div>
      </div>
    );
  }
}
MixQuiz.propTypes = {
  text: React.PropTypes.string.isRequired,
};

export { MixQuiz };
