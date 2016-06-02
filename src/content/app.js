const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');

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
    var location;
    if (userInfo.location) {
      location = (
        <div>
          <i className="fa fa-map-marker"></i>
          &nbsp;&nbsp;{userInfo.location}
        </div>
      )
    }
    var email;
    if (userInfo.email) {
      email = (
        <div>
          <i className="fa fa-envelope"></i>
          &nbsp;&nbsp;{userInfo.email}
        </div>
      )
    }
    return (
      <div>
        <div>
          <a href={activeUser.html_url}>
            <img alt={activeUser.login}
                 height="230"
                 width="230"
                 src={activeUser.avatar_url}/>
          </a>
        </div>
        <h1>
          <div className="card-fullname">{userInfo.name}</div>
          <div className="card-username">{activeUser.login}</div>
        </h1>
        <div className="info-block">
          {location}
          <div>
            <i className="fa fa-clock-o"></i>
            &nbsp;&nbsp;Joined on {moment(userInfo.created_at).format('MMM Do, YYYY')}
          </div>
          {email}
        </div>
        <div className="info-block">
          <div className="card-orgname">Organizations</div>
          <div>{orgs}</div>
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
          <div className="col-xs-10" style={{'padding-top':'15px'}}>
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
