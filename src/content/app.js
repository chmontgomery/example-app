import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link } from 'react-router'
import moment from 'moment';

class SideBar extends Component {
  render() {
    return (
      <div className="sidebar-nav">
        <div className="sidebar-title"><Link to={'/'}>Code42</Link></div>
        <ul>
          {this.props.users.map((user, i) => (
            <li key={i}>
              <Link to={`/${user.login}`}>{user.login}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const BodyContent = React.createClass({
  render() {

    const userInfo = this.props.activeUserInfo;
    const userOrgs = this.props.activeUserOrgs;

    if (this.props.loading) {
      return (
        <div>
          loading...
        </div>
      )
    }

    if (!userInfo.login) {
      return (
        <p>
          Choose a user from the left...
        </p>
      )
    }

    const orgs = userOrgs.map((org) => {
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
          <a href={userInfo.html_url}>
            <img alt={userInfo.login}
                 height="230"
                 width="230"
                 src={userInfo.avatar_url}/>
          </a>
        </div>
        <h1>
          <div className="card-fullname">{userInfo.name}</div>
          <div className="card-username">{userInfo.login}</div>
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
  getInitialState() {
    return {
      users: [],
      activeUserInfo: {},
      activeUserOrgs: [],
      loading: false
    };
  },
  // onPageLoad
  componentDidMount() {
    this.requestAllUsers = $.get("https://api.github.com/orgs/code42/members", function (result) {
      this.setState({
        users: result
      });
    }.bind(this));
    if (this.props.params['username'])
      this.selectUser(this.props.params['username']);
  },
  // onRouteChange
  componentWillReceiveProps(nextProps) {
    // TODO if not diff from prev, do nothing
    if (nextProps)
      this.selectUser(nextProps.params['username']);
  },
  componentWillUnmount() {
    this.requestAllUsers.abort();
    this.userReq.abort();
    this.userOrgReq.abort();
  },
  selectUser(username) {
    let self = this;
    if (!username) {
      return self.setState({
        activeUserInfo: {},
        activeUserOrgs: []
      });
    }
    self.setState({
      loading: true
    });
    // abort any previous requests
    if (self.userReq)
      self.userReq.abort();
    if (self.userOrgReq)
      self.userOrgReq.abort();
    self.userReq = $.get('https://api.github.com/users/' + username);
    self.userOrgReq = $.get('https://api.github.com/users/' + username + '/orgs');
    $.when(self.userReq, self.userOrgReq).done(function (r1, r2) {
      //setTimeout(() => {
        self.setState({
          activeUserInfo: r1[0],
          activeUserOrgs: r2[0],
          loading: false
        });
      //}, 2000);
    });
  },
  render() {
    return (
      <div>
        <div className="sidebar">
          <SideBar users={this.state.users}/>
        </div>
        <div className="content">
          <BodyContent activeUserInfo={this.state.activeUserInfo}
                       activeUserOrgs={this.state.activeUserOrgs}
                       loading={this.state.loading}/>
        </div>
      </div>
    );
  }
});

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path=":username" component={BodyContent}/>
    </Route>
  </Router>
  , document.getElementById('mount'));
