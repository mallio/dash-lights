import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'

import './App.css';

import {DashButtons, DashButton, NewDashButton} from './sections/DashButtons';
import {Groups, Group} from './sections/Groups';
import {Lights, Light} from './sections/Lights';

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/dash-buttons">Dash Buttons</Link></li>
          <li><Link to="/groups">Groups</Link></li>
          <li><Link to="/lights">Lights</Link></li>
        </ul>
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
