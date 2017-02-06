import React, { Component } from 'react';

class Choice extends Component {
  handleInputChange(event) {
   const target = event.target;
   const value = target.type === 'checkbox' ? target.checked : target.value;
   const name = target.name;
   this.setState({
     [name]: value
   });
 }
  render() {
    const { value, choiceText } = this.props;
      return (
          <div>
          <label htmlFor="0">
          <input type="checkbox" value={value} />
          {choiceText}
          </label>
          <br />
          </div>

     );
  }
}

export { Choice };
