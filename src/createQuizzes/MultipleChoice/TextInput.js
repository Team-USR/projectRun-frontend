import React, {Component} from 'react';

class TextInput extends Component{
  constructor(props){
    super(props);
    this.state ={value: ''};
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
   this.setState({value: event.target.value});
  }
render(){

  return(
        <label>
          {this.props.text}
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
  
  );
}



};

export {TextInput};
