import React, { PropTypes, Component } from 'react';
import { Button, Col, NavItem } from 'react-bootstrap';
import { QuizManager } from '../GroupQuizzes';

export default class QuizzesPanel extends Component {

  constructor() {
    super();
    this.state = {
      selectedQuizzes: [],
      availableQuizzes: [],
      filteredSelected: [],
      filteredAvailable: [],
      filterAllQuizzes: [],
      currentlySearched: '',
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillMount() {
    this.setState({
      selectedQuizzes: this.props.quizzes,
      allQuizzes: this.props.allQuizzes,
      availableQuizzes: this.getAvailableQuizzes(this.props.allQuizzes),
    });
//    console.log("AVAILABLE", this.props.quizzes);
    this.filterItems('');
  }
  getAvailableQuizzes(all) {
    const newQuizzesObj = {};
    this.props.quizzes.map((obj) => {
      newQuizzesObj[obj.id] = obj.title;
      return 0;
    });

    return all.filter((obj) => {
      if (!newQuizzesObj[obj.id]) {
        return true;
      }
      return false;
    });
  }
  filterItems(value) {
    this.setState({ currentlySearched: value });
    let found = false;
    let filter = [];
    this.props.allQuizzes.map((item) => {
      if (item.title.toLowerCase() === value.toLowerCase() ||
          item.title.toLowerCase().includes(value.toLowerCase())) {
        found = true;
        const result = { id: item.id, title: item.title };
        filter.push(result);
      }
      return (null);
    });
    if (!found && value !== '') {
      filter = [];
    } else
    if (filter.length === 0 || value === '') {
      filter = this.props.allQuizzes.map((item) => {
        const result = { id: item.id, title: item.title };
        return result;
      });
    }
    let foundSelected = false;
    let filterSelected = this.props.quizzes.filter((item) => {
      if (item.title.toLowerCase() === value.toLowerCase() ||
          item.title.toLowerCase().includes(value.toLowerCase())) {
        foundSelected = true;
        return (item);
      }
      return (null);
    });
    if (!foundSelected && value !== '') {
      filterSelected = [];
    } else
    if (filterSelected.length === 0 || value === '') {
      filterSelected = this.props.quizzes;
    }

    this.setState({
      allQuizzes: filter,
      filteredAvailable: this.getAvailableQuizzes(filter),
      filteredSelected: filterSelected,
    });
  }
  handleSearch(event) {
    this.filterItems(event.target.value);
    this.setState({ currentSearched: event.target.value });
  }
  addQuiz(id) {
    let newIndex = -1;
    this.state.availableQuizzes.map((item, index) => {
      if (item.id === id) {
        newIndex = index;
      }
      return (-1);
    });
    const newQuizzesObj = this.state.selectedQuizzes;
    newQuizzesObj.push(this.state.availableQuizzes[newIndex]);

    const newAvailableQuizzesObj = this.state.availableQuizzes;
    newAvailableQuizzesObj.splice(newIndex, 1);

    this.setState({
      selectedQuizzes: newQuizzesObj,
      availableQuizzes: newAvailableQuizzesObj,
    });
    this.filterItems(this.state.currentlySearched);
  }
  removeQuiz(id) {
    let newIndex = -1;
    this.state.selectedQuizzes.map((item, index) => {
      if (item.id === id) {
        newIndex = index;
      }
      return (-1);
    });
    const newAvailableQuizzesObj = this.state.availableQuizzes;
    newAvailableQuizzesObj.push(this.state.selectedQuizzes[newIndex]);

    const newQuizzesObj = this.state.selectedQuizzes;
    newQuizzesObj.splice(newIndex, 1);

    this.setState({
      selectedQuizzes: newQuizzesObj,
      availableQuizzes: newAvailableQuizzesObj,
    });
    this.filterItems(this.state.currentlySearched);
  }
  renderSearchBar() {
    return (
      <NavItem key={'searchBar'} >
        <input
          className="searchBarItem"
          id="searchBar"
          type="text"
          placeholder="Search for a quiz"
          onChange={this.handleSearch}
        />
      </NavItem>
    );
  }
  renderSelectedQuizzes() {
    if (this.state.selectedQuizzes.length === 0) {
      return <h4>There are no quizzes assigned to this class!</h4>;
    }
    return this.state.filteredSelected.map((obj, index) =>
      <li key={`class_selected_quiz_${obj.id}`}>
        <QuizManager
          type={'remove'}
          id={obj.id}
          index={index}
          title={obj.title}
          removeQuiz={() => this.removeQuiz(obj.id)}
        />
      </li>,
    );
  }

  renderAvailableQuizzes() {
    if (this.state.availableQuizzes.length === 0) {
      return <h4>All your quizzes have been assigned!</h4>;
    }
    return this.state.filteredAvailable.map((obj, index) =>
      <li key={`class_available_quiz_${obj.id}`}>
        <QuizManager
          type={'add'}
          id={obj.id}
          index={index}
          title={obj.title}
          addQuiz={() => this.addQuiz(obj.id)}
        />
      </li>,
    );
  }

  render() {
    return (
      <div className="quizPanelWrapper">
        <Col md={12}>
          <h3>Manage assigned quizzes</h3>
        </Col>
        <Col md={12} className="quizzesList">
          { this.renderSearchBar() }
          <Col md={6}>
            <ul>
              { this.renderSelectedQuizzes() }
            </ul>
          </Col>
          <Col md={6}>
            <ul>
              { this.renderAvailableQuizzes() }
            </ul>
          </Col>
        </Col>
        <Col md={12}>
          <hr />
          <Button
            className="enjoy-css"
            onClick={() =>
              this.props.handleSaveAssignedQuizzes(this.state.selectedQuizzes)}
          > Save </Button>
        </Col>
      </div>
    );
  }
}

QuizzesPanel.propTypes = {
  quizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allQuizzes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSaveAssignedQuizzes: PropTypes.func.isRequired,
};
