import React from 'react';
import moment from 'moment';

export default React.createClass({
  render() {

    const userInfo = this.props.activeUserInfo;
    const userOrgs = this.props.activeUserOrgs;

    if (this.props.loading || this.props.usersLoading) {
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
