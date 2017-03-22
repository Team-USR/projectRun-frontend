import React, { PropTypes, Component } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';
import plusSign from '../../assets/images/plus.svg';
import { TEACHER, STUDENT } from '../../constants';

export default class SideBarClasses extends Component {
  constructor() {
    super();
    this.filterItems = this.filterItems.bind(this);
    this.state = {
      content: {},
    };
  }
  componentWillMount() {
    this.setState({ content: this.props.content });
  }
  componentsWillReceiveProps(nextProps) {
    this.setState({ content: nextProps.content });
  }
  filterItems(event) {
    let found = false;
    let filteredContent = this.props.content.filter((item) => {
      if (item.name.toLowerCase() === event.target.value.toLowerCase() ||
          item.name.toLowerCase().includes(event.target.value.toLowerCase())) {
        found = true;
        return (item);
      }
      return (null);
    });
    if (!found && event.target.value !== '') {
      filteredContent = [];
    } else
    if (filteredContent.length === 0 || event.target.value === '') {
      filteredContent = this.props.content;
    }
    this.setState({ content: filteredContent });
  }
  renderSearchBar() {
    return (
      <NavItem key={'searchBar'} >
        <input
          className="searchBarItem"
          id="searchBar"
          type="text"
          placeholder="Search for a class"
          onChange={this.filterItems}
        />
      </NavItem>
    );
  }

  renderSearchButton() {
    if (this.props.userType === STUDENT) {
      return (
        <div>
          <Button onClick={() => this.props.handleSearchClassForRequestInvite()}>
            Find a new Class
            </Button>
        </div>
      );
    }
    return (null);
  }

  render() {
    let createClassButton = (null);
    if (this.props.userType === TEACHER) {
      createClassButton =
      (
        <NavItem>
          <Button className="titleButton" onClick={() => this.props.onCreateClassClick()}>
            <div className="row">
              <div className="col-md-3 plusIconWrapper">
                <img className="plusIcon" src={plusSign} alt={'+'} />
              </div>
              <div className="col-md-9 createText">
                Create Class
              </div>
            </div>
          </Button>
        </NavItem>
      );
    }
    let classesCounter = 0;
    let maxDisplayed = 15;
    if (this.state.content.length - maxDisplayed >= 1) {
      maxDisplayed -= 1;
    }
    return (
      <div>
        { this.renderSearchButton() }
        { this.renderSearchBar() }
        <Nav>
          { createClassButton }
          {
         this.state.content.map((obj, index) => {
           if (index < maxDisplayed) {
             return (
               <NavItem className="classesNav" key={`class_${obj.id}`}>
                 <Button
                   className="sideBarButton"
                   onClick={() => this.props.onClassClick(obj.id.toString(), obj.name)}
                 >
                   {obj.name}
                 </Button>
               </NavItem>
             );
           } classesCounter += 1;
           if (index === this.state.content.length - 1) {
             return (
               <NavItem className="classesNav" key={'moreClasses'}>
                 <h5> and {classesCounter} more...</h5>
               </NavItem>
             );
           }
           return (null);
         },
         )
       }
        </Nav>
      </div>
    );
  }
}

SideBarClasses.propTypes = {
  userType: PropTypes.string.isRequired,
  onCreateClassClick: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClassClick: PropTypes.func,
  handleSearchClassForRequestInvite: PropTypes.func,
};
SideBarClasses.defaultProps = {
  onCreateClassClick: null,
  onClassClick: null,
  handleSearchClassForRequestInvite: null,
};
