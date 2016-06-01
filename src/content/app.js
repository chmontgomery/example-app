const React = require('react');
const ReactDOM = require('react-dom');

const SideBar = React.createClass({
  render() {
    var rows = this.props.users.map((user) => {
      return (<li key={user.id}><a href="#" onClick={this.props.selectUser.bind(null,user)}>{user.login}</a></li>);
    });
    return (
      <div>
        <nav className="navbar navbar-default" role="navigation">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Code42 Org</a>
          </div>

          <div className="collapse navbar-collapse navbar-ex1-collapse">
            <ul className="nav navbar-nav">
              {rows}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
});

const BodyContent = React.createClass({
  render() {
    return (
      <div>
        <h1>booya</h1>
        <p>
          This example will automatically dock the sidebar if the page
          width is above 800px (which is currently).
        </p>
        <p>
          This functionality should live in the component that renders the sidebar.
          This way you're able to modify the sidebar and main content based on the
          responsiveness data. For example, the menu button in the header of the
          content is now  because the sidebar
          is  visible.
        </p>
      </div>
    );
  }
});

const App = React.createClass({
  getInitialState: function() {
    return {
      users: [],
      activeUser: {}
    };
  },
  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {
      this.setState({
        users: result
      });
    }.bind(this));
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  selectUser: function(user) {
    console.log('yolo', user)
  },
  render() {
    return (
      <div className="container-fluid">
        <div className="row-fluid">
          <div className="col-xs-2" id="leftcolumn">
            <SideBar users={this.state.users} activeUser={this.state.activeUser} selectUser={this.selectUser}/>
          </div>
          <div className="col-xs-10">
            <BodyContent/>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<App source="https://api.github.com/orgs/code42/members"/>, document.getElementById('mount'));
