import React, { PropTypes, Component } from 'react';
import { Nav, NavItem, Button, Accordion, Panel } from 'react-bootstrap';
import { STUDENT, TEACHER } from '../../constants';

/*
  Component that contains the quizzes version of the sidebar
*/
export default class SideBarQuizzes extends Component {
  constructor() {
    super();
    this.filterItems = this.filterItems.bind(this);
    this.state = {
      content: {},
      activePanel: null,
    };
  }
  /*
  Mounting the component and setting the content of the sidebar according to the recieved
  content from the parent props
  */
  componentWillMount() {
    this.setState({ content: this.props.content });
  }
  /*
  Updating the current state of the component when the props will change.
  */
  componentWillReceiveProps(nextProps) {
    this.setState({ content: nextProps.content });
  }
  /*
  Search function that looks through the quizzes from the sidebar and filters them.
  It also calls some functions to decide which panel to expand from the Accordion based
  on the number of the results.
  @param event
  */
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
    if (!found && event.target.value !== '') {
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
  /*
  Decides which panel to expand in the accordion based on the number of the
  results from each panel. (Teacher mode);
  */
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
  /*
  Decide which panel to expand from the sidebar Accordion according to the
  largest number of results after the search is made. (Student mode)
  */
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
  /*
  Renders the search bar that filters quizzes
  */
  renderSearchBar() {
    let myStyle;
    if (this.props.userType === STUDENT) {
      myStyle = { top: '62px' };
    } else {
      myStyle = { top: '103px' };
    }
    return (
      <NavItem key={'searchBar'} >
        <div>
          <i style={myStyle} className="fa fa-search search_icon" aria-hidden="true" />
          <input
            className="searchBarItemSideBar"
            id="searchBar"
            type="text"
            placeholder="Search for a quiz"
            onChange={this.filterItems}
          />
        </div>
      </NavItem>
    );
  }
  /*
  Main render method where the sidebar is constructed based on the usertype currently on.
  Each usertype has a different sidebar view and it's structure in 2 separate ways.
  This function also limits the number of quizzes that can be displayed in the sidebar.
  */
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
      let unpublished = 0;
      let published = 0;
      let maxUnpublished = 7;
      let maxPublished = 7;
      if (unpublishedContent.length - maxUnpublished >= 1) {
        maxUnpublished -= 1;
      }
      if (publishedContent.length - maxPublished >= 1) {
        maxPublished -= 1;
      }

      return (
        <div>
          <Nav>
            <NavItem key={0}>
              <Button className="titleButton" onClick={() => this.props.onQuizCreatorClick()}>
                <i className="fa fa-plus" aria-hidden="true" /> Create a Quiz
              </Button>
            </NavItem>
          </Nav>
          {this.renderSearchBar()}
          <Nav key={'teacher'} >
            <Accordion defaultActiveKey={this.state.activePanel}>
              <Panel header={`Not published (${unpublishedContent.length})`} eventKey="1" onClick={() => { this.setState({ activePanel: null }); }}>
                {
        unpublishedContent.map((item, index) => {
          if (index < maxUnpublished) {
            return (
              <NavItem key={`unpublished${index + 1}`}>
                <Button className="sideBarButton" onClick={() => this.props.onQuizClick(item.id)}>
                  {item.title}
                </Button>
              </NavItem>
            );
          } unpublished += 1;
          if (index === unpublishedContent.length - 1) {
            return (
              <NavItem
                key={'moreunpublished'}
              >
                <Button className="sideBarButton" onClick={() => this.props.onSideBarTitleClick()}>
                and {unpublished} more
               </Button>
              </NavItem>
            );
          }
          return (null);
        },
        )
      }
              </Panel>
              <Panel header={`Published (${publishedContent.length})`} eventKey="2" onClick={() => { this.setState({ activePanel: null }); }} >
                {
        publishedContent.map((item, index) => {
          if (index < maxPublished) {
            return (
              <NavItem key={`published${index + 1}`}>
                <Button className="sideBarButton" onClick={() => this.props.onQuizClick(item.id)}>
                  {item.title}
                </Button>
              </NavItem>
            );
          } published += 1;
          if (index === publishedContent.length - 1) {
            return (
              <NavItem key={'morepublished'}>
                <Button className="sideBarButton" onClick={() => this.props.onSideBarTitleClick()}>
               and {published} more
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
      let notstarted = 0;
      let inprogress = 0;
      let submitted = 0;
      let maxNotStarted = 7;
      let maxInprogress = 7;
      let maxsubmitted = 7;
      if (notStartedContent.length - maxNotStarted >= 1) {
        maxNotStarted -= 1;
      }
      if (inprogressContent.length - maxInprogress >= 1) {
        maxInprogress -= 1;
      }
      if (submittedContent.length - maxsubmitted >= 1) {
        maxsubmitted -= 1;
      }
      return (
        <div>
          {this.renderSearchBar()}
          <Nav key={'student'}>
            <Accordion defaultActiveKey={this.state.activePanel}>
              <Panel header={`Not started (${notStartedContent.length})`} eventKey="1" onClick={() => { this.setState({ activePanel: null }); }}>
                {
            notStartedContent.map((item, index) => {
              if (index < maxNotStarted) {
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
              }notstarted += 1;
              if (index === notStartedContent.length - 1) {
                return (
                  <NavItem key={'nostarted'}>
                    <Button
                      className="sideBarButton" onClick={() => this.props.onSideBarTitleClick()}
                    >
                   and {notstarted} more
                  </Button>
                  </NavItem>
                );
              }
              return (null);
            },
        )
      }

              </Panel>
              <Panel header={`In progress (${inprogressContent.length})`} eventKey="2" onClick={() => { this.setState({ activePanel: null }); }}>
                {
          inprogressContent.map((item, index) => {
            if (index < maxInprogress) {
              return (
                <NavItem key={`inprogrs${index + 1}`}>
                  <Button className="sideBarButton" onClick={() => this.props.onQuizClick(item.id)}>
                    {item.title}
                  </Button>
                </NavItem>
              );
            }inprogress += 1;
            if (index === inprogressContent.length - 1) {
              return (
                <NavItem key={'inprogress'}>
                  <Button
                    className="sideBarButton" onClick={() => this.props.onSideBarTitleClick()}
                  >
                 and {inprogress} more
                </Button>
                </NavItem>
              );
            }
            return (null);
          },
        )
      }
              </Panel>
              <Panel header={`Submitted (${submittedContent.length})`} eventKey="3" onClick={() => { this.setState({ activePanel: null }); }}>
                {
            submittedContent.map((item, index) => {
              if (index < maxsubmitted) {
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
              }submitted += 1;
              if (index === submittedContent.length - 1) {
                return (
                  <NavItem key={'submitted'}>
                    <Button
                      className="sideBarButton" onClick={() => this.props.onSideBarTitleClick()}
                    >
                   and {submitted} more
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
  onSideBarTitleClick: PropTypes.func,
};
SideBarQuizzes.defaultProps = {
  onQuizCreatorClick: null,
  onSideBarTitleClick: null,
  content: PropTypes.arrayOf(PropTypes.shape({
    id: 0,
    title: '',
  })),
  onQuizClick: null,
};
