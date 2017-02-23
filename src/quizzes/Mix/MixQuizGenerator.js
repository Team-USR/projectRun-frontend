import React, { Component } from 'react';

export default class MixQuizGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      words: [],
      mainSolution: '',
      alternateSolution: [] };
    this.handleChange = this.handleChange.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  submitData() {
    const xd = this.state.value;
    const dataArray = xd.split('\n');
    const finalDataArray = dataArray.map(element => element.trim());
    for (let i = finalDataArray.length - 1; i >= 0; i -= 1) {
      if (finalDataArray[i] === '') {
        finalDataArray.splice(i, 1);
      }
    }
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
MixQuizGenerator.propTypes = {
  text: React.PropTypes.string.isRequired,
};