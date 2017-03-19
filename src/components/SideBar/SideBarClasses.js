import React, { PropTypes, Component } from 'react';
import { Nav, NavItem, Button } from 'react-bootstrap';
import plusSign from '../../assets/images/plus.svg';

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
          placeholder="Search for a quiz"
          onChange={this.filterItems}
        />
      </NavItem>
    );
  }
  render() {
    let createClassButton = (null);
    if (this.props.userType === 'teacher') {
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
    return (
      <div>
        {this.renderSearchBar()}
        <Nav>
          { createClassButton }
          {
         this.state.content.map((obj, index) => {
           if (index < 8) {
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
};
SideBarClasses.defaultProps = {
  onCreateClassClick: null,
  onClassClick: null,
};
