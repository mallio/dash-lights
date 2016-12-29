import React, { Component } from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';


import axios from 'axios';
import apiConfig from '../../config/api.json';
import './App.css';

/**
 * Handles calls to the Node backend that controls the dash buttons and
 * stores the configuration
 */
const backend = {
  _ajax: axios.create({baseURL: `http://${apiConfig.backend.server}:${apiConfig.backend.port}`}),

  api(method, url, data) {
    return this._ajax({method, url, data});
  },

  newButton(data) {
    return this.api('post', '/buttons/new', data);
  },

  buttons(data) {
    return this.api(data ? 'post' : 'get', '/buttons', data);
  }
}

/**
 * Handles calls to the Hue API
 */
const hue = {
  _ajax: axios.create({baseURL: `http://${apiConfig.hue.bridge}/api/${apiConfig.hue.username}`}),

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
        <MapList items={this.state.items} resource={this.props.resource} />
        <div key={this.props.parent.params.id}>
          {this.props.parent.children}
        </div>
      </div>
    );
  }
}

function MapList(props) {
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

  handleSubmit = (data)=>{
    hue[this.props.resource](this.props.id, data).then(()=>window.location.reload());
  }

  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        {!this.props.fields ? "" : (
          <Form key={this.state.item.name} fields={this.props.fields} value={this.state.item} onSubmit={this.handleSubmit} />
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
      state[field.name] = this.fieldDefault(field);
    });
    this.state = state;
  }

  fieldDefault(field) {
    return field.type === 'check' ? [] : "";
  }

  componentDidMount() {
    const state = {};
    this.props.fields.forEach((field)=>{
      state[field.name] = this.props.value[field.name] || this.fieldDefault(field);
    });
    this.setState(state);
  }

  handleChange = (event)=>{
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit = (event)=>{
    event.preventDefault();
    this.props.onSubmit(this.state);
  }

  renderField = (field)=>{
    if (field.type === 'check') {
      return (
        <CheckboxFieldset key={field.name} name={field.name} label={field.label} options={field.options}
            value={this.state[field.name]} onChange={this.handleChange} />
      );
    } else {
      return (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input type="text" id={field.name} value={this.state[field.name]}  onChange={this.handleChange} />
        </div>
      );
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.props.fields.map(this.renderField)}
        <input type="submit" value="Save" />
      </form>
    )
  }
}

class CheckboxFieldset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    }
  }

  componentDidMount() {
   if (this.props.options instanceof Promise) {
      this.props.options.then(this.setOptions.bind(this));
    } else {
      this.setOptions(this.props.options);
    }
  }

  setOptions(options) {
    this.setState({options});
  }

  handleChange = (value)=> {
    var event = {
      target: {}
    }
    event.target.value = value;
    event.target.id = this.props.name;
    this.props.onChange(event);
  }

  render() {
    function id(option) {
      return option.name + option.value;
    }
    return (
      <fieldset>
        {this.props.label && <legend>{this.props.label}</legend>}
        <CheckboxGroup name={this.props.name} value={this.props.value || []} onChange={this.handleChange}>
          {this.state.options.map(option =>
            <div key={option.value}>
              <Checkbox value={option.value} id={id(option)} />
              <label htmlFor={id(option)}>{option.label}</label>
            </div>
          )}
        </CheckboxGroup>
      </fieldset>
    )
  }
}

class DashButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    backend.buttons().then(res => this.setState({items: res.data}))
  }

  render() {
    return (
      <div>
        <h2>Dash Buttons</h2>
        <MapList items={this.state.items} resource="dash-buttons" />
        <div key={this.props.params.id}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

class DashButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: {}
    };
  }

  componentDidMount() {
    const id = this.props.params.id;
    backend.buttons().then(res => {
      this.setState({item: res.data[id]})
    });
  }

  fields() {
    return [
      {name: 'name', label: 'Name'},
      {name: 'lights', label: 'Lights', type: 'check', options: this.options('lights')},
      {name: 'groups', label: 'Groups', type: 'check', options: this.options('groups')}
    ]
  }

  options(type) {
    return new Promise((resolve)=>{
      hue[type]().then(response => {
        resolve(Object.keys(response.data).map(id => {
          return {value: id, label: response.data[id].name};
        }));
      });
    });
  }

  handleSubmit = (data)=>{
    const id = this.props.params.id;
    backend.buttons().then(res => {
      const buttons = res.data;
      buttons[id] = data;
      backend.buttons(buttons);
    });
  }

  render() {
    return (
      <div>
        <h3>Dash Button</h3>
        <Form key={this.state.item.name} fields={this.fields()} value={this.state.item} onSubmit={this.handleSubmit} />
      </div>
    );
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
