import React, { PropTypes, Component } from 'react';
import { Button, Col, NavItem } from 'react-bootstrap';
import { QuizManager } from '../GroupQuizzes';

/**
 * Component that manages the quizzes assigned to a class
 * @type {Object}
 */
export default class QuizzesPanel extends Component {
  /**
   * Component constructor
   */
  constructor() {
    super();
    this.state = {
      selectedQuizzes: [],
      availableQuizzes: [],
      filteredSelected: [],
      filteredAvailable: [],
      filterAllQuizzes: [],
      currentlySearched: '',
      maxselected: 10,
      maxavailable: 10,
    };
    this.handleSearch = this.handleSearch.bind(this);
  }
  /**
   * Method that sets state from props before the component mounts
   */
  componentWillMount() {
    this.setState({
      selectedQuizzes: this.props.quizzes,
      allQuizzes: this.props.allQuizzes,
      availableQuizzes: this.getAvailableQuizzes(this.props.allQuizzes),
    });
    this.filterItems('');
  }
  /**
   * Returns a lost of the available quizzes based on an array received as a
   * parameter.
   * @param  {Array} all array of objects describing quizzes id and title
   * @return {Array}     array of objects
   */
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
  /**
   * Filters Quizzes based on the current input in the search bar.
   * @param  {String} value input value
   */
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
  /**
   * Event handler that updates the state
   * @param  {event} event event containing the new value
   */
  handleSearch(event) {
    this.filterItems(event.target.value);
    this.setState({ currentSearched: event.target.value });
  }
  /**
   * Adds the quiz with the id received as a parameter.
   * @param {Number} id Quiz id
   */
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
  /**
   * Removes the quiz with the id received as a parameter
   * @param  {Number} id Quiz id
   */
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
  /**
   * Shows more quizzes depending on the type received as a parameter
   * @param  {String} listType selected or available
   */
  showMore(listType) {
    this.listType = listType;
    if (listType === 'selected') {
      if (this.state.maxavailable < this.state.filteredSelected.length) {
        const newValue = this.state.maxselected + 5;
        this.setState({ maxselected: newValue });
      }
    }
    if (listType === 'available') {
      if (this.state.maxavailable < this.state.filteredAvailable.length) {
        const newValue = this.state.maxavailable + 5;
        this.setState({ maxavailable: newValue });
      }
    }
  }
  /**
   * Shows less in the selected quizzes column or available based on the type
   * received as a parameter
   * @param  {String} listType selected or available
   */
  showLess(listType) {
    this.listType = listType;
    if (listType === 'selected') {
      if (this.state.maxselected > 10) {
        const newValue = this.state.maxselected - 5;
        this.setState({ maxselected: newValue });
      }
    }
    if (listType === 'available') {
      if (this.state.maxavailable > 10) {
        const newValue = this.state.maxavailable - 5;
        this.setState({ maxavailable: newValue });
      }
    }
  }
  /**
   * Renders a specific html element based on the type received as a
   * parameter
   * @param  {String} listType selected or available
   * @return {Object}          html element containing show more/less buttons
   */
  handleListButton(listType) {
    this.listType = listType;
    const element = [];
    const nullelement = (
      <div key={`null${listType}`}>
        <Col md={6} />
      </div>
    );
    const showLess = (
      <div key={`sbu${listType}`} className="leftButton">
        <Col md={6}>
          <Button
            key={`selectedButton${listType}`}
            className="enjoy-css"
            onClick={() =>
                this.showLess(listType)}
          >
            <span className="glyphicon glyphicon-chevron-up" aria-hidden="true" />
          </Button>
        </Col>
      </div>
    );
    const showMore = (
      <div key={`abu${listType}`} className="rightButton">
        <Col md={6}>
          <Button
            key={`availablebutton${listType}`}
            className="enjoy-css"
            onClick={() =>
            this.showMore(listType)}
          >
            <span className="glyphicon glyphicon-chevron-down" aria-hidden="true" />
          </Button>
        </Col>
      </div>
    );

    if (listType === 'selected') {
      if (this.state.filteredSelected.length >= 10) {
        if (this.state.filteredSelected.length > 0) {
          if (this.state.filteredSelected.length > this.state.maxselected) {
            if (this.state.maxselected === 10) {
              element.push(nullelement);
              element.push(showMore);
            } else {
              element.push(showLess);
              element.push(showMore);
            }
          }
          if (this.state.filteredSelected.length < this.state.maxselected) {
            element.push(showLess);
            element.push(nullelement);
          }
        }
      }
    }
    if (listType === 'available') {
      if (this.state.filteredAvailable.length >= 10) {
        if (this.state.filteredAvailable.length > this.state.maxavailable) {
          if (this.state.maxavailable === 10) {
            element.push(nullelement);
            element.push(showMore);
          } else {
            element.push(showLess);
            element.push(showMore);
          }
        }
        if (this.state.filteredAvailable.length < this.state.maxavailable) {
          element.push(showLess);
          element.push(nullelement);
        }
      }
    }
    return element;
  }
  /**
   * Renders the quizzes available for a class
   * @return {Object} html entity containing the quizzes available for a
   * class
   */
  renderAvailableQuizzes() {
    if (this.state.availableQuizzes.length === 0) {
      return <h4>All your quizzes have been assigned!</h4>;
    }
    let counter = 0;
    return this.state.filteredAvailable.map((obj, index) => {
      if (index < this.state.maxavailable) {
        return (
          <li key={`class_available_quiz_${obj.id}`}>
            <QuizManager
              type={'add'}
              id={obj.id}
              index={index}
              title={obj.title}
              addQuiz={() => this.addQuiz(obj.id)}
            />
          </li>);
      }
      counter += 1;
      if (index === this.state.filteredAvailable.length - 1) {
        return (<h5 key={'counteravailable'}> and {counter} more</h5>);
      }
      return (null);
    },
    );
  }
  /**
   * Renders the quizzes selected for a class
   * @return {Object} html entity containing the selected quizzes in a certain
   * class
   */
  renderSelectedQuizzes() {
    if (this.state.selectedQuizzes.length === 0) {
      return <h4>There are no quizzes assigned to this class!</h4>;
    }
    let counter = 0;
    return this.state.filteredSelected.map((obj, index) => {
      if (index < this.state.maxselected) {
        return (
          <li key={`class_selected_quiz_${obj.id}`}>
            <QuizManager
              type={'remove'}
              id={obj.id}
              index={index}
              title={obj.title}
              removeQuiz={() => this.removeQuiz(obj.id)}
            />
          </li>);
      }counter += 1;
      if (index === this.state.filteredSelected.length - 1) {
        return (<h5 key={'counterselected'}> and {counter} more</h5>);
      }
      return (null);
    },
    );
  }
  /**
   * Renders the search bar user for searching quizzes
   * @return {Object} html entity containing an input
   */
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
  /**
   * Component render method
   * @return {Object} Component instance
   */
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
              <li className="expandCollapseButtonsPanel">
                { this.handleListButton('selected') }
              </li>
            </ul>
          </Col>
          <Col md={6}>
            <ul>
              { this.renderAvailableQuizzes() }
              <li className="expandCollapseButtonsPanel">
                { this.handleListButton('available') }
              </li>
            </ul>
          </Col>
        </Col>
        <Col md={12}>
          <hr />
          <Button
            className="enjoy-css"
            onClick={() =>
              this.props.handleSaveAssignedQuizzes(this.state.selectedQuizzes)}
          >
            Save
          </Button>
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
