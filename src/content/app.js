import React, { Component } from 'react';
import { render } from 'react-dom';
import { browserHistory, Router, Route, Link } from 'react-router';
import SideBar from './sidebar';
import BodyContent from './body-content';

const App = React.createClass({
  getInitialState() {
    return {
      users: [],
      activeUserInfo: {},
      activeUserOrgs: [],
      loading: false,
      usersLoading: true
    };
  },
  // onPageLoad
  componentDidMount() {
    this.requestAllUsers = $.get("https://api.github.com/orgs/code42/members", function (result) {
      this.setState({
        users: result,
        usersLoading: false
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
          <SideBar users={this.state.users} usersLoading={this.state.usersLoading}/>
        </div>
        <div className="content">
          <BodyContent activeUserInfo={this.state.activeUserInfo}
                       activeUserOrgs={this.state.activeUserOrgs}
                       loading={this.state.loading}
                       usersLoading={this.state.usersLoading}/>
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
