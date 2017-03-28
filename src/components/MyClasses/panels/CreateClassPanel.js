import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
/**
 * Component handling creating a class
 * @type {Object}
 */
export default class CreateClassPanel extends Component {
  /**
   * Component constructor
   */
  constructor() {
    super();
    this.state = {
      newClassTitle: '',
    };
  }
  /**
   * Event handler to update the state
   * @param  {Event} e event containing the new value
   */
  handleInputChange(e) {
    this.setState({ newClassTitle: e.target.value });
  }
  /**
   * Component main render method
   * @return {Object} Component instance
   */
  render() {
    return (
      <div>
        <h1><b> Create a new class</b></h1>
        <hr />
        <div className="container text-left">
          <div className="col-md-8 col-md-push-2">
            <div className="form-group">
              <label htmlFor="name">Name of group</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name of the new group"
                onChange={e => this.handleInputChange(e)}
              />
            </div>
            <Button
              onClick={() => this.props.handleSaveNewClassClick(this.state.newClassTitle)}
              bsStyle="success"
            >
              Create Group
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

CreateClassPanel.propTypes = {
  handleSaveNewClassClick: PropTypes.func.isRequired,
};
