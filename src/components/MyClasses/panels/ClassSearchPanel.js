import React from 'react';

export default class ClassSearchPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
    };

    this.updateSearch = this.updateSearch.bind(this);
  }

  componentWillMount() {
    this.props.getAllClasses();
  }

  updateSearch(term) {
    this.setState({ searchTerm: term });
  }

  render() {
    const allClasses = this.props.allClasses;
    return (
      <div>
        <div>
          <h1><b>Request Class Invitation</b></h1>
          <hr />
        </div>

        <input onChange={this.updateSearch} />
        {allClasses.map(cl => (
          <div className="class-panel" key={cl.id}>
            <div className="class-name">{cl.name}</div>
          </div>
        ))}
      </div>
    );
  }
}

ClassSearchPanel.propTypes = {
  allClasses: React.PropTypes.arrayOf(React.PropTypes.shape({})).isRequired,
  getAllClasses: React.PropTypes.func.isRequired,
};
