import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'

import axios from 'axios';
import apiConfig from '../../config/api.json';
import './App.css';

/**
 * Handles calls to the Node backend that controls the dash buttons and
 * stores the configuration
 */
const backend = {
  /*getConfig() {
    return new Promise((resolve) => {
      resolve(apiConfig);
    });
  }*/
}

/**
 * Handles calls to the Hue API
 */
const hue = {
  /*_ajax: new Promise((resolve) => {
    backend.getConfig().then((config)=> {
      const baseURL = `${config.hue.baseUrl}/${config.hue.username}`;
      resolve(axios.create({baseURL}));
    });
  }),

  api(method, url, data) {
    return new Promise((resolve) => {
      this._ajax.then((ajax) => {
        ajax({method, url, data}).then(resolve);
      });
    })
  },*/

  _ajax: axios.create({baseURL: `${apiConfig.hue.baseUrl}/${apiConfig.hue.username}`}),

  api(method, url, data) {
    return this._ajax({method, url, data});
  },

  lights() {
    return this.api('get', '/lights');
  },

  light(id) {
    return this.api('get', `/lights/${id}`);
  },

  groups() {
    return this.api('get', '/groups');
  },

  group(id, data) {
    return this.api(data ? 'put' : 'get', `/groups/${id}`, data);
  }
}

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

class DashButtons extends Component {
  render() {
    return (
      <h2>Dash Buttons</h2>
    )
  }
}

class DashButton extends Component {
  render() {
    return (
      <h3>Dash Button</h3>
    );
  }
}

class HueCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    hue[this.props.resource]().then(res => this.setState({items: res.data}))
  }

  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <HueList items={this.state.items} resource={this.props.resource} />
        <div key={this.props.parent.params.id}>
          {this.props.parent.children}
        </div>
      </div>
    );
  }
}

function HueList(props) {
  const items = Object.keys(props.items).map(id => {
    const item = props.items[id];
    const link = `/${props.resource}/${id}`;
    return (
      <li key={id}><Link to={link}>{item.name}</Link></li>
    )
  });

  return (
    <ul>{items}</ul>
  );
}

class HueObject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: {}
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    const id = this.props.id;
    hue[this.props.resource](id).then(res => {
      this.setState({item: res.data})
    });
  }

  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        {!this.props.fields ? "" : (
          <Form key={this.state.item.name} id={this.props.id} resource={this.props.resource} fields={this.props.fields} value={this.state.item} />
        )}
        <pre>
          {JSON.stringify(this.state.item, null, 4)}
        </pre>
      </div>
    );
  }
}

class Form extends Component {
  constructor(props) {
    super(props);
    const state = {};
    props.fields.forEach((field)=>{
      state[field.name] = "";
    });
    this.state = state;
  }

  componentDidMount() {
    const state = {};
    this.props.fields.forEach((field)=>{
      state[field.name] = this.props.value[field.name] || "";
    });
    this.setState(state);
  }

  handleChange = (event)=>{
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = (event)=>{
    event.preventDefault();
    hue[this.props.resource](this.props.id, this.state).then(()=>window.location.reload());
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.props.fields.map(field =>
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <input type="text" name={field.name} value={this.state[field.name]}  onChange={this.handleChange} />
          </div>
        )}
        <input type="submit" value="Save" />
      </form>
    )
  }
}

class Groups extends Component {
  render() {
    return (
      <HueCollection title="Groups" resource="groups" parent={this.props} />
    );
  }
}

class Group extends Component {
  fields() {
    return [
      {name: 'name', label: "Name"},
      {name: 'type', label: "Type"}
    ]
  }

  render() {
    return (
      <HueObject title="Group" resource="group" id={this.props.params.id} fields={this.fields()} />
    );
  }
}

class Lights extends Component {
  render() {
    return (
      <HueCollection title="Lights" resource="lights" parent={this.props} />
    );
  }
}

class Light extends Component {
  render() {
    return (
      <HueObject title="Light" resource="light" id={this.props.params.id} />
    );
  }
}

class Routing extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="dash-buttons" component={DashButtons}>
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
