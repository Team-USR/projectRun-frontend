import React, { Component } from 'react';
import Papa from 'papaparse';
import { Button } from 'react-bootstrap';

export default class StudentsPanel extends Component {
  constructor() {
    super();
    this.state = { value: '',
      file: {},
      errorMessage: '',
      csvData: [],
    };
    this.changeInput = this.changeInput.bind(this);
    this.importCSV = this.importCSV.bind(this);
    this.parseFile = this.parseFile.bind(this);
  }

  changeInput(event) {
    this.setState({ value: event.target.value });
  }

  importCSV() {
    let fileToParse = this.csv.files[0];
    if (fileToParse === undefined) {
      fileToParse = {};
      this.setState({ csvData: [] });
    }
    this.setState({ file: fileToParse, errorMessage: '' });
    console.log(fileToParse);
  }

  parseFile() {
    if (Object.keys(this.state.file).length === 0 && this.state.file.constructor === Object) {
      this.setState({ errorMessage: 'File input cannot be empty!' });
      console.log('empty object');
      return;
    }
    console.log('not empty');
    Papa.parse(this.state.file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        console.log(results.data[0].email);
        const emptyArray = [];
        results.data.map(object =>
          emptyArray.push(object.email),
        );
        this.setState({ csvData: emptyArray });
      },
    });
  }

  showCsvData() {
    const emptyArray = [];
    this.state.csvData.map((email, index) => {
      const ind = index;
      emptyArray.push(
        <li key={`student_email_${ind}`}>
          {email}
        </li>,
      );
      return ('');
    });
    return emptyArray;
  }

  showAddButton() {
    if (this.state.csvData.length !== 0) {
      return (<Button> Add students to class</Button>);
    }
    return ('');
  }

  render() {
    return (
      <div className="studentsPanelContainer">
        <form>
          <input value={this.state.value} onChange={this.changeInput} />
          <input type="file" style={{ marginLeft: '500px' }} ref={(csvfile) => { this.csv = csvfile; }} accept=".csv" onChange={this.importCSV} />
          <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
          <Button onClick={this.parseFile}>Ghici ciuperca</Button>
          <ul>{this.showCsvData()}</ul>
          {this.showAddButton()}
        </form>
      </div>
    );
  }
}
