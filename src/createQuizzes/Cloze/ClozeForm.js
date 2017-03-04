import React from 'react';
import { Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap';

export default class ClozeForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderQuestion = this.renderQuestion.bind(this);
  }

  renderQuestion() {
    this.props.addQuestion(this.content.value);
    this.content.value = '';
  }

  render() {
    return (
      <form>
        <FormGroup>
          <InputGroup>
            <FormControl inputRef={(input) => { this.content = input; }} type="text" />
            <InputGroup.Button>
              <Button onClick={this.renderQuestion}>+</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </form>
    );
  }
}

ClozeForm.propTypes = {
  addQuestion: React.PropTypes.func.isRequired,
};
