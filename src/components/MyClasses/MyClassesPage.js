import React, { Component } from 'react';
import { SideBarWrapper } from '../SideBar/index';

export default class MyClassesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  handleClassClick(currentClass) {
    this.currentClass = currentClass;
  }

  render() {
    return (
      <div className="myClassesPageWrapper">
        <SideBarWrapper
          onSideBarItemClick={currentClass => this.handleClassClick(currentClass)}
          title={'My Classes'}
          type={'SideBarClasses'}
        />
        <div className="contentWrapper">
          <h1><b> My Classes</b></h1>
        </div>
      </div>
    );
  }
}
