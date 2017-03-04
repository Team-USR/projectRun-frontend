import React from 'react';
import { Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap';

export default function ClozeForm(props) {
  return (
    <form>
      <FormGroup>
        <InputGroup>
          <FormControl type="text" />
          <InputGroup.Addon>
            <Button onClick={props.addQuestion}>+</Button>
          </InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    </form>
  );
}

ClozeForm.propTypes = {
  addQuestion: React.PropTypes.func.isRequired,
};
