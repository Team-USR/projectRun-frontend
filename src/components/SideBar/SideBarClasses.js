import React, { PropTypes, Component } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';
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
  componentWillReceiveProps(nextProps) {
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
    let myStyle;
    if (this.props.userType === STUDENT) {
      myStyle = { top: '99px' };
    } else {
      myStyle = { top: '103px', zIndex: '3' };
    }
    return (
      <NavItem key={'searchBar'} >
        <div>
          <i style={myStyle} className="fa fa-search search_icon2" aria-hidden="true" />
          <input
            className="searchBarItemSideBar"
            id="searchBar"
            type="text"
            placeholder="Search for a class"
            onChange={this.filterItems}
          />
        </div>
      </NavItem>
    );
  }

  renderSearchButton() {
    if (this.props.userType === STUDENT) {
      return (
        <div>
          <Button
            className="mainButton"
            onClick={() => this.props.handleSearchClassForRequestInvite()}
          >
            Join a class
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
            <i className="fa fa-plus" aria-hidden="true" />  Create Class
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
        { createClassButton }
        { this.renderSearchButton() }
        { this.renderSearchBar() }
        <Nav>
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
