import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'

import './App.css';

import {DashButtons, DashButton, NewDashButton} from './sections/DashButtons';
import {Groups, Group} from './sections/Groups';
import {Lights, Light} from './sections/Lights';

class App extends Component {
  render() {
    let className = (path)=>{
      let names = ["pure-menu-item"];
      if (window.location.pathname.includes(path)) {
        names.push('pure-menu-selected');
      }
      return names.join(' ');
    }

    return (
      <div>
        <div className="head-menu pure-menu pure-menu-horizontal">
          <ul className="pure-menu-list">
            <li className={className('dash-buttons')}><Link className="pure-menu-link" to="/dash-buttons">Dash Buttons</Link></li>
            <li className={className('groups')}><Link className="pure-menu-link" to="/groups">Groups</Link></li>
            <li className={className('lights')}><Link className="pure-menu-link" to="/lights">Lights</Link></li>
          </ul>
        </div>
        {this.props.children}
      </div>
    );
  }
}

class Routing extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="dash-buttons" component={DashButtons}>
            <Route path="new" component={NewDashButton} />
            <Route path=":id" component={DashButton} />
          </Route>
          <Route path="groups" component={Groups}>
            <Route path=":id" component={Group} />
          </Route>
          <Route path="lights" component={Lights}>
            <Route path=":id" component={Light} />
          </Route>
        </Route>
      </Router>
    );
  }
}

export default App;
export {Routing};
