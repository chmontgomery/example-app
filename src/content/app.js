const React = require('react');
const ReactDOM = require('react-dom');

const SideBar = React.createClass({
  render() {
    var rows = this.props.users.map((user) => {
      return (
        <li key={user.id} className={this.props.activeUser.id === user.id ? 'active': ''}>
          <a href="#" onClick={this.props.selectUser.bind(null,user)}>{user.login}</a>
        </li>
      );
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
            <a className="navbar-brand" href="#">Code42</a>
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
    var activeUser = this.props.activeUser;
    var userInfo = this.props.activeUserInfo;
    var userOrgs = this.props.activeUserOrgs;
    var orgs = userOrgs.map((org) => {
      return (
        <span key={org.id}>
          <img alt={org.login}
               height="42"
               width="42"
               src={org.avatar_url}/>
        </span>
      );
    });
    return (
      <div>
        <h1><img alt={activeUser.login}
                 height="48"
                 width="48"
                 src={activeUser.avatar_url}/>&nbsp;&nbsp;
          <a href={activeUser.html_url}>{activeUser.login}</a></h1>
        <div>
          <dl>
            <dt>Join Date</dt>
            <dd>{userInfo.created_at}</dd>
            <dt>Location</dt>
            <dd>{userInfo.location}</dd>
            <dt>Email</dt>
            <dd>{userInfo.email}</dd>
            <dt>Organizations</dt>
            <dd>{orgs}</dd>
          </dl>
        </div>
      </div>
    );
  }
});

const App = React.createClass({
  getInitialState: function () {
    return {
      users: [],
      activeUser: {},
      activeUserInfo: {},
      activeUserOrgs: []
    };
  },
  componentDidMount: function () {
    this.requestAllUsers = $.get(this.props.source, function (result) {
      this.setState({
        users: result
      });
    }.bind(this));
  },
  componentWillUnmount: function () {
    this.requestAllUsers.abort();
    this.userReq.abort();
    this.userOrgReq.abort();
  },
  selectUser: function (user) {
    var self = this;
    self.setState({
      activeUser: user
    });
    self.userReq = $.get('https://api.github.com/users/' + user.login);
    self.userOrgReq = $.get('https://api.github.com/users/' + user.login + '/orgs');
    $.when(self.userReq, self.userOrgReq).done(function (r1, r2) {
      self.setState({
        activeUserInfo: r1[0],
        activeUserOrgs: r2[0]
      });
    });
  },
  render() {
    return (
      <div className="container-fluid">
        <div className="row-fluid">
          <div className="col-xs-2" id="leftcolumn">
            <SideBar users={this.state.users} activeUser={this.state.activeUser} selectUser={this.selectUser}/>
          </div>
          <div className="col-xs-10">
            <BodyContent activeUser={this.state.activeUser}
                         activeUserInfo={this.state.activeUserInfo}
                         activeUserOrgs={this.state.activeUserOrgs}/>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <App source="https://api.github.com/orgs/code42/members"/>
  , document.getElementById('mount'));
