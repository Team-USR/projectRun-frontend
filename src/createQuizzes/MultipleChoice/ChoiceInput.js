import React, { Component } from 'react';
import { TextInput } from './index'

class ChoiceInput extends Component {

  render() {
    return (
      <div>
      <TextInput text='choice' />
      <input type='checkbox'/>
      </div>
    );
  }
}

export { ChoiceInput };
