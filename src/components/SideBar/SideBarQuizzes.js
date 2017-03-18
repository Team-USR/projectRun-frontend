import React, { PropTypes, Component } from 'react';
import { Nav, NavItem, Button, Accordion, Panel } from 'react-bootstrap';
import { STUDENT, TEACHER } from '../../constants';
import plusSign from '../../assets/images/plus.svg';

export default class SideBarQuizzes extends Component {
  constructor() {
    super();
    this.filterItems = this.filterItems.bind(this);
    this.state = {
      content: {},
      activePanel: null,
    };
  }
  componentWillMount() {
    this.setState({ content: this.props.content });
  }
  filterItems(event) {
    let found = false;
    let filteredContent = this.props.content.filter((item) => {
      if (item.title.toLowerCase() === event.target.value.toLowerCase() ||
          item.title.toLowerCase().includes(event.target.value.toLowerCase())) {
        found = true;
        return (item);
      }
      return (null);
    });
    if (!found && event.target.valaue !== '') {
      filteredContent = [];
    } else
    if (filteredContent.length === 0 || event.target.value === '') {
      filteredContent = this.props.content;
    }
    if (this.props.userType === STUDENT) {
      if (filteredContent.length === 0 || event.target.value === '') {
        this.setState({ activePanel: null });
      } else {
        this.decideActiveStudentPanel(filteredContent);
      }
    }
    if (this.props.userType === TEACHER) {
      if (filteredContent.length === 0 || event.target.value === '') {
        this.setState({ activePanel: null });
      } else {
        this.deciceActiveTeacherPanel(filteredContent);
      }
    }
    this.setState({ content: filteredContent });
  }
  deciceActiveTeacherPanel(filteredContent) {
    this.filteredContent = filteredContent;
    let con = filteredContent;
    con = con.sort((a, b) => {
      if (a.published) return -1;
      if (b.published) return 1;
      return 0;
    });
    let counter = 0;
    let max = 0;
    let type = '';
    con.map((item, index) => {
      if (con[index + 1] !== null && con[index + 1] !== undefined) {
        if (item.published === con[index + 1].published) {
          counter += 1;
          if (counter >= max) {
            max = counter;
            type = item.published;
          }
        } else counter = 0;
      }
      if (con.length === 1) {
        type = item.published;
      }
      return 0;
    });
    if (type === false) {
      this.setState({ activePanel: '1' });
    }
    if (type === true) {
      this.setState({ activePanel: '2' });
    }
  }
  decideActiveStudentPanel(filteredContent) {
    this.filteredContent = filteredContent;
    let con = filteredContent;
    con = con.sort((a, b) => {
      if (a.status < b.status) return -1;
      if (a.status > b.status) return 1;
      return 0;
    });
    let counter = 0;
    let max = 0;
    let type = '';
    con.map((item, index) => {
      if (con[index + 1] !== null && con[index + 1] !== undefined) {
        if (item.status === con[index + 1].status) {
          counter += 1;
          if (counter >= max) {
            max = counter;
            type = item.status;
          }
        } else counter = 0;
      }
      if (con.length === 1) {
        type = item.status;
      }
      return 0;
    },
);
    if (type === 'not_started') {
      this.setState({ activePanel: '1' });
    }
    if (type === 'in_progress') {
      this.setState({ activePanel: '2' });
    }
    if (type === 'submitted') {
      this.setState({ activePanel: '3' });
    }
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
    const content = this.state.content;
    if (this.props.userType === TEACHER) {
      const publishedContent = content.filter((item) => {
        if (item.published) {
          return (item);
        }
        return (null);
      });
      const unpublishedContent = content.filter((item) => {
        if (!item.published) {
          return (item);
        }
        return (null);
      });
      return (
        <div>
          {this.renderSearchBar()}
          <Nav>
            <NavItem key={0}>
              <Button className="titleButton" onClick={() => this.props.onQuizCreatorClick()}>
                <div className="row">
                  <div className="col-md-3 plusIconWrapper">
                    <img className="plusIcon" src={plusSign} alt={'+'} />
                  </div>
                  <div className="col-md-9 createText">
                Create a quiz
                </div>
                </div>
              </Button>
            </NavItem>
          </Nav>
          <Nav key={'teacher'} >
            <Accordion defaultActiveKey={this.state.activePanel}>
              <Panel header={`Unpublished (${unpublishedContent.length})`} eventKey="1">
                {
        unpublishedContent.map((item, index) => {
          if (index < 5) {
            return (
              <NavItem key={`unpublished${index + 1}`}>
                <Button className="sideBarButton" onClick={() => this.props.onQuizClick(item.id)}>
                  {item.title}
                </Button>
              </NavItem>
            );
          }
          return (null);
        },
        )
      }
              </Panel>
              <Panel header={`Published (${publishedContent.length})`} eventKey="2">
                {
        publishedContent.map((item, index) => {
          if (index < 5) {
            return (
              <NavItem key={`published${index + 1}`}>
                <Button className="sideBarButton" onClick={() => this.props.onQuizClick(item.id)}>
                  {item.title}
                </Button>
              </NavItem>
            );
          }
          return (null);
        },
        )
      }
              </Panel>
            </Accordion>
          </Nav>
        </div>
      );
    }
    if (this.props.userType === STUDENT) {
      const notStartedContent = content.filter((item) => {
        if (item.status === 'not_started') {
          return (item);
        }
        return (null);
      });
      const inprogressContent = content.filter((item) => {
        if (item.status === 'in_progress') {
          return (item);
        }
        return (null);
      });
      const submittedContent = content.filter((item) => {
        if (item.status === 'submitted') {
          return (item);
        }
        return (null);
      });
      return (
        <div>
          {this.renderSearchBar()}
          <Nav key={'student'}>
            <Accordion defaultActiveKey={this.state.activePanel}>

              <Panel header={`Not started (${notStartedContent.length})`} eventKey="1" >
                {
            notStartedContent.map((item, index) => {
              if (index < 5) {
                return (
                  <NavItem key={`notstarted${index + 1}`}>
                    <Button
                      className="sideBarButton"
                      onClick={() => this.props.onQuizClick(item.id)}
                    >
                      {item.title}
                    </Button>
                  </NavItem>
                );
              }
              return (null);
            },
        )
      }

              </Panel>
              <Panel header={`In progress (${inprogressContent.length})`} eventKey="2">
                {
          inprogressContent.map((item, index) => {
            if (index < 5) {
              return (
                <NavItem key={`inprogrs${index + 1}`}>
                  <Button className="sideBarButton" onClick={() => this.props.onQuizClick(item.id)}>
                    {item.title}
                  </Button>
                </NavItem>
              );
            }
            return (null);
          },
        )
      }
              </Panel>
              <Panel header={`Submitted (${submittedContent.length})`} eventKey="3">
                {
            submittedContent.map((item, index) => {
              if (index < 5) {
                return (
                  <NavItem key={`submitted${index + 1}`}>
                    <Button
                      className="sideBarButton"
                      onClick={() => this.props.onQuizClick(item.id)}
                    >
                      {item.title}
                    </Button>
                  </NavItem>
                );
              }
              return (null);
            },
        )
      }
              </Panel>
            </Accordion>
          </Nav>
        </div>
      );
    }
    return (null);
  }

}

SideBarQuizzes.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  })),
  onQuizCreatorClick: PropTypes.func,
  userType: PropTypes.string.isRequired,
  onQuizClick: PropTypes.func,
};
SideBarQuizzes.defaultProps = {
  onQuizCreatorClick: null,
  content: PropTypes.arrayOf(PropTypes.shape({
    id: 0,
    title: '',
  })),
  onQuizClick: null,
};
