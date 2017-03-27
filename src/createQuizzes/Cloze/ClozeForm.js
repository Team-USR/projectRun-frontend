import React from 'react';
import { Button, FormGroup, InputGroup, FormControl, Col, ControlLabel } from 'react-bootstrap';
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
    if (toAdd.match(GAP_MATCHER) && (toAdd.match(new RegExp(GAP_MATCHER, 'g')) || []).length ===
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
      <FormGroup>
        <Col mdOffset={1} md={2}>
          <ControlLabel>To be solved</ControlLabel>
        </Col>
        <Col md={8}>
          <InputGroup>
            <FormControl
              inputRef={(input) => { this.content = input; }}
              onChange={() => this.checkIfValid()}
              type="text"
              placeholder="ex: This {is}*to be* awesome!"
            />
            <InputGroup.Button>
              <Button
                onClick={this.renderQuestion}
                style={{ height: '34px' }}
                disabled={!this.state.valid}
              >
                <i className="fa fa-plus" style={{ color: '#2ed146' }} aria-hidden="true" />
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </Col>
      </FormGroup>
    );
  }
}

ClozeForm.propTypes = {
  addQuestion: React.PropTypes.func.isRequired,
};
