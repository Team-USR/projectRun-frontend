import React, { PropTypes, Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class ModalError extends Component {

  renderButtons() {
    const buttonsWrapper = [];

    const buttons = this.props.content.buttons;
    const modalProps = this.props.content.modalProps;
    if (buttons.indexOf('close') !== -1) {
      buttonsWrapper.push((
        <Button
          key={'close_button'}
          className="closeButton"
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
          className="clearButton"
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
          className="generateButton"
          onClick={() => this.props.confirmGenerateBoard()}
        >
          Generate Board
        </Button>
      ));
    }
    if (buttons.indexOf('deleteClass') !== -1) {
      let classId = 0;
      if (modalProps && modalProps.classId) {
        classId = modalProps.classId;
      }
      buttonsWrapper.push((
        <Button
          key={'deleteClass_button'}
          className="deleteButton"
          onClick={() => this.props.confirmDeleteClass(classId)}
        >
          Delete Class
        </Button>
      ));
    }
    if (buttons.indexOf('deleteQuiz') !== -1) {
      let quizId = 0;
      if (modalProps && modalProps.quizId) {
        quizId = modalProps.quizId;
      }
      buttonsWrapper.push((
        <Button
          key={'deleteQuiz_button'}
          className="deleteButton"
          onClick={() => this.props.confirmDeleteQuiz(quizId)}
        >
          Delete Quiz
        </Button>
      ));
    }
    if (buttons.indexOf('ok') !== -1) {
      buttonsWrapper.push((
        <Button
          key={'ok_button'}
          className="okButton"
          onClick={() => this.props.close()}
        >
          OK
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
            <b>
              { this.props.content.header }
            </b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            {this.props.content.body}
          </h5>
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
    modalProps: PropTypes.shape({
      classId: PropTypes.string,
    }),
  }).isRequired,
  close: PropTypes.func.isRequired,
  confirmClearBoard: PropTypes.func,
  confirmGenerateBoard: PropTypes.func,
  confirmDeleteClass: PropTypes.func,
  confirmDeleteQuiz: PropTypes.func,
};

ModalError.defaultProps = {
  confirmClearBoard: null,
  confirmGenerateBoard: null,
  confirmDeleteClass: null,
  confirmDeleteQuiz: null,
};
