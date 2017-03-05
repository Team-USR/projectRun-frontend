import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default function StudentManager(props) {
  return (
    <div className="StudentManager">
      <span> {props.name} </span>
      <Button onClick={() => props.removeStudent(props.studentId)}>
      X </Button>
    </div>
  );
}

StudentManager.propTypes = {
  name: PropTypes.string.isRequired,
  removeStudent: PropTypes.func.isRequired,
  studentId: PropTypes.number.isRequired,
};
