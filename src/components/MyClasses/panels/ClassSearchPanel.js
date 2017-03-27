import React from 'react';
import axios from 'axios';
import { Button, Col } from 'react-bootstrap';
import { SearchSpinner } from '../../../components/utils';
import { API_URL } from '../../../constants';

let timeout = null;
export default class ClassSearchPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      foundClasses: [],
      pendingClasses: [],
      loadingClassesSearch: false,
      moveToPendingError: false,
      sentClasses: [],
      sentClassesInfo: [],
    };

    this.updateSearch = this.updateSearch.bind(this);
  }

  componentWillMount() {
    this.setState({
      foundClasses: this.props.searchedClasses,
      loadingClassesSearch: this.props.loadingClassesSearch,
      pendingClasses: this.props.pendingClasssesRequests,
      moveToPendingError: this.props.moveToPendingError,
      sentClasses: this.props.sentClasses,

    });
    this.loadPendingRequests();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      foundClasses: nextProps.searchedClasses,
      loadingClassesSearch: nextProps.loadingClassesSearch,
      pendingClasses: nextProps.pendingClasssesRequests,
      moveToPendingError: nextProps.moveToPendingError,
      sentClasses: nextProps.sentClasses,
    });
  }
  loadPendingRequests() {
    axios({
      url: `${API_URL}/users/mine/requests`,
      headers: this.props.userToken,
    })
    .then((response) => {
      const classes = this.state.pendingClasses;
      const sentClassesBools = this.state.sentClasses;
      const classesInfo = this.state.sentClassesInfo;
      response.data.map((item) => {
        classes.push({ id: item.group.id, name: item.group.name });
        sentClassesBools.push(item.group.id);
        classesInfo.push(item.requested_at);
        return 0;
      });
      this.setState({ pendingClasses: classes, sentClasses: sentClassesBools });
    });
  }

  updateSearch(event) {
    const searchedTerm = event.target.value;
    this.props.searchClassForInvite(searchedTerm);
    this.setState({ searchTerm: event.target.value });
  }
  renderPendingClasses() {
    const element = [];
    if (this.state.pendingClasses.length > 0) {
      element.push(<h3 key={'pendingRequests'}>Requests</h3>);
    }
    if (this.state.pendingClasses !== undefined && this.state.pendingClasses !== null) {
      this.state.pendingClasses.map((cl) => {
        let col = '';
        let createdAt = '';
        let iconClass = 'fa-paper-plane';
        this.state.sentClasses.map((item, index) => {
          if (item === cl.id) {
            col = 'green';
            iconClass = 'fa-check';
            if (this.state.sentClassesInfo[index]) {
              createdAt = this.state.sentClassesInfo[index];
            } else createdAt = 'Request sent';
          }
          return 0;
        });

        element.push(
          <li
            className="cardSection pendingButtons clearfix"
            key={`pendingList${cl.id}`}
          >
            <Col md={12} key={`item${cl.id + 1}`}>
              <Col md={6}>
                <div className="className">
                  {cl.name}
                  <Button
                    style={{ color: col }}
                    className="inviteButton"
                    key={`invitation${cl.id}`}
                    onClick={() => this.props.sendInvitation(cl.id)}
                  >
                    <span className={`fa ${iconClass}`} />
                  </Button>
                </div>
              </Col>
              <Col md={6} key={`info${cl.id + 1}`}>
                <div className="classInfo">
                  { createdAt }
                </div>
              </Col>
            </Col>
          </li>,
          );
        return (null);
      });
    }
    return element;
  }
  renderError() {
    if (this.state.moveToPendingError === true) {
      return (<h4 style={{ color: 'red' }}>This class has been already selected</h4>);
    }
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      this.setState({
        moveToPendingError: false,
      });
    }, 4000);
    return (null);
  }
  renderFoundClasses() {
    if (this.state.loadingClassesSearch) {
      return (
        <Col md={12}>
          <SearchSpinner className="searchSpinner" />
        </Col>
      );
    }

    const element = [];
    if (this.state.foundClasses !== undefined && this.state.foundClasses !== null) {
      this.state.foundClasses.map((cl) => {
        element.push(
          <Col md={12} key={`item${cl.id + 1}`}>
            <Button
              className="classStudentBtn"
              key={cl.id}
              onClick={() => this.props.moveToRequests(cl)}
            >
              {cl.name}
              <span className="glyphicon glyphicon-plus" />
            </Button>
          </Col>,
        );
        return null;
      });
    }
    return (element);
  }
  render() {
    return (
      <div className="classSearchPanelWrapper">
        <div>
          <h1><b>Join a class</b></h1>
          <hr />
        </div>
        <input
          className="searchBarItem"
          id="searchBarClasses"
          type="text"
          placeholder="Search for a class"
          onChange={this.updateSearch}
        />
        <div className="classSearchResultsPanel">
          {this.renderFoundClasses()}
        </div>
        {this.renderError()}
        <div className="pendingClasses">
          <ul>
            {this.renderPendingClasses()}
          </ul>
        </div>
      </div>
    );
  }
}

ClassSearchPanel.propTypes = {
  searchedClasses: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  searchClassForInvite: React.PropTypes.func,
  loadingClassesSearch: React.PropTypes.bool,
  pendingClasssesRequests: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  sentClasses: React.PropTypes.arrayOf(React.PropTypes.number),
  moveToPendingError: React.PropTypes.bool,
  moveToRequests: React.PropTypes.func,
  sendInvitation: React.PropTypes.func,
  userToken: React.PropTypes.shape({}).isRequired,
};
ClassSearchPanel.defaultProps = {
  searchedClasses: {},
  sentClasses: {},
  searchClassForInvite: null,
  loadingClassesSearch: false,
  pendingClasssesRequests: {},
  moveToPendingError: false,
  moveToRequests: null,
  sendInvitation: null,
};
