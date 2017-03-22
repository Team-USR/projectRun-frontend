import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { SearchSpinner } from '../../../components/utils';

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
    };

    this.updateSearch = this.updateSearch.bind(this);
  }

  componentWillMount() {
    this.setState({
      foundClasses: this.props.searchedClasses,
      loadingClassesSearch: this.props.loadingClassesSearch,
      pendingClasses: this.props.pendingClasssesRequests,
      moveToPendingError: this.props.moveToPendingError,

    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      foundClasses: nextProps.searchedClasses,
      loadingClassesSearch: nextProps.loadingClassesSearch,
      pendingClasses: nextProps.pendingClasssesRequests,
      moveToPendingError: nextProps.moveToPendingError,
    });
  }

  updateSearch(event) {
    const searchedTerm = event.target.value.toLowerCase();
    this.props.searchClassForInvite(searchedTerm);
    this.setState({ searchTerm: event.target.value });
  }
  renderPendingClasses() {
    const element = [];
    if (this.state.pendingClasses.length > 0) {
      element.push(<h3 key={'pendingRequests'}>Invitations</h3>);
    }
    if (this.state.pendingClasses !== undefined && this.state.pendingClasses !== null) {
      this.state.pendingClasses.map((cl) => {
        element.push(
          <li
            className="pendingButtons"
            key={`pendingList${cl.id}`}
          >
            <Col md={12} key={`item${cl.id + 1}`}>
              <Col md={6}>
                <div className="className">
                  {cl.name}
                </div>
              </Col>
              <Col md={6}>
                <Button
                  className="inviteButton"
                  key={`invitation${cl.id}`}
                  onClick={() => null}
                >
                  <span className="glyphicon glyphicon-log-in" />
                </Button>
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
          <h1><b>Request Class Invitation</b></h1>
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
  moveToPendingError: React.PropTypes.bool,
  moveToRequests: React.PropTypes.func,
};
ClassSearchPanel.defaultProps = {
  searchedClasses: {},
  searchClassForInvite: null,
  loadingClassesSearch: false,
  pendingClasssesRequests: {},
  moveToPendingError: false,
  moveToRequests: null,
};
