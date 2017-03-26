import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class ModalError extends Component {

  renderButtons() {
    const buttonsWrapper = [];

    const buttons = this.props.content.buttons;
    if (buttons.indexOf('close') !== -1) {
      buttonsWrapper.push((
        <Button
          key={'close_button'}
          onClick={() => this.props.close()}
        >
          Close
        </Button>
      ));
    }
    if (buttons.indexOf('clear') !== -1) {
      buttonsWrapper.push((
        <Button
          key={'clear_button'}
          onClick={() => this.props.confirmClearBoard()}
        >
          Clear Board
        </Button>
      ));
    }
    if (buttons.indexOf('generate') !== -1) {
      buttonsWrapper.push((
        <Button
          key={'generate_button'}
          onClick={() => this.props.confirmGenerateBoard()}
        >
          Generate Board
        </Button>
      ));
    }

    return buttonsWrapper;
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={() => this.props.close()}>
        <Modal.Header closeButton>
          <Modal.Title>
            { this.props.content.header }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>
            {this.props.content.body}
          </h4>
        </Modal.Body>
        <Modal.Footer>
          { this.renderButtons() }
        </Modal.Footer>
      </Modal>
    );
  }
}

ModalError.propTypes = {
  show: PropTypes.bool.isRequired,
  content: PropTypes.shape({
    header: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  close: PropTypes.func.isRequired,
  confirmClearBoard: PropTypes.func,
  confirmGenerateBoard: PropTypes.func,
};

ModalError.defaultProps = {
  confirmClearBoard: null,
  confirmGenerateBoard: null,
};
