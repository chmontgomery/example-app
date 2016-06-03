import React, { Component } from 'react';
import { Link } from 'react-router';

class SideBar extends Component {
  render() {
    if (this.props.usersLoading) {
      return (
        <div className="sidebar-nav">
          <div className="sidebar-title"><Link to={'/'}>Code42</Link></div>
          <ul>
            <li>
              <a>loading users...</a>
            </li>
          </ul>
        </div>
      )
    }
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

export { SideBar as default}
