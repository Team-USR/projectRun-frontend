import React from 'react';
import { Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import { GAP_MATCHER, HINT_MATCHER } from '../../constants';

export default class ClozeForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      valid: false,
    };

    this.renderQuestion = this.renderQuestion.bind(this);
    this.checkIfValid = this.checkIfValid.bind(this);
  }

  checkIfValid() {
    const toAdd = this.content.value;
    if ((toAdd.match(new RegExp(GAP_MATCHER, 'g')) || []).length ===
        (toAdd.match(new RegExp(HINT_MATCHER, 'g')) || []).length) {
      this.setState({ valid: true });
    } else {
      this.setState({ valid: false });
    }
  }

  renderQuestion() {
    if (this.content.value) {
      this.props.addQuestion(this.content.value);
      this.content.value = '';
      this.setState({ valid: false });
    }
  }

  render() {
    return (
      <form>
        <FormGroup>
          <InputGroup>
            <FormControl
              inputRef={(input) => { this.content = input; }}
              onChange={() => this.checkIfValid()}
              type="text"
              placeholder="ex: This {is}*to be* awesome!"
            />
            <InputGroup.Button>
              <Button onClick={this.renderQuestion} disabled={!this.state.valid}>+</Button>
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
